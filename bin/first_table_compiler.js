'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compiler = function compiler() {

  var compile = function compile(code) {

    var reduction = Array.prototype.reduce.call(code.symbols.keys(), function (cntx, symbol) {

      /*
      let getRulesFor = function(symbol) {
        return code.rules.filter(rule => rule.left === symbol);
      };
       let getFirstForRule = function(rule) {
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
      };
       let getFirstSetFor = function(symbol) {
        let result = { canBeEmpty: false, symbols: [] };
         if (code.terminals.has(symbol)) {
          result.symbols.push(symbol);
        } else {
          getRulesFor(symbol).forEach(rule => {
            if (rule.right.length === 0) {
              result.canBeEmpty = true;
            } else {
              let first = getFirstForRule(rule);
              if (first.canBeEmpty) result.canBeEmpty = true;
              result.symbols = result.symbols.concat(first.symbols);
            }
          });
        }
         return firstTable[symbol] = result;
      };
       cntx[symbol] = getFirstSetFor(symbol);
      */

      cntx.firstTable[symbol] = symbol;
      return cntx;
    }, { firstTable: {} });

    code.firstTable = reduction.firstTable;

    console.log(JSON.stringify(reduction.firstTable));

    return code;
  };

  return _through2.default.obj(function (code, encoding, done) {
    this.push(compile(code));
    //this.push(code);
    done();
  });
};

exports.default = compiler;