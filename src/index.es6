import through from 'through2';
import fs from 'fs';
import ParserModule from './parser.js';
import RulesModule from './rules.js';
import SimpleRuleModule from './simple_rule.js';
import SimpleRulesModule from './simple_rules.js';
import StateModule from './state.js';
import StatesModule from './states.js';
import TermModule from './term.js';

let Term = TermModule.createClass();
let SimpleRule = SimpleRuleModule.createClass(Term);
let SimpleRules = SimpleRulesModule.createClass(SimpleRule);
let State = StateModule.createClass();
let GeneratorRules = RulesModule.createClass(SimpleRule, SimpleRules);
let States = StatesModule.createClass(State);

let Generator = {
  createParser: function(code) {

    let generatorRules = new GeneratorRules(code.rules[0].left);
    code.rules.forEach(rule => generatorRules.addRule(rule.left, rule.right));

    let simpleRules = generatorRules.createSimpleRules(code.terminals);
    let states = new States(simpleRules);

    let statesRender = states.render();

    code.states = states;
    return code; // { rules: simpleRules.render(), states: statesRender };
  }
};

let generator = function() {
  return through.obj((chunk, enc, done) => {
    let parser = Generator.createParser(chunk);
    return done(null, parser);
  });
};

export default generator;
