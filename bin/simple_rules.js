'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SimpleRulesModule = {

  createClass: function createClass(Term) {

    var SimpleRules = function SimpleRules(code) {

      var first = {};

      var follow = {};

      var nonterminals = void 0;

      this.getRootTerm = function () {
        var rule = code.rules[0];
        return new Term(rule.id, rule.left, [], rule.right);
      };

      this.getSymbols = function () {
        nonterminals = nonterminals || [].concat(_toConsumableArray(new Set([].concat(_toConsumableArray(code.terminals)).concat(code.rules.map(function (rule) {
          return rule.left;
        })))));
        var symbols = nonterminals.concat(code.terminals);
        //console.log('symbols')
        //console.log(JSON.stringify(symbols))
        //console.log(JSON.stringify(code.symbols.keys()))
        return symbols.sort();
        //return [...code.symbols];
      };

      this.createTermsFor = function (symbol) {
        return code.rules.filter(function (rule) {
          return rule.left === symbol;
        }).map(function (rule) {
          return new Term(rule.id, rule.left, [], rule.right);
        });
      };

      this.getNontermMap = function () {
        return code.rules.slice(1).map(function (rule) {
          return rule.left;
        });
      };

      this.getPopMap = function () {
        return code.rules.slice(1).map(function (rule) {
          return rule.getRightCount();
        });
      };

      this.render = function () {
        return code.rules.slice(1).map(function (rule) {
          return rule.render();
        }).join(',\n    ');
      };

      this.getFirstFor = function (symbol) {
        var self = this;
        if (!first[symbol]) {
          if (code.terminals.has(symbol)) {
            first[symbol] = [symbol];
          } else {
            first[symbol] = [].concat(_toConsumableArray(new Set(code.rules.filter(function (rule) {
              return symbol === rule.left && symbol !== rule.right[0].symbol;
            }).reduce(function (value, rule) {
              return value.concat(self.getFirstFor(rule.right[0].symbol));
            }, []))));
          }
        }
        return first[symbol];
      };

      this.getFollowFor = function (nonterminal) {
        var self = this;
        if (!follow[nonterminal]) {
          var allFollow = code.rules.reduce(function (outterValue, rule) {
            outterValue = outterValue.concat(rule.right.reduce(function (value, token, index, array) {
              if (nonterminal === token.symbol) {
                if (index < array.length - 1) {
                  var newVal = self.getFirstFor(array[index + 1].symbol);
                  return value.concat(newVal);
                } else {
                  var _newVal = self.getFollowFor(rule.left);
                  return value.concat(_newVal);
                }
              }
              return value;
            }, []));
            return outterValue;
          }, []);
          follow[nonterminal] = [].concat(_toConsumableArray(new Set(allFollow)));
        }
        return follow[nonterminal];
      };
    };

    return SimpleRules;
  }
};

exports.default = SimpleRulesModule;