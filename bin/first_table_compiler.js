'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _asyncReduce = require('async-reduce');

var _asyncReduce2 = _interopRequireDefault(_asyncReduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var generateTerminalEntries = function generateTerminalEntries(terminals) {
  return Array.from(terminals.keys()).reduce(function (table, symbol) {
    table[symbol] = { canBeEmpty: false, symbols: new Set([symbol]) };
    return table;
  }, {});
};

var getDependencies = function getDependencies(rule) {
  return new Set(rule.right.filter(function (element) {
    return element.symbol !== rule.left;
  }).map(function (element) {
    return element.symbol;
  }));
};

var augmentRule = function augmentRule(rule) {
  return { orgRule: rule, dependencies: getDependencies(rule) };
};

var compareAugmentedRules = function compareAugmentedRules(ruleA, ruleB) {
  if (ruleA.dependencies.has(ruleB.orgRule.left)) {
    return 1;
  }
  if (ruleB.dependencies.has(ruleA.orgRule.left)) {
    return -1;
  }
  return 0;
};

var getSortedRules = function getSortedRules(rules) {
  return rules.map(augmentRule).reduce(function (augmentedRules, rule) {
    augmentedRules.unshift(rule);
    return augmentedRules.sort(compareAugmentedRules);
  }, []).map(function (rule) {
    return rule.orgRule;
  });
};

/*
let canRuleBeEmpty = function(rule) {
  // this is wrong ... canBeEmpty is part of the table
  return -1 === rule.right.findIndex(element => { return !element.canBeEmpty });
};
*/

/*
let generateNonterminalSymbols = function(symbol, rule, terminalTable, nonterminalTable) {
  return rule.right.reduce((cntx, element) => {
    if (cntx.done || element.symbol === symbol) return cntx;
    cntx.done = !element.canBeEmpty;
    let expandedSymbols = terminalTable[element.symbol] || nonterminalTable[element.symbol];
    cntx.symbols = cntx.symbols.concat(expandedSymbols);
    return cntx;
  }, { done: false, symbols: [] }).symbols;
};

let generateNonterminalEntry = function(terminalTable, nonterminalTable, rules) {
  return rules.reduce((cntx, rule) => {
    cntx.canBeEmpty = cntx.canBeEmpty || canRuleBeEmpty(rule);
    cntx.symbols = cntx.symbols.concat(generateNonterminalSymbols(rule));
    return cntx;
  }, { canBeEmpty: false, symbols: [] });
};

*/

/*
let generateNonterminalEntries = function(terminalTable, options) {
  return getSortedRules(options.rules).reduce((nonterminalTable, rule) => {
    let record = nonterminalTable[rule.left] || { canBeEmpty: false, symbols: new Set() };
    record.canBeEmpty = record.canBeEmpty || rule.left.length === 0;
    record.symbols = new Set([...record.symbols, ...getFirstForRule(rule, nonterminalTable)]);
    nonterminalTable[rule.left] = record;
  }, {});
};
*/

var generateFirstFor = function generateFirstFor(symbol, terminalTable, nonterminalTable, ruleIndex) {

  var reduceRule = function reduceRule(cntx, rule, done) {
    cntx.canBeEmpty = cntx.canBeEmpty || rule.right.length === 0;
    var collectResults = function collectResults(err, result) {
      return err ? done(err) : done(null, result);
    };
    var reduceElement = function reduceElement(cntx, element, done) {
      generateFirstFor(element.symbol, terminalTable, nonterminalTable, ruleIndex).then(function (first) {
        cntx.symbols = new (Function.prototype.bind.apply(Set, [null].concat(_toConsumableArray(cntx.symbols), _toConsumableArray(first.symbols))))();
        done(null, cntx);
      }).catch(done);
    };
    (0, _asyncReduce2.default)(rule.right, { done: false, symbols: new Set() }, reduceElement, collectResults);
    done(null, cntx);
  };

  return new Promise(function (resolve, reject) {
    var result = terminalTable[symbol] || nonterminalTable[symbol];
    if (result) return resolve(result);
    var collectResults = function collectResults(err, result) {
      return err ? reject(err) : resolve(result);
    };
    (0, _asyncReduce2.default)(ruleIndex[symbol], { canBeEmpty: false, symbols: new Set() }, reduceRule, collectResults);
  });
};

var generateNonterminalEntries = function generateNonterminalEntries(terminalTable, options) {
  var ruleIndex = options.rules.reduce(function (ruleIndex, rule) {
    var rules = ruleIndex[rule.left] || [];
    rules.push(rule);
    ruleIndex[rule.left] = rules;
    return ruleIndex;
  }, {});
  var result = Promise.resolve();
  Object.keys(ruleIndex).forEach(function (symbol) {
    result = result.then(function () {
      return generateFirstFor(symbol, terminalTable, ruleIndex[symbol]);
    });
  });
  return result;
};

var generateFirstTable = function generateFirstTable(options) {
  var terminalTable = generateTerminalEntries(options.terminals);
  return generateNonterminalEntries(terminalTable, options).then(function (nonterminalTable) {
    return Object.assign({}, terminalTable, nonterminalTable);
  });
};

var compiler = function compiler() {
  return _through2.default.obj(function (code, encoding, done) {
    var _this = this;

    generateFirstTable(code).then(function (firstTable) {
      console.log(JSON.stringify(firstTable));
      code.firstTable = firstTable;
      _this.push(code);
      done();
    });
  });
};

compiler.testAPI = {
  generateFirstFor: generateFirstFor
};

exports.default = compiler;