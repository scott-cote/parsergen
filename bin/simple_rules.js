'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SimpleRulesModule = {

  createClass: function createClass(Term) {

    var SimpleRules = function SimpleRules(code) {

      var rules = [];

      var first = {};

      var follow = {};

      var nonterminals = void 0;

      this.getRules = function () {
        return rules;
      };

      /*
      this.toString = function() {
        return rules.map(rule => rule.toString()).join();
      };
      */

      this.addRule = function (left, right) {
        rules.push({ id: rules.length, left: left, right: right });
        //rules.push(new SimpleRule(rules.length, left, right));
      };

      /*
      this.createStartTerm = function() {
        let rule = rules[0];
        return new Term(rule.id, rule.left, [], rule.right);
      };
      */

      this.getRootTerm = function () {
        var rule = rules[0];
        return new Term(rule.id, rule.left, [], rule.right);
      };

      this.getTerminals = function () {
        return code.terminals;
      };

      this.getNonterminals = function () {
        nonterminals = nonterminals || [].concat(_toConsumableArray(new Set([].concat(_toConsumableArray(code.terminals)).concat(rules.map(function (rule) {
          return rule.left;
        })))));
        //console.log('nonterminals')
        //console.log(JSON.stringify(nonterminals))
        //console.log(JSON.stringify(code.nonterminals.keys()))
        return nonterminals;
      };

      this.getSymbols = function () {
        var symbols = this.getNonterminals().concat(code.terminals);
        //console.log('symbols')
        //console.log(JSON.stringify(symbols))
        //console.log(JSON.stringify(code.symbols.keys()))
        return symbols;
      };

      this.createTermsFor = function (symbol) {
        return rules.filter(function (rule) {
          return rule.left === symbol;
        }).map(function (rule) {
          return new Term(rule.id, rule.left, [], rule.right);
        });
      };

      this.getNontermMap = function () {
        return rules.slice(1).map(function (rule) {
          return rule.left;
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
          if (code.terminals.has(symbol)) {
            first[symbol] = [symbol];
          } else {
            first[symbol] = [].concat(_toConsumableArray(new Set(rules.filter(function (rule) {
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
          var allFollow = rules.reduce(function (outterValue, rule) {
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