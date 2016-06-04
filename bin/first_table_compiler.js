'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compiler = function compiler() {

  var getRulesFor = function getRulesFor(symbol, rules) {
    return code.rules.filter(function (rule) {
      return rule.left === symbol;
    });
  };

  var getFirstForRule = function getFirstForRule(rule, table) {
    /*
    return rule.right.reduce((cntx, element) => {
      if (!cntx.done) {
        let first = getFirstSetFor(element.symbol);
        if (!first.canBeEmpty) {
          cntx.done = true;
          cntx.canBeEmpty = false;
        }
        cntx.symbols = cntx.symbols.concat(first);
      }
      return cntx;
    }, { done: false, canBeEmpty: true, symbols: [] });
    */
    return;
  };

  var getFirstSetFor = function getFirstSetFor(symbol, table, terminals) {
    var result = { canBeEmpty: false, symbols: [] };

    if (terminals.has(symbol)) {
      result.symbols.push(symbol);
    } else {
      result = getRulesFor(symbol).reduce(function (cntx, rule) {
        if (!cntx) {
          return cntx;
        } else if (rule.right.length === 0) {
          cntx.canBeEmpty = true;
          return cntx;
        } else {
          var first = getFirstForRule(rule, table);
          if (!first) reutrn;
          if (first.canBeEmpty) cntx.canBeEmpty = true;
          cntx.symbols = cntx.symbols.concat(first.symbols);
          return cntx;
        }
      }, result);
    }

    return result;
  };

  var compile = function compile(code) {

    code.testFirstTable = Array.from(code.terminals.keys()).reduce(function (table, symbol) {
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
            return !!code.testFirstTable[element.symbol];
          }, true);
        }, true);

        if (ready) {
          code.testFirstTable[symbol] = rules.reduce(function (first, rule) {
            var index = rule.right.findIndex(function (element) {
              return !element.canBeEmpty;
            });
            if (index === -1) {
              cntx.canBeEmpty = true;
            } else {
              console.log(index);
              // ...
            }
            return first;
          }, { canBeEmpty: false, symbols: [] });
        } else {
          cntx.symbols.push(symbol);
        }

        return cntx;
      }, { symbols: [], table: code.testFirstTable }).symbols;
    }

    /*
    let symbols = Array.from(code.symbols.keys());
     let table = {};
     while (symbols.length) {
      symbols = symbols.reduce((cntx, symbol) => {
        let firstSet = getFirstSetFor(symbol, table, code.terminals);
        if (firstSet) {
          cntx.table[symbol] = firstSet;
        }  else {
          cntx.symbols.push(symbol);
        }
        return cntx;
      }, { symbols: [], table: table }).symbols;
    }
    */

    /*
    code.testFirstTable = Array.from(code.symbols.keys()).reduce((table, symbol) => {
      table[symbol] = getFirstSetFor(symbol, code.terminals);
      return table;
    }, {});
    */

    console.log(JSON.stringify(code.testFirstTable));

    return code;
  };

  return _through2.default.obj(function (code, encoding, done) {
    this.push(compile(code));
    //this.push(code);
    done();
  });
};

exports.default = compiler;