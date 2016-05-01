'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Tokenizer = require('tokenizer');

var scanner = function scanner(processToken) {

  var translateToken = function translateToken(token, match) {
    // NOOP for now
  };

  var tokenizer = new Tokenizer(translateToken);

  tokenizer.addRule(/^(\s)+$/, 'TOKEN_WHITESPACE');
  tokenizer.addRule(/^\w+$/, 'TOKEN_IDENTIFIER');
  tokenizer.addRule(/^;$/, 'TOKEN_SEMICOLON');
  tokenizer.addRule(/^->$/, 'TOKEN_ROCKET');

  tokenizer.ignore('TOKEN_WHITESPACE');

  tokenizer.on('token', processToken);

  return tokenizer;
};

exports.default = scanner;