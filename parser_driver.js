var fs = require('fs');
var Parser = require('./parser.js').default;
var scanner = require('./bin/scanner.js').default;
var compile = require('./bin/compile.js').default;

var parser = new Parser();

var reader = fs.createReadStream('simple.grammar');

reader.on('end', function() {
  var nodes = parser.end();
  var rules = compile(nodes);
  console.log(JSON.stringify(rules))
});

reader.pipe(scanner(function(token) {
  parser.processToken(token.content, token.type);
}));
