"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StateModule = {

  createClass: function createClass() {

    var State = function State(id) {

      var terms = [];

      var termIndex = {};

      this.addUniqueTerms = function (newTerms) {
        //if (id === 0) console.log('adding to zero');
        [].concat(newTerms).forEach(function (newTerm) {
          var id = newTerm.getId();
          if (!termIndex[id]) {
            termIndex[id] = true;
            terms.push(newTerm);
          }
        });
        return this;
      };

      this.expand = function (states, simpleRules) {

        //console.log('expanding '+id)

        var self = this;

        var expandStates = function expandStates(term) {
          var newTerm = term.createShiftTerm();
          var selector = term.getRightToken();
          if (selector) {
            //console.log(selector)
            //console.log(states.findBySelector(selector));
            var state = states.findBySelector(selector) || states.addState(selector);
            state.addUniqueTerms(newTerm);
          }
        };

        var expandTerms = function expandTerms(term) {
          var selector = term.getRightNonterminal();
          if (selector) {
            var newTerms = simpleRules.createTermsFor(selector);
            self.addUniqueTerms(newTerms);
          }
        };

        var index = 0;while (index < terms.length) {
          var term = terms[index];
          expandStates(term);
          expandTerms(term);
          index++;
        }
      };

      this.debugPrint = function () {
        terms.forEach(function (term) {
          return term.debugPrint();
        });
      };
    };

    return State;
  }

};

exports.default = StateModule;