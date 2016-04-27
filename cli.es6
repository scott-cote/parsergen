import fs from 'fs';
import minimist from 'minimist';
import createMergeStream from 'merge-stream';
import generator from './index.js';

let stream = createMergeStream();

minimist(process.argv.slice(2))._.forEach(filename =>
  stream.add(fs.createReadStream(filename)));

stream.pipe(generator()).pipe(fs.createWriteStream('./output'));
