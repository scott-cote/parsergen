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
    /*
    state.terms.filter(term => getRightNonterminal(term)).forEach(term => {
      state.row[getRightNonterminal(term)] = { operation: 'goto', value: term.goto }; // `goto(${term.goto})`;
    });
    state.terms.filter(term => getRightTerminal(term)).forEach(term => {
      let terminal = getRightTerminal(term);
      if (terminal === '$') {
        state.row[terminal] = { operation: 'accept' }; // 'accept()';
      } else {
        state.row[terminal] = { operation: 'shift', value: term.goto }; // 'shift('+term.goto+')';
      }
    });
    state.terms.filter(term => !getRightSymbol(term)).forEach(term => {
      let follow = getFollowFor(state, term.left);
      follow.forEach(symbol => {
        state.row[symbol] = { operation: 'reduce', value: term.rule }; // 'reduce('+term.rule+')';
      });
    });
    */
    return state.row;
  };

  let setGotoFor = function(state, symbol, value) {
    state.terms
      .filter(term => symbol === getRightSymbol(term))
      .forEach(term => term.goto = value);
    Object.keys(state.row).forEach(key => {
      let item = state.row[key];
      if (symbol === item.symbol && (item.operation === 'shift' || item.operation === 'goto')) {
        item.value = value;
      }
    });
  };

  let createShiftTerm = function(term) {
    let newMiddle = term.right[0] ? term.middle.concat(term.right[0]) : term.middle;
    return { rule: term.rule, left: term.left, middle: newMiddle, right: term.right.slice(1) };
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
      //state.terms = state.terms.concat(newTerms);
      newTerms.forEach(term => addTerm(state, term));
    }
  };

  let completeState = function(state) {
    let termIndex = {};
    let index = 0; while (index < state.terms.length) {
      expandTerm(state, termIndex, state.terms[index]);
      index++;
    }
  };

  let getSeedTermsFor = function(state, symbol) {
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

  let addTerm = function(state, term) {
    state.terms.push(term);
    let nonterminal = getRightNonterminal(term);
    if (!!nonterminal) {
      state.row[nonterminal] = { operation: 'goto', symbol: getRightSymbol(term) }; // `goto(${term.goto})`;
      return;
    }
    let terminal = getRightTerminal(term);
    if (!!terminal) {
      if (terminal === '$') {
        state.row[terminal] = { operation: 'accept' }; // 'accept()';
      } else {
        state.row[terminal] = { operation: 'shift', symbol: getRightSymbol(term) }; // 'shift('+term.goto+')';
      }
      return;
    };
    if (!getRightSymbol(term)) {
      getFollowFor(state, term.left).forEach(symbol => {
        state.row[symbol] = { operation: 'reduce', value: term.rule }; // 'reduce('+term.rule+')';
      });
      return;
    };
  };

  let createState = function(seedTerms) {
    let state = { row: {}, terms: [] };
    seedTerms.forEach(term => addTerm(state, term));
    return state;
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
          states.push(createState(seedTerms));
        }
        setGotoFor(state, symbol, stateIndex);
      }
    });
    createRow(state);
  };

  code.states = [];

  let stateCache = {};

  let rule = code.rules[0];
  code.states.push(createState([{ rule: rule.id, left: rule.left, middle: [], right: rule.right }]));

  let index = 0; while (index < code.states.length) {
    let state = code.states[index];
    completeState(state);
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
