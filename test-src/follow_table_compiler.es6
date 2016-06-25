import chai from 'chai';

let assert = chai.assert;

import followTableCompiler from '../bin/follow_table_compiler.js';

describe('followTableCompiler', () => {

  describe('generateFirstFor', () => {

    /*

      Rules for Follow Sets

      1. If there is a production A -> aBb, (where "a" can be a whole string) then
        everything in first(b) except for empty is placed in follow(B)

      2. If there is a production A -> aB, then everything in follow(A)
        is in follow(B)

      3. If there is a production A -> aBb where first(b) contains empty then
        everything in follow(A) is in follow(B)

    */

    // ...  
  });
});
