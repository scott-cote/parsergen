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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Term = _term2.default.createClass();
var SimpleRule = _simple_rule2.default.createClass(Term);
var Rule = _rule2.default.createClass(SimpleRule);
var SimpleRules = _simple_rules2.default.createClass(SimpleRule);
var State = _state2.default.createClass();
var GeneratorRules = _rules2.default.createClass(Rule, SimpleRules);
var States = _states2.default.createClass(State);

var Generator = {
  createParser: function createParser(code) {
    var nonterminals = [].concat(_toConsumableArray(new Set(code.rules.map(function (rule) {
      return rule.left;
    }))));
    var symbols = code.rules.map(function (rule) {
      return rule.right;
    }).reduce(function (value, syms) {
      return value.concat(syms);
    }, []).filter(function (symbol) {
      return !nonterminals.find(function (nonterminal) {
        return nonterminal === symbol;
      });
    });
    var terminals = [].concat(_toConsumableArray(new Set(symbols.concat('$'))));
    var generatorRules = new GeneratorRules(code.rules[0].left);
    code.rules.forEach(function (rule) {
      return generatorRules.addRule(rule.left, rule.right);
    });

    var simpleRules = generatorRules.createSimpleRules(terminals);
    var states = new States(simpleRules);

    var statesRender = states.render();
    return { rules: simpleRules.render(), states: statesRender };
  }
};

var generator = function generator() {
  return _through2.default.obj(function (chunk, enc, done) {
    var parser = Generator.createParser(chunk);
    return done(null, parser);
  });
};

exports.default = generator;