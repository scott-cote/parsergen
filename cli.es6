import fs from 'fs';
import generator from './index.js';

let writeStream = fs.createWriteStream('./output');

fs.createReadStream('./simple.grammar')
  .pipe(generator())
  .pipe(writeStream);
