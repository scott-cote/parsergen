"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StatesModule = {

  createClass: function createClass(State) {

    var States = function States(simpleRules) {

      var states = [new State().addTerm(simpleRules.createStartTerm())];
    };

    return States;
  }

};

exports.default = StatesModule;