import Stream from 'stream';

    let getId = function(term) {
      return term.left+'>'+term.middle.map(element => element.symbol).join(':')+'.'+term.right.map(element => element.symbol).join(':');
    };
    let getRightNonterminal = function(term) {
      let token = term.right[0];
      if (token && token.type === 'NONTERMINAL') return token.symbol;
    };
      let getRightSymbol = function(term) {
        if (term.right[0]) return term.right[0].symbol;
      };
      let getRightTerminal = function(term) {
        let token = term.right[0];
        if (token && token.type === 'TERMINAL') return token.symbol;
      };

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
          return Array.from(code.firstTable[symbol].symbols);
        };

        let createTermsFor = function(symbol) {
          return code.rules.filter(rule => rule.left === symbol)
            .map(rule => { return { rule: rule.id, left: rule.left, middle: [], right: rule.right }});
        };

        let completeState = function() {

          if (stateComplete) return;

          let termIndex = {};

          let expandTerm = function(term) {
            let symbol = getRightNonterminal(term);
            if (symbol) {
              let newTerms = createTermsFor(symbol)
                .filter(term => !termIndex[getId(term)]);
              newTerms.forEach(term => termIndex[getId(term)] = true);
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
            .filter(term => !!getRightSymbol(term))
            .forEach(term => symbolLookup[getRightSymbol(term)] = true);
        }

        this.getRootTermsFor = function(symbol) {

          let createShiftTerm = function(term) {
            let newMiddle = term.right[0] ? term.middle.concat(term.right[0]) : term.middle;
            return { rule: term.rule, left: term.left, middle: newMiddle, right: term.right.slice(1) };
          };

          completeState();
          createSymbolLookup();
          if (!symbolLookup[symbol]) return [];
          return terms
            .filter(term => symbol === getRightSymbol(term))
            .map(term => createShiftTerm(term));
        };

        this.setGotoFor = function(symbol, value) {
          terms
            .filter(term => symbol === getRightSymbol(term))
            .forEach(term => term.goto = value);
        };

        this.debugPrint = function() {
          terms.forEach(term => term.debugPrint());
        };

        this.createRow = function() {
          let row = {};
          terms.filter(term => getRightNonterminal(term)).forEach(term => {
            row[getRightNonterminal(term)] = `goto(${term.goto})`;
          });
          terms.filter(term => getRightTerminal(term)).forEach(term => {
            let terminal = getRightTerminal(term);
            if (terminal === '$') {
              row[terminal] = 'accept()';
            } else {
              row[terminal] = 'shift('+term.goto+')';
            }
          });
          terms.filter(term => !getRightSymbol(term)).forEach(term => {
            //row['follow '+term.getLeft()] = 'r('+term.getRule()+')';
            let follow = this.getFollowFor(term.left);
            follow.forEach(symbol => {
              row[symbol] = 'reduce('+term.rule+')';
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



let generateStates = function(code) {

  let states = [];

  let rootTermsState = {};

  let getId = function(term) {
    return term.left+'>'+term.middle.map(element => element.symbol).join(':')+'.'+term.right.map(element => element.symbol).join(':');
  };

  let getRootTerm = function() {
    let rule = code.rules[0];
    return { rule: rule.id, left: rule.left, middle: [], right: rule.right };
  };

  states.push(new State(0, code, getRootTerm()));

  let index = 0; while (index < states.length) {
    code.symbols.forEach(symbol => {
      if (symbol === '$') return;
      let rootTerms = states[index].getRootTermsFor(symbol);
      if (rootTerms.length) {
        let id = rootTerms.map(term => getId(term)).sort().join();
        let state = rootTermsState[id] || states.length;
        if (state === states.length) {
          rootTermsState[id] = state;
          states.push(new State(states.length, code, rootTerms));
        }
        states[index].setGotoFor(symbol, state);
      }
    });
    index++;
  }

  return states;
};

class Transformer extends Stream.Transform {

  constructor() {
    console.log('gen start')
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    console.log('Running generator');
    code.states = generateStates(code);
    return done(null, code);
  }
};

export default function() {
  return new Transformer();
};
