import Stream from 'stream';

let compile = function(code) {

  let follow = {};

  let getFirstFor = function(symbol) {
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

  let createRow = function(state) {
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
      let follow = getFollowFor(state, term.left);
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

  let createTermsFor = function(symbol) {
    return code.rules.filter(rule => rule.left === symbol)
      .map(rule => { return { rule: rule.id, left: rule.left, middle: [], right: rule.right }});
  };

  let expandTerm = function(state, termIndex, term) {
    let symbol = getRightNonterminal(term);
    if (symbol) {
      let newTerms = createTermsFor(symbol)
        .filter(term => !termIndex[getId(term)]);
      newTerms.forEach(term => termIndex[getId(term)] = true);
      state.terms = state.terms.concat(newTerms);
    }
  };

  let completeState = function(state) {

    if (state.stateComplete) return;

    let termIndex = {};

    let index = 0; while (index < state.terms.length) {
      expandTerm(state, termIndex, state.terms[index]);
      index++;
    }

    state.stateComplete = true;
  };

  let getSeedTermsFor = function(state, symbol) {
    if (!state.symbolLookup[symbol]) return [];
    return state.terms
      .filter(term => symbol === getRightSymbol(term))
      .map(term => createShiftTerm(term));
  };

  let getFollowFor = function(state, nonterminal) {
    let self = this;
    if (!follow[nonterminal]) {
      let allFollow = code.rules.reduce((outterValue, rule) => {
        outterValue = outterValue.concat(rule.right.reduce((value, token, index, array) => {
          if (nonterminal === token.symbol) {
            if (index < array.length-1) {
              let newVal = getFirstFor(array[index+1].symbol);
              return value.concat(newVal);
            } else {
              let newVal = getFollowFor(self, rule.left);
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

  let State = function(id, rootTerms) {

    let state = this;

    state.row = {};

    state.terms = [].concat(rootTerms);

    state.stateComplete = false;

    state.symbolLookup;
  };

  let expandTerms = function(state) {
    completeState(state);
    createSymbolLookup(state);
  };

  let spawnStates = function(state, states, stateCache) {
    code.symbols.forEach(symbol => {
      if (symbol === '$') return;
      let seedTerms = getSeedTermsFor(state, symbol);
      if (seedTerms.length) {
        let id = seedTerms.map(term => getId(term)).sort().join();
        let stateIndex = stateCache[id] || states.length;
        if (stateIndex === states.length) {
          stateCache[id] = stateIndex;
          states.push(new State(states.length, seedTerms));
        }
        setGotoFor(state, symbol, stateIndex);
      }
    });
    createRow(state);
  };

  code.states = [];

  let stateCache = {};

  let rule = code.rules[0];
  code.states.push(new State(0, { rule: rule.id, left: rule.left, middle: [], right: rule.right }));

  let index = 0; while (index < code.states.length) {
    let state = code.states[index];
    expandTerms(state);
    spawnStates(state, code.states, stateCache);
    index++;
  }

  code.stateTable = code.states.map(state => state.row);
  return code;
};

class Transformer extends Stream.Transform {

  constructor() {
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    try { done(null, compile(code)); }
    catch (err) { done(err); }
  }
};

export default function() {
  return new Transformer();
};
