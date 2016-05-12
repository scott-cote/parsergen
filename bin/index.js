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
//import RulesModule from './rules.js';

var SimpleRule = _simple_rule2.default.createClass(Term);
var SimpleRules = _simple_rules2.default.createClass(SimpleRule);
var State = _state2.default.createClass();
//let GeneratorRules = RulesModule.createClass(SimpleRule, SimpleRules);
var States = _states2.default.createClass(State);

var Generator = {
  createParser: function createParser(code) {

    //let generatorRules = new GeneratorRules(code.rules[0].left);
    //code.rules.forEach(rule => generatorRules.addRule(rule.left, rule.right));

    //let simpleRules = generatorRules.createSimpleRules(code.terminals);

    var simpleRules = new SimpleRules(code.terminals);
    simpleRules.addRule(code.rules[0].left + "'", [{ symbol: code.rules[0].left, type: 'NONTERMINAL' }, { symbol: '$', type: 'TERMINAL' }]);
    code.rules.forEach(function (rule) {
      var right = rule.right.map(function (symbol) {
        return {
          symbol: symbol,
          type: code.terminals.has(symbol) ? 'TERMINAL' : 'NONTERMINAL'
        };
      });
      simpleRules.addRule(rule.left, right);
    });

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