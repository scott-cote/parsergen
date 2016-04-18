'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var RuleModule = {

  createClass: function createClass(SimpleRule) {

    var Rule = function Rule(left, right) {

      this.simplify = function (terminals) {
        var tokens = right.split(' ').map(function (symbol) {
          return {
            symbol: symbol,
            type: terminals.find(function (token) {
              return token === symbol;
            }) ? 'TERMINAL' : 'NONTERMINAL'
          };
        });
        return [new SimpleRule(left, tokens)];
      };
    };

    return Rule;
  }
};

exports.default = RuleModule;