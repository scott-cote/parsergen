
let StateModule = {

  createClass: function() {

    /*
    let generateShiftTerm = function(term) {
      var newTerm = term.generateShiftTerm();
      //var state = registry.resolveState(newTerm, states.length);
      //term.setTarget(state);
      return newTerm;
    };
    */

    let complete = function(terms, term) {
      /*
      if (term.hasRight()) {
        var rightStart = term.getRightStart();
        if (nonTerms.includes(rightStart)) {
          return (terms||[]).concat(rules.generateTermsFor(rightStart));
        }
      }
      */
      return terms||[];
    };

    let State = function() {

      let terms = [];

      this.addUniqueTerms = function(newTerms) {
        terms = terms.concat(newTerms);
        return this;
      };

      this.expand = function(states) {

        let expandStates = function(term) {
          let newTerm = term.createShiftTerm();
          let selector = newTerm.getRightToken();
          if (selector) {
            let state = states.findBySelector(selector) || states.addState(selector);
            state.addUniqueTerms(newTerm);
          }
        };

        let expandTerms = function(term) {
          let selector = term.getRightNonterminal();
          //if (selector) {
          //  let newTerms = simpleRules.createTermsFor(selector);
          //  this.addUniqueTerms(newTerms);
          //}
        };

        let index = 0; while (index < terms.length) {
          let term = terms[index];
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

      this.debugPrint = function() {
        terms.forEach(term => term.debugPrint());
      };
    };

    return State;
  }

};

export default StateModule;
