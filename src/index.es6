import through from 'through2';
import fs from 'fs';
import ParserModule from './parser.js';
import RuleModule from './rule.js';
import RulesModule from './rules.js';
import SimpleRuleModule from './simple_rule.js';
import SimpleRulesModule from './simple_rules.js';
import StateModule from './state.js';
import StatesModule from './states.js';
import TermModule from './term.js';

let Term = TermModule.createClass();
let SimpleRule = SimpleRuleModule.createClass(Term);
let Rule = RuleModule.createClass(SimpleRule);
let SimpleRules = SimpleRulesModule.createClass(SimpleRule);
let State = StateModule.createClass();
let GeneratorRules = RulesModule.createClass(Rule, SimpleRules);
let States = StatesModule.createClass(State);

let Generator = {
  createParser: function(code) {
    let rules = code.rules;
    let nonterminals = [...new Set(rules.map(rule => rule.left))];
    let symbols = rules
      .map(rule => rule.right)
      .reduce((value, syms) => value.concat(syms), [])
      .filter(symbol => !nonterminals.find(nonterminal => nonterminal === symbol));
    let terminals = [...new Set(symbols.concat('$'))];
    let generatorRules = new GeneratorRules(rules[0].left);
    rules.forEach(rule => generatorRules.addRule(rule.left, rule.right));

    let simpleRules = generatorRules.createSimpleRules(terminals);
    let states = new States(simpleRules);

    let statesRender = states.render();
    return { rules: simpleRules.render(), states: statesRender };
  }
};

let generator = function() {
  return through.obj((chunk, enc, done) => {
    let parser = Generator.createParser(chunk);
    return done(null, parser);
  });
};

export default generator;
