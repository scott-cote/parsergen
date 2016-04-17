import ParserGen from './index.js';

let rules = ParserGen.Rules.create();

rules.addRule('S', 'aSbS'.split(''));
rules.addRule('S', 'a'.split(''));

let simpleRules = rules.createSimpleRules();
let states = ParserGen.States.create(simpleRules);
let parser = ParserGen.Parser.create(states);

parser.save();
