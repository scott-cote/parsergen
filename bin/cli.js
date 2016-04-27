#!/usr/bin/env node

'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writeStream = _fs2.default.createWriteStream('./output');

_fs2.default.createReadStream('./simple.grammar').pipe((0, _index2.default)()).pipe(writeStream);