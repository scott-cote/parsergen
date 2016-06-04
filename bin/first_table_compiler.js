'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compiler = function compiler() {

  var compile = function compile(code) {

    var reduction = Array.from(code.symbols.keys()).reduce(function (cntx, symbol) {

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

          getRulesFor(symbol).reduce(function (cntx, rule) {
            if (rule.right.length === 0) {
              cntx.canBeEmpty = true;
            } else {
              var first = getFirstForRule(rule);
              if (first.canBeEmpty) cntx.canBeEmpty = true;
              cntx.symbols = cntx.symbols.concat(first.symbols);
            }
            return cntx;
          }, result);
        }

        return result;
      };

      // cntx.firstTable[symbol] = getFirstSetFor(symbol);

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