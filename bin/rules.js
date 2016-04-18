"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var RulesModule = {

  createClass: function createClass(Rule, SimpleRules) {

    var Rules = function Rules(startSymbol, terminals) {

      var rules = [new Rule(startSymbol + "'", startSymbol + ' $')];

      this.addRule = function (left, right) {
        rules.push(new Rule(left, right));
      };

      this.createSimpleRules = function (terminals) {
        var simpleRules = new SimpleRules();
        rules.forEach(function (rule) {
          return simpleRules.push(rule.simplify(terminals));
        });
        return simpleRules;
      };
    };

    return Rules;
  }
};

exports.default = RulesModule;