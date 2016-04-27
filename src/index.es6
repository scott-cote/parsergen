import through2 from 'through2';
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

/*
let ParserGen = {
  Rules: RulesModule.createClass(Rule, SimpleRules),
  States: StatesModule.createClass(State),
  Parser: ParserModule.createClass()
};
*/

/*

let rules = new ParserGen.Rules('E');

rules.addRule('E', 'E * B');
rules.addRule('E', 'E + B');
rules.addRule('E', 'B');
rules.addRule('B', '0');
rules.addRule('B', '1');

let terminals = ['0', '1', '+', '*','$'];

let simpleRules = rules.createSimpleRules(terminals);
let states = new ParserGen.States(simpleRules);

states.printTable();

*/

let generator = function(options) {
  return through2((chunk, enc, done) => {
    return done(null, chunk.toString().toLowerCase());
  });
};

export default generator;
