import ParserGen from './index.js';

let rules = new ParserGen.Rules('S');

rules.addRule('S', 'a S b S');
rules.addRule('S', 'a');

let terminals = ['a', 'b', '$'];

let simpleRules = rules.createSimpleRules(terminals);
let states = new ParserGen.States(simpleRules);

//states.debugPrint();

let parser = new ParserGen.Parser(states);

parser.save();
