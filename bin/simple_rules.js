"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SimpleRulesModule = {

  createClass: function createClass() {

    var SimpleRules = function SimpleRules() {

      var rules = [];

      this.push = function (newRules) {
        rules = rules.concat(newRules);
      };

      this.createStartTerm = function () {
        return rules[0].createTerm();
      };
    };

    return SimpleRules;
  }
};

exports.default = SimpleRulesModule;