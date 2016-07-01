import Stream from 'stream';

let follow = {};

let getFirstFor = function(code, symbol) {
  return Array.from(code.firstTable[symbol].symbols);
};

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

let createRow = function(code, state) {
  state.terms.filter(term => getRightNonterminal(term)).forEach(term => {
    state.row[getRightNonterminal(term)] = `goto(${term.goto})`;
  });
  state.terms.filter(term => getRightTerminal(term)).forEach(term => {
    let terminal = getRightTerminal(term);
    if (terminal === '$') {
      state.row[terminal] = 'accept()';
    } else {
      state.row[terminal] = 'shift('+term.goto+')';
    }
  });
  state.terms.filter(term => !getRightSymbol(term)).forEach(term => {
    let follow = state.getFollowFor(code, term.left);
    follow.forEach(symbol => {
      state.row[symbol] = 'reduce('+term.rule+')';
    });
  });
  return state.row;
};

let setGotoFor = function(state, symbol, value) {
  state.terms
    .filter(term => symbol === getRightSymbol(term))
    .forEach(term => term.goto = value);
};

let createShiftTerm = function(term) {
  let newMiddle = term.right[0] ? term.middle.concat(term.right[0]) : term.middle;
  return { rule: term.rule, left: term.left, middle: newMiddle, right: term.right.slice(1) };
};

let createSymbolLookup = function(state) {
  if (state.symbolLookup) return;
  state.symbolLookup = {};
  state.terms
    .filter(term => !!getRightSymbol(term))
    .forEach(term => state.symbolLookup[getRightSymbol(term)] = true);
};

let State = function(id, code, rootTerms) {

  let state = this;

  state.row = {};

  state.terms = [].concat(rootTerms);

  state.stateComplete = false;

  state.symbolLookup;

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

  this.getFollowFor = function(code, nonterminal) {
    let self = this;
    if (!follow[nonterminal]) {
      let allFollow = code.rules.reduce((outterValue, rule) => {
        outterValue = outterValue.concat(rule.right.reduce((value, token, index, array) => {
          if (nonterminal === token.symbol) {
            if (index < array.length-1) {
              let newVal = getFirstFor(code, array[index+1].symbol);
              return value.concat(newVal);
            } else {
              let newVal = self.getFollowFor(code, rule.left);
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

  let createTermsFor = function(symbol) {
    return code.rules.filter(rule => rule.left === symbol)
      .map(rule => { return { rule: rule.id, left: rule.left, middle: [], right: rule.right }});
  };

  this.getSeedTermsFor = function(symbol) {
    completeState(state);
    createSymbolLookup(state);
    if (!state.symbolLookup[symbol]) return [];
    return state.terms
      .filter(term => symbol === getRightSymbol(term))
      .map(term => createShiftTerm(term));
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
        setGotoFor(states[index], symbol, state);
      }
    });
    createRow(code, states[index]);
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
    try {
      console.log('Running generator');
      code.states = generateStates(code);
      code.stateTable = code.states.map(state => state.row);
      return done(null, code);
    } catch (err) {
      done(err);
    }
  }
};

export default function() {
  return new Transformer();
};
