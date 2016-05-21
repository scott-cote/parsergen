'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compiler = function compiler() {

  var compile = function compile(code) {
    code.ruleTable = code.rules.map(function (rule) {
      return { left: rule.left, rightCount: rule.right.length };
    });
    return code;
  };

  return _through2.default.obj(function (code, encoding, done) {
    this.push(compile(code));
    done();
  });
};

exports.default = compiler;