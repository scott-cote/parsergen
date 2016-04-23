#!/usr/bin/env node

'use strict';

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rules = new _index2.default.Rules('E');

rules.addRule('E', 'E * B');
rules.addRule('E', 'E + B');
rules.addRule('E', 'B');
rules.addRule('B', '0');
rules.addRule('B', '1');

var terminals = ['0', '1', '+', '*'];

/*
let rules = new ParserGen.Rules('S');

rules.addRule('S', 'a S b S');
rules.addRule('S', 'a');

let terminals = ['a', 'b', '$'];

let rules = new ParserGen.Rules('E');

rules.addRule('E', 'E + T');
rules.addRule('E', 'T');
rules.addRule('T', 'T * F');
rules.addRule('T', 'F');
rules.addRule('F', '( E )');
rules.addRule('F', 'i');

let terminals = ['+', '*', '(', ')', 'i', '$'];
*/

var simpleRules = rules.createSimpleRules(terminals);
var states = new _index2.default.States(simpleRules);

states.printTable();

//states.debugPrint();

//let parser = new ParserGen.Parser(states);

//parser.save();