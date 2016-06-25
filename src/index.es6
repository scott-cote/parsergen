import fs from 'fs';
import Stream from 'stream';
import ParserModule from './parser.js';
//import RulesModule from './rules.js';
//import SimpleRuleModule from './simple_rule.js';
//import SimpleRulesModule from './simple_rules.js';
import StateModule from './state.js';
//import StatesModule from './states.js';

//let SimpleRule = SimpleRuleModule.createClass(Term);
//let SimpleRules = SimpleRulesModule.createClass(Term);
let State = StateModule.createClass();
//let GeneratorRules = RulesModule.createClass(SimpleRule, SimpleRules);
//let States = StatesModule.createClass(State);

let generateStates = function(code) {

  let states = [];

  let rootTermsState = {};

    let getId = function(term) {
      return term.left+'>'+term.middle.map(element => element.symbol).join(':')+'.'+term.right.map(element => element.symbol).join(':');
    };

    /*

    let getRightNonterminal = function(term) {
      let token = term.right[0];
      if (token && token.type === 'NONTERMINAL') return token.symbol;
    };
  this.debugPrint = function() {
    states.forEach((state, index) => {
      console.log('');
      console.log('I'+index);
      state.debugPrint();
    });
  };

  this.printTable = function() {
    states.forEach((state, index) => {
      let row = state.createRow();
      row.state = index;
      console.log(JSON.stringify(row));
    });
  };

  this.render = function() {
    return states.map(state => state.render()).join(',\n  ');
  };
  */

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


let Generator = {
  createParser: function(code) {
    code.states = generateStates(code);
    return code;
  }
};

class Transformer extends Stream.Transform {

  constructor() {
    console.log('gen start')
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    console.log('Running generator');
    let parser = Generator.createParser(code);
    return done(null, parser);
  }
};
export default function() {
  return new Transformer();
};
