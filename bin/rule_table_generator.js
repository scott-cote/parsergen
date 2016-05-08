'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generator = function generator() {

  var generate = function generate(code) {
    return code;
  };

  return _through2.default.obj(function (code, encoding, done) {
    this.push(generate(code));
    done();
  });
};

exports.default = generator;