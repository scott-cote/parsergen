
let StateModule = {

  createClass: function() {

      let idIndex = {};

      let State = function(id) {

      let terms = [];

      let termIndex = {};

      this.addUniqueTerms = function(newTerms) {
        newTerms = [].concat(newTerms);
        //console.log('newTerms')
        //newTerms.forEach(term => console.log(term.getId()));
        //if (id === 0) console.log('adding to zero');
        [].concat(newTerms).forEach(newTerm => {
          let id = newTerm.getId();
          if (!termIndex[id]) {
            termIndex[id] = true;
            terms.push(newTerm);
          }
        });
        //console.log('done')
        return this;
      };

      this.addUniqueTerms2 = function(newTerms) {
        //console.log('newTerms2')
        //newTerms.forEach(term => console.log(term.getId()));

        //if (id === 0) console.log('adding to zero');
        [].concat(newTerms).forEach(newTerm => {
          let id = newTerm.getId();
          if (!termIndex[id]) {
            termIndex[id] = true;
            terms.push(newTerm);
          }
        });

        //console.log('done')
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
          //expandStates(term);
          expandTerms(term);
          index++;
        }

        let tokens = [...new Set(terms.map(term => term.getRightToken()))];

        tokens.forEach(token => {
          if (token === '$') return;
          let newTerms = terms
            .filter(term => token === term.getRightToken())
            .map(term => term.createShiftTerm())
            .filter(term => !idIndex[term.getId()]);
          newTerms.forEach(term => idIndex[term.getId()] = true);
          if (newTerms.length) {
            states.addState().addUniqueTerms2(newTerms);
          }
        });

      };

      this.debugPrint = function() {
        terms.forEach(term => term.debugPrint());
      };
    };

    return State;
  }

};

export default StateModule;
