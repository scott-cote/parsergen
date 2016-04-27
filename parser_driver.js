var fs = require('fs');
var Tokenizer = require('tokenizer');
var Parser = require('./parser.js').default;

var keywords = [];

var createTokenizer = function(processToken, end) {

  var translateToken = function(token, match) {
    if (match.type === 'TOKEN_IDENTIFIER' &&
        keywords.find(keyword => keyword === token.toUpperCase())) {
      return 'TOKEN_KEYWORD_'+token.toUpperCase();
    }
  };

  var tokenizer = new Tokenizer(translateToken);

  tokenizer.addRule(/^(\s)+$/, 'TOKEN_WHITESPACE');
  tokenizer.addRule(/^\w+$/, 'TOKEN_IDENTIFIER');
  tokenizer.addRule(/^;$/, 'TOKEN_SEMICOLON');
  tokenizer.addRule(/^->$/, 'TOKEN_ROCKET');

  tokenizer.ignore('TOKEN_WHITESPACE');

  tokenizer.on('token', processToken);
  tokenizer.on('end', end);

  return tokenizer;
};

var parser = new Parser();

fs.createReadStream('simple.grammar')
  .pipe(createTokenizer(function(token, type) {
    parser.processToken(token, type);
  }, function() {
    var ast = parser.end();
  }));
