'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import asyncReduce from 'async-reduce';

var generateTerminalEntries = function generateTerminalEntries(terminals) {
  return Array.from(terminals.keys()).reduce(function (table, symbol) {
    table[symbol] = { canBeEmpty: false, symbols: [symbol] };
    return table;
  }, {});
};

var generateFirstFor = function generateFirstFor(symbol, table, ruleIndex) {

  var ruleReduction = { canBeEmpty: false, symbols: [] };

  var reduceRule = function reduceRule(rule) {

    /*
     //console.log('reduceRule '+rule.left);
     let reduceSymbol = function(cntx, symbol, done) {
       //console.log('reduceSymbol '+symbol);
       if (!cntx.canBeEmpty) done(null, cntx);
      generateFirstFor(symbol, table, ruleIndex).then(() => {
          //console.log('Got results for '+symbol);
          let first = table[symbol];
          cntx.symbols = cntx.symbols.concat(first.symbols);
          if (!first.canBeEmpty) cntx.canBeEmpty = false;
          done(null, cntx);
        }).catch(done);
    };
     let collectResults = function(err, results) {
      if (err) return done(err);
      cntx.canBeEmpty = cntx.canBeEmpty || results.canBeEmpty;
      cntx.symbols = cntx.symbols.concat(results.symbols);
      done(null, cntx);
    };
     asyncReduce(rule.right.map(element => element.symbol).filter(symbol => symbol != rule.left),
      { canBeEmpty: true, symbols: [] }, reduceSymbol, collectResults);
     */

    var itemReduction = { canBeEmpty: true, symbols: [] };

    var reduceItem = function reduceItem(item) {
      if (!itemReduction.canBeEmpty) return;
      return generateFirstFor(item.symbol, table, ruleIndex).then(function () {
        var first = table[item.symbol];
        itemReduction.symbols = itemReduction.symbols.concat(first.symbols);
        if (!first.canBeEmpty) itemReduction.canBeEmpty = false;
      });
    };

    var result = Promise.resolve();

    rule.right.filter(function (item) {
      return item.symbol != rule.left;
    }).forEach(function (item) {
      result = result.then(function () {
        return reduceItem(item);
      });
    });

    return result.then(function () {
      ruleReduction.canBeEmpty = ruleReduction.canBeEmpty || itemReduction.canBeEmpty;
      ruleReduction.symbols = ruleReduction.symbols.concat(itemReduction.symbols);
      return;
    });
  };

  var result = Promise.resolve();

  if (!table[symbol]) {
    ruleIndex[symbol].forEach(function (rule) {
      result = result.then(function () {
        return reduceRule(rule);
      });
    });
    result = result.then(function () {
      table[symbol] = ruleReduction;
    });
  }

  return result;
  /*
  return new Promise((resolve, reject) => {
    if (!!table[symbol]) {
      //console.log('skipping, '+symbol+' already generated');
      return resolve();
    }
    let collectResults = function(err, result) {
      if (err) return reject(err);
      table[symbol] = result;
      //console.log(symbol+' = '+JSON.stringify(table[symbol]));
      resolve();
    };
    asyncReduce(ruleIndex[symbol], { canBeEmpty: false, symbols: [] },
      reduceRule, collectResults
    );
  });
  */
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