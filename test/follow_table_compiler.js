'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _follow_table_compiler = require('../bin/follow_table_compiler.js');

var _follow_table_compiler2 = _interopRequireDefault(_follow_table_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = _chai2.default.assert;

describe('followTableCompiler', function () {

  describe('generateFollowFor', function () {

    /*
       Rules for Follow Sets
       1. If there is a production A -> aBb, (where "a" can be a whole string) then
        everything in first(b) except for empty is placed in follow(B)
       2. If there is a production A -> aB, then everything in follow(A)
        is in follow(B)
       3. If there is a production A -> aBb where first(b) contains empty then
        everything in follow(A) is in follow(B)
     */

    /*
    let terminalRecord;
    let table;
    let ruleIndex;
     beforeEach(() => {
      table = {
        '1': { canBeEmpty: false, symbols: ['1'] },
        '2': { canBeEmpty: false, symbols: ['2'] },
        '3': { canBeEmpty: false, symbols: ['3'] },
        '4': { canBeEmpty: false, symbols: ['4'] },
        '5': { canBeEmpty: false, symbols: ['5'] },
        '6': { canBeEmpty: false, symbols: ['6'] },
        'A': { canBeEmpty: false, symbols: ['B'] },
        'JUNK': 'VALUE'
      };
      let rulesForA = [
        { left: 'A', right: [{ type: 'NONTERMINAL', symbol: 'B' }] }
      ];
      let rulesForB = [
        { left: 'B', right: [] }
      ];
      let rulesForC = [
        { left: 'C', right: [ { type: 'NONTERMINAL', symbol: 'D'}, { type: 'TERMINAL', symbol: '3' } ] }
      ];
      let rulesForD = [
        { left: 'D', right: [ { type: 'TERMINAL', symbol: '1' } ] },
        { left: 'D', right: [ { type: 'TERMINAL', symbol: '2' } ] }
      ];
      let rulesForE = [
        { left: 'E', right: [
          { type: 'NONTERMINAL', symbol: 'F' },
          { type: 'NONTERMINAL', symbol: 'G' },
          { type: 'NONTERMINAL', symbol: 'H' }
        ] }
      ];
      let rulesForF = [
        { left: 'F', right: [ { type: 'TERMINAL', symbol: '1' } ] },
        { left: 'F', right: [ { type: 'TERMINAL', symbol: '2' } ] },
        { left: 'F', right: [] }
      ];
      let rulesForG = [
        { left: 'G', right: [ { type: 'TERMINAL', symbol: '3' } ] },
        { left: 'G', right: [ { type: 'TERMINAL', symbol: '4' } ] }
      ];
      let rulesForH = [
        { left: 'H', right: [ { type: 'TERMINAL', symbol: '5' } ] },
        { left: 'H', right: [ { type: 'TERMINAL', symbol: '6' } ] }
      ];
      let rulesForI = [
        { left: 'I', right: [
          { type: 'NONTERMINAL', symbol: 'J' },
          { type: 'NONTERMINAL', symbol: 'K' },
          { type: 'NONTERMINAL', symbol: 'L' }
        ]},
        { left: 'I', right: [
          { type: 'NONTERMINAL', symbol: 'M' },
          { type: 'NONTERMINAL', symbol: 'N' },
          { type: 'NONTERMINAL', symbol: 'O' }
        ]}
      ];
      let rulesForJ = [
        { left: 'J', right: [ { type: 'TERMINAL', symbol: '1' } ] },
        { left: 'J', right: [ ] }
      ];
      let rulesForK = [
        { left: 'K', right: [ { type: 'TERMINAL', symbol: '2' } ] }
      ];
      let rulesForL = [
        { left: 'L', right: [ { type: 'TERMINAL', symbol: '3' } ] },
        { left: 'L', right: [ ] }
      ];
      let rulesForM = [
        { left: 'M', right: [ { type: 'TERMINAL', symbol: '4' } ] },
        { left: 'M', right: [ ] }
      ];
      let rulesForN = [
        { left: 'N', right: [ { type: 'TERMINAL', symbol: '5' } ] },
        { left: 'N', right: [ ] }
      ];
      let rulesForO = [
        { left: 'O', right: [ { type: 'TERMINAL', symbol: '6' } ] },
        { left: 'O', right: [ ] }
      ];
      ruleIndex = followTableCompiler.testAPI.generateRuleIndex([].concat(rulesForC));
    });
    */

    it('should return cached values', function (done) {
      var followTable = { 'A': ['a', 'b', 'c'] };
      var firstTable = {};
      var ruleIndex = {};
      _follow_table_compiler2.default.testAPI.generateFollowFor('A', followTable, firstTable, ruleIndex).then(function () {
        assert.deepEqual(followTable['A'], ['a', 'b', 'c']);
        done();
      }).catch(done);
    });

    it('should obey rule 1', function (done) {
      var followTable = {};
      var firstTable = {};
      var ruleIndex = { B: [{ left: 'A', right: [{ type: 'TERMINAL', symbol: 'a' }, { type: 'NONTERMINAL', symbol: 'B' }, { type: 'TERMINAL', symbol: 'b' }] }] };
      _follow_table_compiler2.default.testAPI.generateFollowFor('B', followTable, firstTable, ruleIndex).then(function () {
        assert.deepEqual(followTable['B'], ['b']);
        done();
      }).catch(done);
    });
  });
});