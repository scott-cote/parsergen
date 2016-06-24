import fs from 'fs';
import Stream from 'stream';
import ParserModule from './parser.js';
//import RulesModule from './rules.js';
//import SimpleRuleModule from './simple_rule.js';
//import SimpleRulesModule from './simple_rules.js';
import StateModule from './state.js';
import StatesModule from './states.js';
import TermModule from './term.js';

let Term = TermModule.createClass();
//let SimpleRule = SimpleRuleModule.createClass(Term);
//let SimpleRules = SimpleRulesModule.createClass(Term);
let State = StateModule.createClass(Term);
//let GeneratorRules = RulesModule.createClass(SimpleRule, SimpleRules);
let States = StatesModule.createClass(State, Term);

let Generator = {
  createParser: function(code) {
    code.states = new States(code);
    return code;
  }
};

let generator = function() {
  return through.obj((chunk, enc, done) => {
    let parser = Generator.createParser(chunk);
    return done(null, parser);
  });
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
