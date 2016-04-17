#!/usr/bin/env node

'use strict';

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rules = _index2.default.Rules.create();

rules.addRule('S', 'aSbS'.split(''));
rules.addRule('S', 'a'.split(''));

var simpleRules = rules.createSimpleRules();
var states = _index2.default.States.create(simpleRules);
var parser = _index2.default.Parser.create(states);

parser.save();