#!/usr/bin/env node

'use strict';

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
let rules = new ParserGen.Rules('S');

rules.addRule('S', 'a S b S');
rules.addRule('S', 'a');

let terminals = ['a', 'b', '$'];
*/

var rules = new _index2.default.Rules('E');

rules.addRule('E', 'E + T');
rules.addRule('E', 'T');
rules.addRule('T', 'T * F');
rules.addRule('T', 'F');
rules.addRule('F', '( E )');
rules.addRule('F', 'i');

var terminals = ['+', '*', '(', ')', 'i', '$'];

var simpleRules = rules.createSimpleRules(terminals);
var states = new _index2.default.States(simpleRules);

states.debugPrint();

var parser = new _index2.default.Parser(states);

parser.save();