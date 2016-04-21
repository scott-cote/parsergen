"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SimpleRulesModule = {

  createClass: function createClass() {

    var SimpleRules = function SimpleRules(terminals) {

      var rules = [];

      var symbols = void 0;

      this.push = function (newRules) {
        rules = rules.concat(newRules);
      };

      this.createStartTerm = function () {
        return rules[0].createTerm();
      };

      this.getRootTerm = function () {
        return rules[0].createTerm();
      };

      this.getSymbols = function () {
        symbols = symbols || [].concat(_toConsumableArray(new Set(terminals.concat(rules.map(function (rule) {
          return rule.getLeft();
        })))));
        return symbols;
      };

      this.createTermsFor = function (symbol) {
        return rules.filter(function (rule) {
          return rule.leftMatches(symbol);
        }).map(function (rule) {
          return rule.createTerm();
        });
      };
    };

    return SimpleRules;
  }
};

exports.default = SimpleRulesModule;