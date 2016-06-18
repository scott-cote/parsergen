'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
  return new Transformer();
};

var _asyncReduce = require('async-reduce');

var _asyncReduce2 = _interopRequireDefault(_asyncReduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var generateTerminalEntries = function generateTerminalEntries(terminals) {
  return Array.from(terminals.keys()).reduce(function (table, symbol) {
    table[symbol] = { canBeEmpty: false, symbols: [symbol] };
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

    var reduceSymbol = function reduceSymbol(cntx, symbol, done) {
      if (!cntx.canBeEmpty) done(null, cntx);
      generateFirstFor(symbol, terminalTable, nonterminalTable, ruleIndex).then(function (first) {
        nonterminalTable[symbol] = first;
        cntx.symbols = cntx.symbols.concat(first.symbols);
        if (!first.canBeEmpty) cntx.canBeEmpty = false;
        done(null, cntx);
      }).catch(done);
    };

    var collectResults = function collectResults(err, results) {
      if (err) return done(err);
      cntx.canBeEmpty = cntx.canBeEmpty || results.canBeEmpty;
      cntx.symbols = cntx.symbols.concat(results.symbols);
      done(null, cntx);
    };

    (0, _asyncReduce2.default)(rule.right.map(function (element) {
      return element.symbol;
    }), { canBeEmpty: true, symbols: [] }, reduceSymbol, collectResults);
  };

  return new Promise(function (resolve, reject) {
    var result = terminalTable[symbol] || nonterminalTable[symbol];
    if (result) return resolve(result);
    var collectResults = function collectResults(err, result) {
      return err ? reject(err) : resolve(result);
    };
    (0, _asyncReduce2.default)(ruleIndex[symbol], { canBeEmpty: false, symbols: [] }, reduceRule, collectResults);
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
    var table = Object.assign({}, terminalTable, nonterminalTable);
    table.keys().forEach(function (key) {
      table[key].symbols = new Set(table[key].symbols);
    });
    return table;
  });
};

var compiler = function compiler() {
  return thru.obj(function (code, encoding, done) {
    var _this = this;

    generateFirstTable(code).then(function (firstTable) {
      code.firstTable = firstTable;
      _this.push(code);
      done();
    });
  });
};

compiler.testAPI = {
  generateFirstFor: generateFirstFor
};

var Transformer = function (_Stream$Transform) {
  _inherits(Transformer, _Stream$Transform);

  function Transformer() {
    _classCallCheck(this, Transformer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Transformer).call(this, { objectMode: true }));
  }

  _createClass(Transformer, [{
    key: '_transform',
    value: function _transform(code, encoding, done) {
      done(null, code);
    }
  }]);

  return Transformer;
}(Stream.Transform);

;
;