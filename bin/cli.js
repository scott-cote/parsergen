#!/usr/bin/env node

'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _mergeStream = require('merge-stream');

var _mergeStream2 = _interopRequireDefault(_mergeStream);

var _scanner = require('./scanner.js');

var _scanner2 = _interopRequireDefault(_scanner);

var _parser = require('./parser.js');

var _parser2 = _interopRequireDefault(_parser);

var _complex_rule_compiler = require('./complex_rule_compiler.js');

var _complex_rule_compiler2 = _interopRequireDefault(_complex_rule_compiler);

var _simple_rule_compiler = require('./simple_rule_compiler.js');

var _simple_rule_compiler2 = _interopRequireDefault(_simple_rule_compiler);

var _rule_table_compiler = require('./rule_table_compiler.js');

var _rule_table_compiler2 = _interopRequireDefault(_rule_table_compiler);

var _state_table_compiler = require('./state_table_compiler.js');

var _state_table_compiler2 = _interopRequireDefault(_state_table_compiler);

var _first_table_compiler = require('./first_table_compiler.js');

var _first_table_compiler2 = _interopRequireDefault(_first_table_compiler);

var _follow_table_compiler = require('./follow_table_compiler.js');

var _follow_table_compiler2 = _interopRequireDefault(_follow_table_compiler);

var _renderer = require('./renderer.js');

var _renderer2 = _interopRequireDefault(_renderer);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stream = (0, _mergeStream2.default)();

(0, _minimist2.default)(process.argv.slice(2))._.forEach(function (filename) {
  return stream.add(_fs2.default.createReadStream(filename));
});

stream.pipe((0, _scanner2.default)()).pipe((0, _parser2.default)()).pipe((0, _complex_rule_compiler2.default)()).pipe((0, _simple_rule_compiler2.default)()).pipe((0, _first_table_compiler2.default)()).pipe((0, _follow_table_compiler2.default)()).pipe((0, _rule_table_compiler2.default)()).pipe((0, _state_table_compiler2.default)()).pipe((0, _index2.default)()).pipe((0, _renderer2.default)()).pipe(_fs2.default.createWriteStream('./parser.es6'));