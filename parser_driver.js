
var fs = require('fs');
var through2 = require('through2')
var scanner = require('./bin/scanner.js').default;

var arr = [];

var par = through2.obj(function(chunk, encoding, callback) {
  arr.push(chunk);
  callback();
}, function(callback) {
  this.push(arr);
  callback();
});

var comp = through2.obj(function(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk)+'\n')
    callback()
})

var reader = fs.createReadStream('simple.grammar');

reader.pipe(scanner()).pipe(par).pipe(comp).pipe(process.stdout)
