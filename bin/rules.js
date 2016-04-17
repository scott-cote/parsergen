"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Rules = {

  create: function create(Rule) {

    var rules = [];

    var RulesClass = function RulesClass() {};

    RulesClass.prototype.addRule = function (left, right) {
      rules.push(new Rule(left, right));
    };

    RulesClass.prototype.createSimpleRules = function () {};

    return new RulesClass();
  }
};

exports.default = Rules;