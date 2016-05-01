var fs = require('fs');
var Parser = require('./parser.js').default;
var scan = require('./bin/scan.js').default;
var compile = require('./bin/compile.js').default;

var parser = new Parser();

var reader = fs.createReadStream('simple.grammar');

reader.on('end', function() {
  var nodes = parser.end();
  var rules = compile(nodes);
  console.log(JSON.stringify(rules))
});

scan(reader, function(token) {
  parser.processToken(token.content, token.type);
});
