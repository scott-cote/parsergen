import fs from 'fs';
import minimist from 'minimist';
import createMergeStream from 'merge-stream';
import scanner from './scanner.js';
import parser from './parser.js'
import complex_rule_compiler from './complex_rule_compiler.js';
import simple_rule_compiler from './simple_rule_compiler.js';
import rule_table_generator from './rule_table_generator.js';
import generator from './index.js';
import through2 from 'through2';

let stream = createMergeStream();

minimist(process.argv.slice(2))._.forEach(filename =>
  stream.add(fs.createReadStream(filename)));

var noop = function() {
  return through2.obj(function(chunk, encoding, callback) {
      this.push(chunk);
      callback();
  });
};

var state_table_generator = noop;
var renderer = noop;

stream
  .pipe(scanner())
  .pipe(parser())
  .pipe(complex_rule_compiler())
  .pipe(simple_rule_compiler())
  .pipe(rule_table_generator())
  .pipe(state_table_generator())
  .pipe(generator())
  .pipe(renderer())
  .pipe(fs.createWriteStream('./parser.es6'));
