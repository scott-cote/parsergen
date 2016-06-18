"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var compiler = function compiler() {

  var compile = function compile(code) {
    code.ruleTable = code.rules.map(function (rule) {
      return { left: rule.left, rightCount: rule.right.length };
    });
    return code;
  };

  return thru.obj(function (code, encoding, done) {
    this.push(compile(code));
    done();
  });
};

exports.default = compiler;