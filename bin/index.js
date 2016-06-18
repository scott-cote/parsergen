'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _parser = require('./parser.js');

var _parser2 = _interopRequireDefault(_parser);

var _state = require('./state.js');

var _state2 = _interopRequireDefault(_state);

var _states = require('./states.js');

var _states2 = _interopRequireDefault(_states);

var _term = require('./term.js');

var _term2 = _interopRequireDefault(_term);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Term = _term2.default.createClass();
//let SimpleRule = SimpleRuleModule.createClass(Term);
//let SimpleRules = SimpleRulesModule.createClass(Term);

//import RulesModule from './rules.js';
//import SimpleRuleModule from './simple_rule.js';
//import SimpleRulesModule from './simple_rules.js';
var State = _state2.default.createClass(Term);
//let GeneratorRules = RulesModule.createClass(SimpleRule, SimpleRules);
var States = _states2.default.createClass(State, Term);

var Generator = {
  createParser: function createParser(code) {
    code.states = new States(code);
    return code;
  }
};

var generator = function generator() {
  return through.obj(function (chunk, enc, done) {
    var parser = Generator.createParser(chunk);
    return done(null, parser);
  });
};

exports.default = generator;