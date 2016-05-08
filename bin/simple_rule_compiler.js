'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compiler = function compiler() {
  // NOOP for now
  return _through2.default.obj(function (chunk, encoding, done) {
    this.push(chunk);
    done();
  });
};

exports.default = compiler;