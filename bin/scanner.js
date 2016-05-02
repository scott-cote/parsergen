'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Tokenizer = require('tokenizer');
var through2 = require('through2');

var createTokenizer = function createTokenizer() {

  var tokenizer = new Tokenizer();

  tokenizer.addRule(/^(\s)+$/, 'TOKEN_WHITESPACE');
  tokenizer.addRule(/^\w+$/, 'TOKEN_IDENTIFIER');
  tokenizer.addRule(/^;$/, 'TOKEN_SEMICOLON');
  tokenizer.addRule(/^->$/, 'TOKEN_ROCKET');
  tokenizer.ignore('TOKEN_WHITESPACE');

  return tokenizer;
};

var scanner = function scanner() {
  return through2.obj(function (chunk, encoding, callback) {
    var self = this;
    var tokenizer = createTokenizer();
    tokenizer.on('token', function (token) {
      self.push(token);
    });
    tokenizer.on('finish', function () {
      callback();
    });
    tokenizer.end(chunk);
  });
};

exports.default = scanner;