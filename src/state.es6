
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

        this.generateFirstTable = function() {

          let getFirstSetFor;

          let getFirstForRule = function(rule) {
            return rule.right.reduce((cntx, element) => {
              if (!cntx.done) {
                let first = getFirstSetFor(element.symbol);
                if (!first.canBeEmpty) {
                  cntx.done = true;
                  cntx.canBeEmpty = false;
                }
                cntx.symbols = cntx.symbols.concat(first);
              }
              return cntx;
            }, { done: false, canBeEmpty: true, symbols: [] });
          };

          let generateFirstSetFor = function(symbol) {
            let result = { canBeEmpty: false, symbols: [] };
            if (code.terminals.has(symbol)) {
              result.symbols.push(symbol);
            } else {
              code.rules.filter(rule => rule.left === symbol).forEach(rule => {
                if (rule.right.length === 0) {
                  result.canBeEmpty = true;
                } else {
                  let first = getFirstForRule(rule);
                  if (first.canBeEmpty) result.canBeEmpty = true;
                  result.symbols = result.symbols.concat(first.symbols);
                }
              });
            }
            return this.firstTable[symbol] = result;
          };

          getFirstSetFor = function(symbol) {
            return this.firstTable[symbol] || generateFirstSetFor(symbol);
          };

          this.firstTable = {};
          code.symbols.forEach(symbol => {
            this.firstTable[symbol] = getFirstSetFor(symbol);
          });
        };

        let first = {};

        this.getFirstFor = function(symbol) {
          let self = this;
          if (!first[symbol]) {
            if (code.terminals.has(symbol)) {
              first[symbol] = [symbol];
            } else {
              first[symbol] = [...new Set(code.rules
                .filter(rule => symbol === rule.left && symbol !== rule.right[0].symbol)
                .reduce((value, rule) => {
                  return value.concat(self.getFirstFor(rule.right[0].symbol));
                }, []))];
            }
          }
          return first[symbol];
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
