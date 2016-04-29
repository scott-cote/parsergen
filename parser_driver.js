var fs = require('fs');
var Tokenizer = require('tokenizer');
var Parser = require('./parser.js').default;

var keywords = [];

var createTokenizer = function(processToken) {

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

  return tokenizer;
};

var parser = new Parser();

var reader = fs.createReadStream('simple.grammar');

reader.on('end', function() {
  var nodes = parser.end();
  nodes.forEach(node => {
    console.log(node.id+' '+node.type+' '+node.references);
  });
});

reader
  .pipe(createTokenizer(function(token) {
    parser.processToken(token.content, token.type);
  }));
