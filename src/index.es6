import fs from 'fs';
import Stream from 'stream';
import ParserModule from './parser.js';
//import RulesModule from './rules.js';
//import SimpleRuleModule from './simple_rule.js';
//import SimpleRulesModule from './simple_rules.js';
import StateModule from './state.js';
import StatesModule from './states.js';

//let SimpleRule = SimpleRuleModule.createClass(Term);
//let SimpleRules = SimpleRulesModule.createClass(Term);
let State = StateModule.createClass();
//let GeneratorRules = RulesModule.createClass(SimpleRule, SimpleRules);
let States = StatesModule.createClass(State);

let Generator = {
  createParser: function(code) {
    code.states = new States(code);
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
