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

var _render = require('./render.js');

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Term = _term2.default.createClass();
var SimpleRule = _simple_rule2.default.createClass(Term);
var Rule = _rule2.default.createClass(SimpleRule);
var SimpleRules = _simple_rules2.default.createClass(SimpleRule);
var State = _state2.default.createClass();
var GeneratorRules = _rules2.default.createClass(Rule, SimpleRules);
var States = _states2.default.createClass(State);

/*
let parseRules = function(input) {
  let rules = input.split(';')
    .map(rule => rule.trim())
    .filter(rule => !!rule)
    .map(rule => {
      let [left, right] = rule.split('->').map(part => part.trim());
      return { left, right };
    });
  return rules;
};
*/

var Generator = {
  createParser: function createParser(code) {
    var rules = code.rules;
    var nonterminals = [].concat(_toConsumableArray(new Set(rules.map(function (rule) {
      return rule.left;
    }))));
    var symbols = rules.map(function (rule) {
      return rule.right;
    }).reduce(function (value, syms) {
      return value.concat(syms);
    }, []).filter(function (symbol) {
      return !nonterminals.find(function (nonterminal) {
        return nonterminal === symbol;
      });
    });
    var terminals = [].concat(_toConsumableArray(new Set(symbols.concat('$'))));
    var generatorRules = new GeneratorRules(rules[0].left);
    rules.forEach(function (rule) {
      return generatorRules.addRule(rule.left, rule.right);
    });

    var simpleRules = generatorRules.createSimpleRules(terminals);
    var states = new States(simpleRules);

    var statesRender = states.render();
    return (0, _render2.default)(simpleRules.render(), statesRender);

    /*
    let symbols = rules
      .map(rule => rule.right.map(sym => sym.trim ()))
      .reduce((value, syms) => value.concat(syms), [])
      .filter(symbol => !nonterminals.find(nonterminal => nonterminal === symbol));
     let terminals = [...new Set(symbols.concat('$'))];
    let generatorRules = new GeneratorRules(rules[0].left);
    rules.forEach(rule => generatorRules.addRule(rule.left, rule.right));
     let simpleRules = generatorRules.createSimpleRules(terminals);
    let states = new States(simpleRules);
     let statesRender = states.render();
     return render(simpleRules.render(), statesRender);
    */
  }
};

/*
let generator = function(options = {}) {
  return through((chunk, enc, done) => {

    let rules = parseRules(chunk.toString());
    let parser = Generator.createParser(rules);

    return done(null, parser);
  });
};
*/

var generator = function generator() {
  return _through2.default.obj(function (chunk, enc, done) {
    var parser = Generator.createParser(chunk);
    return done(null, parser);
  });
};

exports.default = generator;