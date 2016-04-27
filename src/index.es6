import through from 'through2';
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

let parseRules = function(input) {
  let rules = input.split(';')
    .map(rule => rule.trim())
    .filter(rule => !!rule)
    .map(rule => {
      let [left, right] = rule.split('->').map(part => part.trim());
      return { left, right };
    });
  let nonterminals = [...new Set(rules.map(rule => rule.left))];
  let symbols = rules
    .map(rule => rule.right.split(' ').map(sym => sym.trim()))
    .reduce((value, syms) => value.concat(syms), [])
    .filter(symbol => !nonterminals.find(nonterminal => nonterminal === symbol));

  let terminals = [...new Set(symbols.concat('$'))];
  return rules;
};

let Generator = {
  createParser: function(rules) {
    let generatorRules = new GeneratorRules(rules[0].left);
    rules.forEach(rule => generatorRules.addRule(rule.left, rule.right));

    let simpleRules = generatorRules.createSimpleRules(terminals);
    let states = new States(simpleRules);

    states.printTable();

    return 'parser';
  }
};

let generator = function(options = {}) {
  return through((chunk, enc, done) => {

    /*

    RULES -> RULES RULE;
    RULES -> RULE;
    RULE -> LEFT TOKEN_ROCKET RIGHT TOKEN_SEMICOLON;
    LEFT -> TOKEN_IDENTIFIER;
    RIGHT -> RIGHT TOKEN_IDENTIFIER;
    RIGHT -> TOKEN_IDENTIFIER;


    */

    let rules = parseRules(chunk.toString());
    let parser = Generator.createParser(rules);

    return done(null, parser);
  });
};

export default generator;
