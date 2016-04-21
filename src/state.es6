
let StateModule = {

  createClass: function() {

      let State = function(id, simpleRules, rootTerms) {

        let terms = [].concat(rootTerms);

        let stateComplete = false;

        let symbolLookup;

        let completeState = function() {

          if (stateComplete) return;

          let termIndex = {};

          let expandTerm = function(term) {
            let symbol = term.getRightNonterminal();
            if (symbol) {
              let newTerms = simpleRules.createTermsFor(symbol)
                .filter(term => !termIndex[term.getId()]);
              newTerms.forEach(term => termIndex[term.getId()] = true);
              terms = terms.concat(newTerms);
            }
          };

          let index = 0; while (index < terms.length) {
            expandTerm(terms[index]);
            index++;
          }

          stateComplete = true;
        };

        let createSymbolLookup = function() {
          if (symbolLookup) return;
          symbolLookup = {};
          terms
            .filter(term => !!term.getRightSymbol())
            .forEach(term => symbolLookup[term.getRightSymbol()] = true);
        }

        this.getRootTermsFor = function(symbol) {
          completeState();
          createSymbolLookup();
          if (!symbolLookup[symbol]) return [];
          return terms
            .filter(term => symbol === term.getRightSymbol())
            .map(term => term.createShiftTerm());
        };

        this.setGotoFor = function(symbol, value) {
          terms
            .filter(term => symbol === term.getRightSymbol())
            .forEach(term => term.setGoto(value));
        };

        this.debugPrint = function() {
          terms.forEach(term => term.debugPrint());
        };
    };

    return State;
  }
};

export default StateModule;
