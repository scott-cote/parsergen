'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

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

var generateFirstFor = function generateFirstFor(symbol, table, ruleIndex) {

  var reduceRule = function reduceRule(cntx, rule, done) {

    //console.log('reduceRule '+rule.left);

    var reduceSymbol = function reduceSymbol(cntx, symbol, done) {

      //console.log('reduceSymbol '+symbol);

      if (!cntx.canBeEmpty) done(null, cntx);
      generateFirstFor(symbol, table, ruleIndex).then(function () {
        //console.log('Got results for '+symbol);
        var first = table[symbol];
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
    }).filter(function (symbol) {
      return symbol != rule.left;
    }), { canBeEmpty: true, symbols: [] }, reduceSymbol, collectResults);
  };

  return new Promise(function (resolve, reject) {
    if (!!table[symbol]) {
      //console.log('skipping, '+symbol+' already generated');
      return resolve();
    }
    var collectResults = function collectResults(err, result) {
      if (err) return reject(err);
      table[symbol] = result;
      //console.log(symbol+' = '+JSON.stringify(table[symbol]));
      resolve();
    };
    (0, _asyncReduce2.default)(ruleIndex[symbol], { canBeEmpty: false, symbols: [] }, reduceRule, collectResults);
  });
};

var generateNonterminalEntries = function generateNonterminalEntries(table, options) {
  var ruleIndex = options.rules.reduce(function (ruleIndex, rule) {
    var rules = ruleIndex[rule.left] || [];
    rules.push(rule);
    ruleIndex[rule.left] = rules;
    return ruleIndex;
  }, {});
  var result = Promise.resolve();
  Object.keys(ruleIndex).forEach(function (symbol) {
    result = result.then(function () {
      return generateFirstFor(symbol, table, ruleIndex);
    });
  });
  return result;
};

var generateFirstTable = function generateFirstTable(options) {
  var table = generateTerminalEntries(options.terminals);
  return generateNonterminalEntries(table, options).then(function () {
    Object.keys(table).forEach(function (key) {
      table[key].symbols = new Set(table[key].symbols);
    });
    return table;
  });
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
      var _this2 = this;

      console.log('table started');
      generateFirstTable(code).then(function (firstTable) {
        code.firstTable = firstTable;
        console.log('table done');
        _this2.push(code);
        done();
      }).catch(done);
    }
  }, {
    key: '_flush',
    value: function _flush(done) {
      done();
    }
  }]);

  return Transformer;
}(_stream2.default.Transform);

;

var firstTableCompiler = function firstTableCompiler() {
  return new Transformer();
};

firstTableCompiler.testAPI = {
  generateFirstFor: generateFirstFor
};

exports.default = firstTableCompiler;