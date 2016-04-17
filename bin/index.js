'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rules = require('./rules.js');

var _rules2 = _interopRequireDefault(_rules);

var _states = require('./states.js');

var _states2 = _interopRequireDefault(_states);

var _parser = require('./parser.js');

var _parser2 = _interopRequireDefault(_parser);

var _rule = require('./rule.js');

var _rule2 = _interopRequireDefault(_rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Rule = _rule2.default.createClass();

var ParserGen = {
  Rules: _rules2.default.createClass(Rule),
  States: _states2.default.createClass(),
  Parser: _parser2.default.createClass()
};

exports.default = ParserGen;