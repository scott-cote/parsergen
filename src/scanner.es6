var Tokenizer = require('tokenizer');
var through2 = require('through2');

let createTokenizer = function(processToken) {

  let translateToken = function(token, match) {
    // NOOP for now
  };

  let tokenizer = new Tokenizer(translateToken);

  tokenizer.addRule(/^(\s)+$/, 'TOKEN_WHITESPACE');
  tokenizer.addRule(/^\w+$/, 'TOKEN_IDENTIFIER');
  tokenizer.addRule(/^;$/, 'TOKEN_SEMICOLON');
  tokenizer.addRule(/^->$/, 'TOKEN_ROCKET');

  tokenizer.ignore('TOKEN_WHITESPACE');

  tokenizer.on('token', processToken);

  return tokenizer;
};

var scanner = function() {
  return through2.obj(function(chunk, encoding, callback) {
    var self = this;
    var ss = createTokenizer(function(token) {
      self.push(token);
    });
    ss.on('finish', function() { callback() });
    ss.end(chunk);
  });
};

export default scanner;
