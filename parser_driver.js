
var fs = require('fs');
var through2 = require('through2');
var scanner = require('./bin/scanner.js').default;
var parser = require('./parser.js').default;
var compiler = require('./bin/compiler.js').default;

fs.createReadStream('simple.grammar')
  .pipe(scanner())
  .pipe(parser())
  .pipe(compiler())
  .pipe(process.stdout);
