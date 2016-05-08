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

var _rule_table_generator = require('./rule_table_generator.js');

var _rule_table_generator2 = _interopRequireDefault(_rule_table_generator);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stream = (0, _mergeStream2.default)();

(0, _minimist2.default)(process.argv.slice(2))._.forEach(function (filename) {
  return stream.add(_fs2.default.createReadStream(filename));
});

var noop = function noop() {
  return _through2.default.obj(function (chunk, encoding, callback) {
    this.push(chunk);
    callback();
  });
};

var state_table_generator = noop;
var renderer = noop;

stream.pipe((0, _scanner2.default)()).pipe((0, _parser2.default)()).pipe((0, _complex_rule_compiler2.default)()).pipe((0, _simple_rule_compiler2.default)()).pipe((0, _rule_table_generator2.default)()).pipe(state_table_generator()).pipe((0, _index2.default)()).pipe(renderer()).pipe(_fs2.default.createWriteStream('./parser.es6'));