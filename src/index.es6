
import RulesModule from './rules.js';
import StatesModule from './states.js';
import ParserModule from './parser.js';
import RuleModule from './rule.js';

let Rule = RuleModule.createClass();

let ParserGen = {
  Rules: RulesModule.createClass(Rule),
  States: StatesModule.createClass(),
  Parser: ParserModule.createClass()
};

export default ParserGen;
