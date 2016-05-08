'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SimpleRulesModule = {

  createClass: function createClass(SimpleRule) {

    var SimpleRules = function SimpleRules(terminals) {

      var rules = [];

      var first = {};

      var follow = {};

      var nonterminals = void 0;

      this.toString = function () {
        return rules.map(function (rule) {
          return rule.toString();
        }).join();
      };

      this.addRule = function (left, right) {
        rules.push(new SimpleRule(rules.length, left, right));
      };

      this.createStartTerm = function () {
        return rules[0].createTerm();
      };

      this.getRootTerm = function () {
        return rules[0].createTerm();
      };

      this.getTerminals = function () {
        return terminals;
      };

      this.getNonterminals = function () {
        nonterminals = nonterminals || [].concat(_toConsumableArray(new Set(terminals.concat(rules.map(function (rule) {
          return rule.getLeft();
        })))));
        return nonterminals;
      };

      this.getSymbols = function () {
        return this.getNonterminals().concat(terminals);
      };

      this.createTermsFor = function (symbol) {
        return rules.filter(function (rule) {
          return rule.leftMatches(symbol);
        }).map(function (rule) {
          return rule.createTerm();
        });
      };

      this.getNontermMap = function () {
        return rules.slice(1).map(function (rule) {
          return rule.getLeft();
        });
      };

      this.getPopMap = function () {
        return rules.slice(1).map(function (rule) {
          return rule.getRightCount();
        });
      };

      this.render = function () {
        return rules.slice(1).map(function (rule) {
          return rule.render();
        }).join(',\n    ');
      };

      this.getFirstFor = function (symbol) {
        var self = this;
        if (!first[symbol]) {
          if (terminals.find(function (terminal) {
            return symbol === terminal;
          })) {
            first[symbol] = [symbol];
          } else {
            first[symbol] = [].concat(_toConsumableArray(new Set(rules.filter(function (rule) {
              return symbol === rule.getLeft() && symbol !== rule.getFirstRight().symbol;
            }).reduce(function (value, rule) {
              return value.concat(self.getFirstFor(rule.getFirstRight().symbol));
            }, []))));
          }
        }
        return first[symbol];
      };

      this.getFollowFor = function (nonterminal) {
        var self = this;
        if (!follow[nonterminal]) {
          var allFollow = rules.reduce(function (outterValue, rule) {
            outterValue = outterValue.concat(rule.getRight().reduce(function (value, token, index, array) {
              if (nonterminal === token.symbol) {
                if (index < array.length - 1) {
                  var newVal = self.getFirstFor(array[index + 1].symbol);
                  return value.concat(newVal);
                } else {
                  var _newVal = self.getFollowFor(rule.getLeft());
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