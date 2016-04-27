#!/usr/bin/env node

'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _mergeStream = require('merge-stream');

var _mergeStream2 = _interopRequireDefault(_mergeStream);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stream = (0, _mergeStream2.default)();

(0, _minimist2.default)(process.argv.slice(2))._.forEach(function (filename) {
  return stream.add(_fs2.default.createReadStream(filename));
});

stream.pipe((0, _index2.default)()).pipe(_fs2.default.createWriteStream('./output'));