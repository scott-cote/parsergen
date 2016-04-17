"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var RulesModule = {

  createClass: function createClass(Rule) {

    var Rules = function Rules() {

      var rules = [];

      this.addRule = function (left, right) {
        rules.push(new Rule(left, right));
      };

      this.createSimpleRules = function () {
        // ...
      };
    };

    return Rules;
  }
};

exports.default = RulesModule;