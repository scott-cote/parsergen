'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var StateModule = {

  createClass: function createClass() {

    var idIndex = {};

    var State = function State(id) {

      var terms = [];

      var termIndex = {};

      this.addUniqueTerms = function (newTerms) {
        newTerms = [].concat(newTerms);
        //console.log('newTerms')
        //newTerms.forEach(term => console.log(term.getId()));
        //if (id === 0) console.log('adding to zero');
        [].concat(newTerms).forEach(function (newTerm) {
          var id = newTerm.getId();
          if (!termIndex[id]) {
            termIndex[id] = true;
            terms.push(newTerm);
          }
        });
        //console.log('done')
        return this;
      };

      this.addUniqueTerms2 = function (newTerms) {
        //console.log('newTerms2')
        //newTerms.forEach(term => console.log(term.getId()));

        //if (id === 0) console.log('adding to zero');
        [].concat(newTerms).forEach(function (newTerm) {
          var id = newTerm.getId();
          if (!termIndex[id]) {
            termIndex[id] = true;
            terms.push(newTerm);
          }
        });

        //console.log('done')
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
          //expandStates(term);
          expandTerms(term);
          index++;
        }

        var tokens = [].concat(_toConsumableArray(new Set(terms.map(function (term) {
          return term.getRightToken();
        }))));

        tokens.forEach(function (token) {
          if (token === '$') return;
          var newTerms = terms.filter(function (term) {
            return token === term.getRightToken();
          }).map(function (term) {
            return term.createShiftTerm();
          }).filter(function (term) {
            return !idIndex[term.getId()];
          });
          newTerms.forEach(function (term) {
            return idIndex[term.getId()] = true;
          });
          if (newTerms.length) {
            states.addState().addUniqueTerms2(newTerms);
          }
        });
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