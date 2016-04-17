import ParserGen from './index.js';

let rules = new ParserGen.Rules();

rules.addRule('S', 'aSbS'.split(''));
rules.addRule('S', 'a'.split(''));

let simpleRules = rules.createSimpleRules();
let states = new ParserGen.States(simpleRules);
let parser = new ParserGen.Parser(states);

parser.save();
