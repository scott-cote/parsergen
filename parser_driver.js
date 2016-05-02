/*
var fs = require('fs');
var thru = require('through2');
var Parser = require('./parser.js').default;
var scanner = require('./bin/scanner.js').default;
var compile = require('./bin/compile.js').default;

var parser = new Parser();

var reader = fs.createReadStream('simple.grammar');
*/
/*
reader.on('end', function() {
  var nodes = parser.end();
  var rules = compile(nodes);
  console.log(JSON.stringify(rules))
});

reader.pipe(scanner(function(token) {
  parser.processToken(token.content, token.type);
}));
*/

var fs = require('fs');
var through2 = require('through2')
var scanner = require('./bin/scanner.js').default;

var arr = [];

var parser = through2.obj(function(chunk, encoding, callback) {
  arr.push(chunk);
  callback();
}, function(callback) {
  this.push(arr);
  callback();
});

var compiler = through2.obj(function(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk)+'\n')
    callback()
})

var reader = fs.createReadStream('simple.grammar');

reader.pipe(scanner()).pipe(parser).pipe(compiler).pipe(process.stdout)



//objectStream.write({ status: 404, message: 'Not found' })
//objectStream.write({ status: 500, message: 'Internal server error'})
