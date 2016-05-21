import fs from 'fs';
import minimist from 'minimist';
import createMergeStream from 'merge-stream';
import scanner from './scanner.js';
import parser from './parser.js'
import complex_rule_compiler from './complex_rule_compiler.js';
import simple_rule_compiler from './simple_rule_compiler.js';
import rule_table_compiler from './rule_table_compiler.js';
import state_table_compiler from './state_table_compiler.js';
import first_table_compiler from './first_table_compiler.js';
import follow_table_compiler from './follow_table_compiler.js';
import renderer from './renderer.js';
import generator from './index.js';
import through2 from 'through2';

let stream = createMergeStream();

minimist(process.argv.slice(2))._.forEach(filename =>
  stream.add(fs.createReadStream(filename)));

stream
  .pipe(scanner())
  .pipe(parser())
  .pipe(complex_rule_compiler())
  .pipe(simple_rule_compiler())
  .pipe(first_table_compiler())
  .pipe(follow_table_compiler())
  .pipe(rule_table_compiler())
  .pipe(state_table_compiler())
  .pipe(generator())
  .pipe(renderer())
  .pipe(fs.createWriteStream('./parser.es6'));
