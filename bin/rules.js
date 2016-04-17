'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var RulesModule = {

  createClass: function createClass(Rule, SimpleRules) {

    var Rules = function Rules(startSymbol) {

      var rules = [new Rule(startSymbol, startSymbol + ' EOF')];

      this.addRule = function (left, right) {
        rules.push(new Rule(left, right));
      };

      this.createSimpleRules = function () {
        var simpleRules = new SimpleRules();
        rules.forEach(function (rule) {
          return simpleRules.push(rule.simplify());
        });
        return simpleRules;
      };
    };

    return Rules;
  }
};

exports.default = RulesModule;