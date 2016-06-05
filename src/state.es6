
let StateModule = {

  createClass: function(Term) {

      let State = function(id, code, rootTerms) {

        let terms = [].concat(rootTerms);

        let stateComplete = false;

        let symbolLookup;

        let follow = {};

        this.getFollowFor = function(nonterminal) {
          let self = this;
          if (!follow[nonterminal]) {
            let allFollow = code.rules.reduce((outterValue, rule) => {
              outterValue = outterValue.concat(rule.right.reduce((value, token, index, array) => {
                if (nonterminal === token.symbol) {
                  if (index < array.length-1) {
                    let newVal = self.getFirstFor(array[index+1].symbol);
                    return value.concat(newVal);
                  } else {
                    let newVal = self.getFollowFor(rule.left);
                    return value.concat(newVal);
                  }
                }
                return value;
              }, []));
              return outterValue;
            }, []);
            follow[nonterminal] = [...new Set(allFollow)];
          }
          return follow[nonterminal];
        };

        this.getFirstFor = function(symbol) {
          return code.testFirstTable[symbol].symbols;
        };

        let createTermsFor = function(symbol) {
          return code.rules.filter(rule => rule.left === symbol)
            .map(rule => new Term(rule.id, rule.left, [], rule.right));
        };

        let completeState = function() {

          if (stateComplete) return;

          let termIndex = {};

          let expandTerm = function(term) {
            let symbol = term.getRightNonterminal();
            if (symbol) {
              let newTerms = createTermsFor(symbol)
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
          let row = {};
          terms.filter(term => term.getRightNonterminal()).forEach(term => {
            row[term.getRightNonterminal()] = `goto(${term.getGoto()})`;
          });
          terms.filter(term => term.getRightTerminal()).forEach(term => {
            let terminal = term.getRightTerminal();
            if (terminal === '$') {
              row[terminal] = 'accept()';
            } else {
              row[terminal] = 'shift('+term.getGoto()+')';
            }
          });
          terms.filter(term => !term.getRightSymbol()).forEach(term => {
            //row['follow '+term.getLeft()] = 'r('+term.getRule()+')';
            let follow = this.getFollowFor(term.getLeft());
            follow.forEach(symbol => {
              row[symbol] = 'reduce('+term.getRule()+')';
            });
          });
          return row;
        };

        this.render = function() {
          let row = this.createRow();
          let values = Object.keys(row).map(key => {
            return `"${key}": ${row[key]}`;
          }).join();
          return `{ ${values} }`;
        }
    };

    return State;
  }
};

export default StateModule;
