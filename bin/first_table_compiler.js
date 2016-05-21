'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compiler = function compiler() {

  var compile = function compile(code) {

    console.log(JSON.stringify(code.symbols));

    code.firstTable = code.symbols.reduce(function (firstTable, symbol) {

      var getRulesFor = function getRulesFor(symbol) {
        return code.rules.filter(function (rule) {
          return rule.left === symbol;
        });
      };

      var getFirstForRule = function getFirstForRule(rule) {
        return rule.right.reduce(function (cntx, element) {
          if (!cntx.done) {
            var first = getFirstSetFor(element.symbol);
            if (!first.canBeEmpty) {
              cntx.done = true;
              cntx.canBeEmpty = false;
            }
            cntx.symbols = cntx.symbols.concat(first);
          }
          return cntx;
        }, { done: false, canBeEmpty: true, symbols: [] });
      };

      var getFirstSetFor = function getFirstSetFor(symbol) {
        var result = { canBeEmpty: false, symbols: [] };

        if (code.terminals.has(symbol)) {
          result.symbols.push(symbol);
        } else {
          getRulesFor(symbol).forEach(function (rule) {
            if (rule.right.length === 0) {
              result.canBeEmpty = true;
            } else {
              var first = getFirstForRule(rule);
              if (first.canBeEmpty) result.canBeEmpty = true;
              result.symbols = result.symbols.concat(first.symbols);
            }
          });
        }

        return firstTable[symbol] = result;
      };

      cntx[symbol] = getFirstSetFor(symbol);
      return firstTable;
    }, {});

    return code;
  };

  return _through2.default.obj(function (code, encoding, done) {
    //this.push(compile(code));
    this.push(code);
    done();
  });
};

exports.default = compiler;