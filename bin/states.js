'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StatesModule = {

  createClass: function createClass(State) {

    var States = function States(simpleRules) {

      var states = [];

      var selectorIndex = {};

      this.addState = function (selector) {
        var state = new State();
        states.push(state);
        selectorIndex[selector] = state;
        return state;
      };

      this.findBySelector = function (selector) {
        return selectorIndex[selector];
      };

      this.debugPrint = function () {
        states.forEach(function (state, index) {
          console.log('I' + index);
          state.debugPrint();
        });
      };

      var startTerm = simpleRules.createStartTerm();
      var selector = startTerm.getRightToken();
      this.addState(selector).addUniqueTerms(startTerm);

      var index = 0;while (index < states.length) {
        states[index].expand(this);
        index++;
      }
    };

    return States;
  }

};

exports.default = StatesModule;