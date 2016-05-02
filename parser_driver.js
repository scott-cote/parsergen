
var fs = require('fs');
var through2 = require('through2')
var scanner = require('./bin/scanner.js').default;
var parser = require('./parser.js').default;

var comp = through2.obj(function(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk)+'\n')
    callback()
})

var reader = fs.createReadStream('simple.grammar');

reader.pipe(scanner()).pipe(parser()).pipe(comp).pipe(process.stdout)
