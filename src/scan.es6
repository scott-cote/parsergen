var Tokenizer = require('tokenizer');

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

let scan = function(reader, processToken) {
  reader.pipe(createTokenizer(processToken));
};

export default scan;
