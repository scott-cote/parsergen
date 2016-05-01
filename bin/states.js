'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StatesModule = {

  createClass: function createClass(State) {

    var States = function States(simpleRules) {

      var states = [];

      var rootTermsState = {};

      this.debugPrint = function () {
        states.forEach(function (state, index) {
          console.log('');
          console.log('I' + index);
          state.debugPrint();
        });
      };

      this.printTable = function () {
        states.forEach(function (state, index) {
          var row = state.createRow();
          row.state = index;
          console.log(JSON.stringify(row));
        });
      };

      this.render = function () {
        return states.map(function (state) {
          return state.render();
        }).join(',\n');
      };

      states.push(new State(0, simpleRules, simpleRules.getRootTerm()));

      var index = 0;while (index < states.length) {
        simpleRules.getSymbols().forEach(function (symbol) {
          if (symbol === '$') return;
          var rootTerms = states[index].getRootTermsFor(symbol);
          if (rootTerms.length) {
            var id = rootTerms.map(function (term) {
              return term.getId();
            }).sort().join();
            var state = rootTermsState[id] || states.length;
            if (state === states.length) {
              rootTermsState[id] = state;
              states.push(new State(states.length, simpleRules, rootTerms));
            }
            states[index].setGotoFor(symbol, state);
          }
        });
        index++;
      }
    };

    return States;
  }

};

exports.default = StatesModule;