
let StateModule = {

  createClass: function() {

      let State = function(id) {

      let terms = [];

      let termIndex = {};

      this.addUniqueTerms = function(newTerms) {
        //if (id === 0) console.log('adding to zero');
        [].concat(newTerms).forEach(newTerm => {
          let id = newTerm.getId();
          if (!termIndex[id]) {
            termIndex[id] = true;
            terms.push(newTerm);
          }
        });
        return this;
      };

      this.expand = function(states, simpleRules) {

        //console.log('expanding '+id)

        let self = this;

        let expandStates = function(term) {
          let newTerm = term.createShiftTerm();
          let selector = term.getRightToken();
          if (selector) {
            //console.log(selector)
            //console.log(states.findBySelector(selector));
            let state = states.findBySelector(selector) || states.addState(selector);
            state.addUniqueTerms(newTerm);
          }
        };

        let expandTerms = function(term) {
          let selector = term.getRightNonterminal();
          if (selector) {
            let newTerms = simpleRules.createTermsFor(selector);
            self.addUniqueTerms(newTerms);
          }
        };

        let index = 0; while (index < terms.length) {
          let term = terms[index];
          expandStates(term);
          expandTerms(term);
          index++;
        }
      };

      this.debugPrint = function() {
        terms.forEach(term => term.debugPrint());
      };
    };

    return State;
  }

};

export default StateModule;
