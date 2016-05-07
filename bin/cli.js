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

var _compiler = require('./compiler.js');

var _compiler2 = _interopRequireDefault(_compiler);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stream = (0, _mergeStream2.default)();

(0, _minimist2.default)(process.argv.slice(2))._.forEach(function (filename) {
  return stream.add(_fs2.default.createReadStream(filename));
});

var render = function render() {
  return _through2.default.obj(function (chunk, encoding, callback) {
    this.push(JSON.stringify(chunk));
    callback();
  });
};

stream.pipe((0, _scanner2.default)()).pipe(_parser2.default.default()).pipe((0, _compiler2.default)()).pipe((0, _index2.default)()).pipe(_fs2.default.createWriteStream('./parser.js'));