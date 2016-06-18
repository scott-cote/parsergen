"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var compiler = function compiler() {
  return thru.obj(function (code, encoding, done) {
    this.push(code);
    done();
  });
};

exports.default = compiler;