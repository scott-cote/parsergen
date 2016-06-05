'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compile = function compile(code) {

  code.firstTable = Array.from(code.terminals.keys()).reduce(function (table, symbol) {
    table[symbol] = { canBeEmpty: false, symbols: [symbol] };
    return table;
  }, {});

  var symbols = Array.from(code.nonterminals.keys()).reverse();

  while (symbols.length) {
    symbols = symbols.reduce(function (cntx, symbol) {
      var rules = code.rules.filter(function (rule) {
        return rule.left === symbol;
      });

      var ready = rules.reduce(function (ready, rule) {
        if (!ready) return false;
        return rule.right.reduce(function (ready, element) {
          if (!ready) return false;
          if (element.symbol === symbol) return true;
          return !!code.firstTable[element.symbol];
        }, true);
      }, true);

      if (ready) {
        code.firstTable[symbol] = rules.reduce(function (cntx, rule) {
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
            return code.firstTable[current].symbols;
          }));
          return cntx;
        }, { canBeEmpty: false, symbols: [] });
      } else {
        cntx.symbols.push(symbol);
      }

      return cntx;
    }, { symbols: [], table: code.firstTable }).symbols;
  }

  return code;
};

var compiler = function compiler() {
  return _through2.default.obj(function (code, encoding, done) {
    this.push(compile(code));
    done();
  });
};

compiler.testAPI = {
  compile: compile
};

exports.default = compiler;