'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _follow_table_compiler = require('../bin/follow_table_compiler.js');

var _follow_table_compiler2 = _interopRequireDefault(_follow_table_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = _chai2.default.assert;

describe('followTableCompiler', function () {

  describe('generateFirstFor', function () {

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