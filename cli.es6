import ParserGen from './index.js';

let rules = new ParserGen.Rules('S');

rules.addRule('S', 'a S b S');
rules.addRule('S', 'a');

let simpleRules = rules.createSimpleRules();
let states = new ParserGen.States(simpleRules);
let parser = new ParserGen.Parser(states);

parser.save();
