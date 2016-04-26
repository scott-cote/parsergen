
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

        this.createRow = function() {
          this.debugPrint();
          let row = {};
          terms.filter(term => term.getRightNonterminal()).forEach(term => {
            row[term.getRightNonterminal()] = term.getGoto();
          });
          terms.filter(term => term.getRightTerminal()).forEach(term => {
            let terminal = term.getRightTerminal();
            if (terminal === '$') {
              row[terminal] = 'a()';
            } else {
              row[terminal] = 's('+term.getGoto()+')';
            }
          });
          terms.filter(term => !term.getRightSymbol()).forEach(term => {
            //row['follow '+term.getLeft()] = 'r('+term.getRule()+')';
            let follow = simpleRules.getFollowFor(term.getLeft());
            follow.forEach(symbol => {
              row[symbol] = 'r('+term.getRule()+')';
            });
          });
          return row;
        };
    };

    return State;
  }
};

export default StateModule;
