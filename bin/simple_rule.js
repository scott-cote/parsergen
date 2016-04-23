"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SimpleRuleModule = {

  createClass: function createClass(Term) {

    var SimpleRule = function SimpleRule(left, right) {

      this.leftMatches = function (symbol) {
        return symbol === left;
      };

      this.getLeft = function () {
        return left;
      };

      this.getRightCount = function () {
        return right.length;
      };

      this.createTerm = function () {
        return new Term(0, left, [], right);
      };
    };

    return SimpleRule;
  }
};

exports.default = SimpleRuleModule;