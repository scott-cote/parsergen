'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var RulesModule = {

  createClass: function createClass(Rule, SimpleRules) {

    var Rules = function Rules(startSymbol, terminals) {

      var rules = [new Rule(startSymbol + "'", [startSymbol, '$'])];

      this.toString = function () {
        return rules.map(function (rule) {
          return rule.toString();
        }).join('::');
      };

      this.addRule = function (left, right) {
        rules.push(new Rule(left, right));
      };

      this.createSimpleRules = function (terminals) {
        var simpleRules = new SimpleRules(terminals);
        rules.forEach(function (rule) {
          //simpleRules.push(rule.simplify(terminals)));
          rule.simplify(terminals).forEach(function (rule) {
            return simpleRules.addRule(rule.getLeft(), rule.getRight());
          });
        });
        return simpleRules;
      };
    };

    return Rules;
  }
};

exports.default = RulesModule;