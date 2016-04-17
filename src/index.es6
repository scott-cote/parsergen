
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
let SimpleRules = SimpleRulesModule.createClass();
let State = StateModule.createClass();

let ParserGen = {
  Rules: RulesModule.createClass(Rule, SimpleRules),
  States: StatesModule.createClass(State),
  Parser: ParserModule.createClass()
};

export default ParserGen;
