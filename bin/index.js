'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

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

var generator = function generator() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return (0, _through2.default)(function (chunk, enc, done) {
    var input = chunk.toString();
    var rules = input.split(';').map(function (rule) {
      return rule.trim();
    }).filter(function (rule) {
      return !!rule;
    }).map(function (rule) {
      var _rule$split$map = rule.split('->').map(function (part) {
        return part.trim();
      });

      var _rule$split$map2 = _slicedToArray(_rule$split$map, 2);

      var left = _rule$split$map2[0];
      var right = _rule$split$map2[1];

      return { left: left, right: right };
    });
    var nonterminals = [].concat(_toConsumableArray(new Set(rules.map(function (rule) {
      return rule.left;
    }))));
    var symbols = rules.map(function (rule) {
      return rule.right.split(' ').map(function (sym) {
        return sym.trim();
      });
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

    states.printTable();

    return done(null, chunk.toString().toLowerCase());
  });
};

exports.default = generator;