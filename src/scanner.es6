var Tokenizer = require('tokenizer');
var through2 = require('through2');

let createTokenizer = function() {

  let tokenizer = new Tokenizer();

  tokenizer.addRule(/^(\s)+$/, 'TOKEN_WHITESPACE');
  tokenizer.addRule(/^\w+$/, 'TOKEN_IDENTIFIER');
  tokenizer.addRule(/^;$/, 'TOKEN_SEMICOLON');
  tokenizer.addRule(/^->$/, 'TOKEN_ROCKET');
  tokenizer.ignore('TOKEN_WHITESPACE');

  return tokenizer;
};

var scanner = function() {
  return through2.obj(function(chunk, encoding, callback) {
    var self = this;
    var tokenizer = createTokenizer();
    tokenizer.on('token', function(token) { self.push(token) });
    tokenizer.on('finish', function() { callback() });
    tokenizer.end(chunk);
  });
};

export default scanner;
