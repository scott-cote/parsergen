'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _parser = require('./parser.js');

var _parser2 = _interopRequireDefault(_parser);

var _simple_rules = require('./simple_rules.js');

var _simple_rules2 = _interopRequireDefault(_simple_rules);

var _state = require('./state.js');

var _state2 = _interopRequireDefault(_state);

var _states = require('./states.js');

var _states2 = _interopRequireDefault(_states);

var _term = require('./term.js');

var _term2 = _interopRequireDefault(_term);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import RulesModule from './rules.js';
//import SimpleRuleModule from './simple_rule.js';


var Term = _term2.default.createClass();
//let SimpleRule = SimpleRuleModule.createClass(Term);
var SimpleRules = _simple_rules2.default.createClass(Term);
var State = _state2.default.createClass();
//let GeneratorRules = RulesModule.createClass(SimpleRule, SimpleRules);
var States = _states2.default.createClass(State);

var Generator = {
  createParser: function createParser(code) {

    var simpleRules = new SimpleRules(code);
    var states = new States(simpleRules);
    var statesRender = states.render();
    code.states = states;
    return code; // { rules: simpleRules.render(), states: statesRender };
  }
};

var generator = function generator() {
  return _through2.default.obj(function (chunk, enc, done) {
    var parser = Generator.createParser(chunk);
    return done(null, parser);
  });
};

exports.default = generator;