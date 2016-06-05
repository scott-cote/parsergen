'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateFirstTable = function generateFirstTable(options) {

  var firstTable = Array.from(options.terminals.keys()).reduce(function (table, symbol) {
    table[symbol] = { canBeEmpty: false, symbols: [symbol] };
    return table;
  }, {});

  var symbols = Array.from(options.nonterminals.keys()).reverse();

  while (symbols.length) {
    symbols = symbols.reduce(function (cntx, symbol) {
      var rules = options.rules.filter(function (rule) {
        return rule.left === symbol;
      });

      var ready = rules.reduce(function (ready, rule) {
        if (!ready) return false;
        return rule.right.reduce(function (ready, element) {
          if (!ready) return false;
          if (element.symbol === symbol) return true;
          return !!firstTable[element.symbol];
        }, true);
      }, true);

      if (ready) {
        firstTable[symbol] = rules.reduce(function (cntx, rule) {
          var index = rule.right.findIndex(function (element) {
            return !element.canBeEmpty;
          });
          var symbols = void 0;
          if (index === -1) {
            cntx.canBeEmpty = true;
            symbols = rule.right.map(function (element) {
              return element.symbol;
            });
          } else {
            symbols = rule.right.slice(0, index + 1).map(function (element) {
              return element.symbol;
            });
          }
          cntx.symbols = cntx.symbols.concat(symbols.filter(function (current) {
            return current != symbol;
          }).map(function (current) {
            return firstTable[current].symbols;
          }));
          return cntx;
        }, { canBeEmpty: false, symbols: [] });
      } else {
        cntx.symbols.push(symbol);
      }

      return cntx;
    }, { symbols: [], table: firstTable }).symbols;
  }

  return firstTable;
};

var compiler = function compiler() {
  return _through2.default.obj(function (code, encoding, done) {
    code.firstTable = generateFirstTable(code);
    this.push(code);
    done();
  });
};

compiler.testAPI = {
  generateFirstTable: generateFirstTable
};

exports.default = compiler;