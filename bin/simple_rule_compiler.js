'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compiler = function compiler() {
  return _through2.default.obj(function (code, encoding, done) {
    code.rules = code.complexRules.slice();
    this.push(code);
    done();
  });
};

exports.default = compiler;