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

  let state = this;

  state.row = {};

  state.getRightTerminal = getRightTerminal;

  state.getRightSymbol = getRightSymbol;

  state.terms = [].concat(rootTerms);

  state.stateComplete = false;

  let symbolLookup;

  let follow = {};

  let completeState = function(state) {

    if (state.stateComplete) return;

    let termIndex = {};

    let expandTerm = function(state, term) {
      let symbol = getRightNonterminal(term);
      if (symbol) {
        let newTerms = createTermsFor(symbol)
          .filter(term => !termIndex[getId(term)]);
        newTerms.forEach(term => termIndex[getId(term)] = true);
        state.terms = state.terms.concat(newTerms);
      }
    };

    let index = 0; while (index < state.terms.length) {
      expandTerm(state, state.terms[index]);
      index++;
    }

    state.stateComplete = true;
  };

  state.createRow = function() {
    state.terms.filter(term => getRightNonterminal(term)).forEach(term => {
      state.row[getRightNonterminal(term)] = `goto(${term.goto})`;
    });
    state.terms.filter(term => state.getRightTerminal(term)).forEach(term => {
      let terminal = state.getRightTerminal(term);
      if (terminal === '$') {
        state.row[terminal] = 'accept()';
      } else {
        state.row[terminal] = 'shift('+term.goto+')';
      }
    });
    state.terms.filter(term => !state.getRightSymbol(term)).forEach(term => {
      //row['follow '+term.getLeft()] = 'r('+term.getRule()+')';
      let follow = state.getFollowFor(term.left);
      follow.forEach(symbol => {
        state.row[symbol] = 'reduce('+term.rule+')';
      });
    });
    return state.row;
  };

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
    //console.log(nonterminal+': '+JSON.stringify(Array.from(code.followTable[nonterminal]))+' vs '+JSON.stringify(follow[nonterminal]));
    return follow[nonterminal];
  };

  this.getFirstFor = function(symbol) {
    return Array.from(code.firstTable[symbol].symbols);
  };

  let createTermsFor = function(symbol) {
    return code.rules.filter(rule => rule.left === symbol)
      .map(rule => { return { rule: rule.id, left: rule.left, middle: [], right: rule.right }});
  };


  let createSymbolLookup = function() {
    if (symbolLookup) return;
    symbolLookup = {};
    state.terms
      .filter(term => !!getRightSymbol(term))
      .forEach(term => symbolLookup[getRightSymbol(term)] = true);
  }

  this.getSeedTermsFor = function(symbol) {

    let createShiftTerm = function(term) {
      let newMiddle = term.right[0] ? term.middle.concat(term.right[0]) : term.middle;
      return { rule: term.rule, left: term.left, middle: newMiddle, right: term.right.slice(1) };
    };

    completeState(state);
    createSymbolLookup();
    if (!symbolLookup[symbol]) return [];
    return state.terms
      .filter(term => symbol === getRightSymbol(term))
      .map(term => createShiftTerm(term));
  };

  this.setGotoFor = function(symbol, value) {
    state.terms
      .filter(term => symbol === getRightSymbol(term))
      .forEach(term => term.goto = value);
  };
};

let generateStates = function(code) {

  let states = [];

  let stateCache = {};

  let rule = code.rules[0];
  states.push(new State(0, code, { rule: rule.id, left: rule.left, middle: [], right: rule.right }));

  let index = 0; while (index < states.length) {
    code.symbols.forEach(symbol => {
      if (symbol === '$') return;
      let seedTerms = states[index].getSeedTermsFor(symbol);
      if (seedTerms.length) {
        let id = seedTerms.map(term => getId(term)).sort().join();
        let state = stateCache[id] || states.length;
        if (state === states.length) {
          stateCache[id] = state;
          states.push(new State(states.length, code, seedTerms));
        }
        states[index].setGotoFor(symbol, state);
      }
    });
    states[index].createRow();
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
    code.stateTable = code.states.map(state => state.row);
    return done(null, code);
  }
};

export default function() {
  return new Transformer();
};
