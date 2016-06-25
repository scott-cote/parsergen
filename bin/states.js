'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StatesModule = {

  createClass: function createClass(State, Term) {

    var getId = function getId(term) {
      return term.left + '>' + term.middle.map(function (element) {
        return element.symbol;
      }).join(':') + '.' + term.right.map(function (element) {
        return element.symbol;
      }).join(':');
    };

    var getRightNonterminal = function getRightNonterminal(term) {
      var token = term.right[0];
      if (token && token.type === 'NONTERMINAL') return token.symbol;
    };

    var States = function States(code) {

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
        }).join(',\n  ');
      };

      this.getRootTerm = function () {
        var rule = code.rules[0];
        return { rule: rule.id, left: rule.left, middle: [], right: rule.right };
      };

      states.push(new State(0, code, this.getRootTerm()));

      var index = 0;while (index < states.length) {
        code.symbols.forEach(function (symbol) {
          if (symbol === '$') return;
          var rootTerms = states[index].getRootTermsFor(symbol);
          if (rootTerms.length) {
            var id = rootTerms.map(function (term) {
              return getId(term);
            }).sort().join();
            var state = rootTermsState[id] || states.length;
            if (state === states.length) {
              rootTermsState[id] = state;
              states.push(new State(states.length, code, rootTerms));
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