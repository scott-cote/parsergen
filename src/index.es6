import fs from 'fs';
import Stream from 'stream';
import ParserModule from './parser.js';
import StateModule from './state.js';

let State = StateModule.createClass();

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
