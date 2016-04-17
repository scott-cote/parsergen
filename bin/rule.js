'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var RuleModule = {

  createClass: function createClass(SimpleRule) {

    var Rule = function Rule(left, right) {

      this.simplify = function () {
        return [new SimpleRule(left, right.split(' '))];
      };
    };

    return Rule;
  }
};

exports.default = RuleModule;