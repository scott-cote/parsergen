'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parser = require('./parser.js');

var _parser2 = _interopRequireDefault(_parser);

var _rule = require('./rule.js');

var _rule2 = _interopRequireDefault(_rule);

var _rules = require('./rules.js');

var _rules2 = _interopRequireDefault(_rules);

var _simple_rule = require('./simple_rule.js');

var _simple_rule2 = _interopRequireDefault(_simple_rule);

var _simple_rules = require('./simple_rules.js');

var _simple_rules2 = _interopRequireDefault(_simple_rules);

var _state = require('./state.js');

var _state2 = _interopRequireDefault(_state);

var _states = require('./states.js');

var _states2 = _interopRequireDefault(_states);

var _term = require('./term.js');

var _term2 = _interopRequireDefault(_term);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Term = _term2.default.createClass();
var SimpleRule = _simple_rule2.default.createClass(Term);
var Rule = _rule2.default.createClass(SimpleRule);
var SimpleRules = _simple_rules2.default.createClass(SimpleRule);
var State = _state2.default.createClass();

var ParserGen = {
  Rules: _rules2.default.createClass(Rule, SimpleRules),
  States: _states2.default.createClass(State),
  Parser: _parser2.default.createClass()
};

exports.default = ParserGen;