import fs from 'fs';
import minimist from 'minimist';
import createMergeStream from 'merge-stream';
import scanner from './scanner.js';
import parser from './parser.js'
import compiler from './compiler.js';
import generator from './index.js';
import through2 from 'through2';

let stream = createMergeStream();

minimist(process.argv.slice(2))._.forEach(filename =>
  stream.add(fs.createReadStream(filename)));

var render = function() {
  return through2.obj(function(chunk, encoding, callback) {
      this.push(JSON.stringify(chunk));
      callback();
  });
};

stream
  .pipe(scanner())
  .pipe(parser.default())
  .pipe(compiler())
  .pipe(generator())
  .pipe(render())
  .pipe(fs.createWriteStream('./parser.js'));
