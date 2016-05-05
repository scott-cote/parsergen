
var fs = require('fs');
var through2 = require('through2');
var scanner = require('./bin/scanner.js').default;
var parser = require('./parser.js').default;
var compiler = require('./bin/compiler.js').default;

var render = function() {
  return through2.obj(function(chunk, encoding, callback) {
      this.push(JSON.stringify(chunk));
      callback();
  });
};

fs.createReadStream('simple.grammar')
  .pipe(scanner())
  .pipe(parser())
  .pipe(compiler())
  .pipe(render())
  .pipe(process.stdout);
