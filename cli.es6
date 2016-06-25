import fs from 'fs';
import minimist from 'minimist';
import createMergeStream from 'merge-stream';
import scanner from './scanner.js';
import parser from './parser.js'
import complex_rule_compiler from './complex_rule_compiler.js';
import simple_rule_compiler from './simple_rule_compiler.js';
import rule_table_compiler from './rule_table_compiler.js';
//import state_table_compiler from './state_table_compiler.js';
import first_table_compiler from './first_table_compiler.js';
import follow_table_compiler from './follow_table_compiler.js';
import renderer from './renderer.js';
import generator from './index.js';

let stream = createMergeStream();

minimist(process.argv.slice(2))._.forEach(filename =>
  stream.add(fs.createReadStream(filename)));

let error = err => {
  console.log(err.toString());
  throw err;
};

stream
  .on('error', error)
  .pipe(scanner())
  .on('error', error)
  .pipe(parser())
  .on('error', error)
  .pipe(complex_rule_compiler())
  .on('error', error)
  .pipe(simple_rule_compiler())
  .on('error', error)
  .pipe(first_table_compiler())
  .on('error', error)
  .pipe(follow_table_compiler())
  .on('error', error)
  .pipe(rule_table_compiler())
  .on('error', error)
  //.pipe(state_table_compiler())
  //.on('error', error)
  .pipe(generator())
  .on('error', error)
  .pipe(renderer())
  .on('error', error)
  .pipe(fs.createWriteStream('./parser.es6'))
  .on('error', error);
