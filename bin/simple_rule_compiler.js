'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var compiler = function compiler() {
  return thru.obj(function (code, encoding, done) {

    var compile = function compile(code) {

      code.rules = [{
        left: code.complexRules[0].left + "'",
        right: [code.complexRules[0].left, '$']
      }].concat(code.complexRules);

      code.nonterminals = new Set(code.rules.map(function (rule) {
        return rule.left;
      }));

      code.terminals = new Set(code.rules.map(function (rule) {
        return rule.right;
      }).reduce(function (value, symbols) {
        return value.concat(symbols);
      }, []).filter(function (symbol) {
        return !code.nonterminals.has(symbol);
      }));

      code.symbols = new Set([].concat(_toConsumableArray(code.nonterminals), _toConsumableArray(code.terminals)));

      code.rules = code.rules.map(function (rule, index) {
        return {
          id: index,
          left: rule.left,
          right: rule.right.map(function (symbol) {
            return {
              symbol: symbol,
              type: code.terminals.has(symbol) ? 'TERMINAL' : 'NONTERMINAL'
            };
          })
        };
      });

      return code;
    };

    this.push(compile(code));
    done();
  });
};

exports.default = compiler;