'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var RulesModule = {

  createClass: function createClass(SimpleRule, SimpleRules) {

    var Rules = function Rules(startSymbol, terminals) {

      // let rules = [new Rule(startSymbol+"'", [startSymbol,'$'])];

      var rules = [{ left: startSymbol + "'", right: [startSymbol, '$'] }];

      this.toString = function () {
        return rules.map(function (rule) {
          return rule.toString();
        }).join('::');
      };

      this.addRule = function (left, right) {
        rules.push({ left: left, right: right });
      };

      this.createSimpleRules = function (terminals) {
        var simplify = function simplify(rule, terminals) {
          var tokens = rule.right.map(function (symbol) {
            return {
              symbol: symbol,
              type: terminals.find(function (token) {
                return token === symbol;
              }) ? 'TERMINAL' : 'NONTERMINAL'
            };
          });
          return [new SimpleRule(0, rule.left, tokens)];
        };

        var simpleRules = new SimpleRules(terminals);
        rules.forEach(function (rule) {
          //simpleRules.push(rule.simplify(terminals)));
          simplify(rule, terminals).forEach(function (rule) {
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