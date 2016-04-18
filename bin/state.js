"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StateModule = {

  createClass: function createClass() {

    /*
    let generateShiftTerm = function(term) {
      var newTerm = term.generateShiftTerm();
      //var state = registry.resolveState(newTerm, states.length);
      //term.setTarget(state);
      return newTerm;
    };
    */

    var complete = function complete(terms, term) {
      /*
      if (term.hasRight()) {
        var rightStart = term.getRightStart();
        if (nonTerms.includes(rightStart)) {
          return (terms||[]).concat(rules.generateTermsFor(rightStart));
        }
      }
      */
      return terms || [];
    };

    var State = function State() {

      var terms = [];

      this.addUniqueTerms = function (newTerms) {
        terms = terms.concat(newTerms);
        return this;
      };

      this.expand = function (states) {

        var expandStates = function expandStates(term) {
          var newTerm = term.createShiftTerm();
          var selector = newTerm.getRightToken();
          if (selector) {
            var state = states.findBySelector(selector) || states.addState(selector);
            state.addUniqueTerms(newTerm);
          }
        };

        var expandTerms = function expandTerms(term) {
          var selector = term.getRightNonterminal();
          //if (selector) {
          //  let newTerms = simpleRules.createTermsFor(selector);
          //  this.addUniqueTerms(newTerms);
          //}
        };

        var index = 0;while (index < terms.length) {
          var term = terms[index];
          expandStates(term);
          expandTerms(term);
          index++;
        }

        //let newTerms = terms;
        //while (newTerms.length) {
        //let shiftTerms = newTerms.filter(term => term.hasRight())
        //  .map(term => term.generateShiftTerm());
        // if (shiftTerms.length) states.addState(shiftTerms);
        //newTerms = newTerms.reduce(complete);
        //terms = terms.concat(newTerms);
        //}
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