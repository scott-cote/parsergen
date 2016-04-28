'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var template = '\n\nvar Parser = function() {\n\n  var rules, parseTable, input, stack;\n\n  var nodeCount = 0;\n\n  var shift = function(newState) {\n    return function(token, type) {\n      var top = stack[stack.length-1];\n      //console.log(\'shift to \'+newState);\n      stack.push(parseTable[newState]);\n      console.log(\'LEAF \'+type+\' \'+token+\' \'+(++nodeCount))\n      return true;\n    };\n  };\n\n  var reduce = function(ruleIndex) {\n    return function(token, type) {\n      var top = stack[stack.length-1];\n      var rule = rules[ruleIndex-1];\n      //console.log(\'reduce using rule \'+ruleIndex);\n      //console.log(\'removing from stack \'+rule.rightCount);\n      stack.splice(-rule.rightCount, rule.rightCount)\n      top = stack[stack.length-1];\n      //console.log(JSON.stringify(rule))\n      input.push({ content: \'\', type: rule.left });\n    };\n  };\n\n  var goto = function(newState) {\n    return function(token, type) {\n      var top = stack[stack.length-1];\n      //console.log(\'goto \'+newState);\n      stack.push(parseTable[newState]);\n      console.log(\'TRUNK \'+type+\' \'+token+\' \'+(++nodeCount))\n      return true;\n    };\n  };\n\n  var accept = function() {\n    return function(token, type) {\n      console.log(\'ROOT\');\n      return true;\n    };\n  }\n\n  rules = [\n    { left: \'RULES\', rightCount: 2 }, // RULES -> RULES RULE;\n    { left: \'RULES\', rightCount: 1 }, // RULES -> RULE;\n    { left: \'RULE\', rightCount: 4 }, // RULE -> LEFT TOKEN_ROCKET RIGHT TOKEN_SEMICOLON;\n    { left: \'LEFT\', rightCount: 1 }, // LEFT -> TOKEN_IDENTIFIER;\n    { left: \'RIGHT\', rightCount: 2 }, // RIGHT -> RIGHT TOKEN_IDENTIFIER;\n    { left: \'RIGHT\', rightCount: 1 } // RIGHT -> TOKEN_IDENTIFIER;\n  ];\n\n  parseTable = [\n    {"RULES":goto(2),"RULE":goto(3),"LEFT":goto(4),"TOKEN_IDENTIFIER":shift(1),"state":0},\n    {"TOKEN_ROCKET":reduce(4),"state":1},\n    {"RULE":goto(5),"LEFT":goto(4),"$":accept(),"TOKEN_IDENTIFIER":shift(1),"state":2},\n    {"$":reduce(2),"TOKEN_IDENTIFIER":reduce(2),"state":3},\n    {"TOKEN_ROCKET":shift(6),"state":4},\n    {"$":reduce(1),"TOKEN_IDENTIFIER":reduce(1),"state":5},\n    {"RIGHT":goto(8),"TOKEN_IDENTIFIER":shift(7),"state":6},\n    {"TOKEN_SEMICOLON":reduce(6),"TOKEN_IDENTIFIER":reduce(6),"state":7},\n    {"TOKEN_SEMICOLON":shift(9),"TOKEN_IDENTIFIER":shift(10),"state":8},\n    {"$":reduce(3),"TOKEN_IDENTIFIER":reduce(3),"state":9},\n    {"TOKEN_SEMICOLON":reduce(5),"TOKEN_IDENTIFIER":reduce(5),"state":10}\n  ];\n\n  stack = [parseTable[0]];\n\n  var error = function() {\n    throw \'error\';\n  }\n\n  this.processToken = function(content, type) {\n    input = [{ content, type }];\n    while (input.length) {\n      //console.log(JSON.stringify(input));\n      //console.log(JSON.stringify(stack));\n      var symbol = input[input.length-1];\n      var top = stack[stack.length-1];\n      //console.log(\'in state \'+top.state);\n      //console.log(\'encountered \'+symbol.type);\n      if ((stack[stack.length-1][symbol.type]||error)(symbol.content, symbol.type)) {\n        input.pop();\n      }\n    }\n  };\n\n  this.end = function() {\n    //console.log(\'end\')\n    this.processToken(\'\', \'$\');\n  }\n};\n\nexports.default = Parser;\n\n';

var parseRules = function parseRules(input) {
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
  return rules;
};

var Generator = {
  createParser: function createParser(rules) {
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

    //states.printTable();

    return template; // fs.readFileSync('parser_template.js');
  }
};

var generator = function generator() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return (0, _through2.default)(function (chunk, enc, done) {

    var rules = parseRules(chunk.toString());
    var parser = Generator.createParser(rules);

    return done(null, parser);
  });
};

exports.default = generator;