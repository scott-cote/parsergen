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

    var terminalRecord = void 0;
    var table = void 0;
    var ruleIndex = void 0;

    beforeEach(function () {
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
      var rulesForA = [{ left: 'A', right: [{ type: 'NONTERMINAL', symbol: 'B' }] }];
      var rulesForB = [{ left: 'B', right: [] }];
      var rulesForC = [{ left: 'C', right: [{ type: 'NONTERMINAL', symbol: 'D' }, { type: 'TERMINAL', symbol: '3' }] }];
      var rulesForD = [{ left: 'D', right: [{ type: 'TERMINAL', symbol: '1' }] }, { left: 'D', right: [{ type: 'TERMINAL', symbol: '2' }] }];
      var rulesForE = [{ left: 'E', right: [{ type: 'NONTERMINAL', symbol: 'F' }, { type: 'NONTERMINAL', symbol: 'G' }, { type: 'NONTERMINAL', symbol: 'H' }] }];
      var rulesForF = [{ left: 'F', right: [{ type: 'TERMINAL', symbol: '1' }] }, { left: 'F', right: [{ type: 'TERMINAL', symbol: '2' }] }, { left: 'F', right: [] }];
      var rulesForG = [{ left: 'G', right: [{ type: 'TERMINAL', symbol: '3' }] }, { left: 'G', right: [{ type: 'TERMINAL', symbol: '4' }] }];
      var rulesForH = [{ left: 'H', right: [{ type: 'TERMINAL', symbol: '5' }] }, { left: 'H', right: [{ type: 'TERMINAL', symbol: '6' }] }];
      var rulesForI = [{ left: 'I', right: [{ type: 'NONTERMINAL', symbol: 'J' }, { type: 'NONTERMINAL', symbol: 'K' }, { type: 'NONTERMINAL', symbol: 'L' }] }, { left: 'I', right: [{ type: 'NONTERMINAL', symbol: 'M' }, { type: 'NONTERMINAL', symbol: 'N' }, { type: 'NONTERMINAL', symbol: 'O' }] }];
      var rulesForJ = [{ left: 'J', right: [{ type: 'TERMINAL', symbol: '1' }] }, { left: 'J', right: [] }];
      var rulesForK = [{ left: 'K', right: [{ type: 'TERMINAL', symbol: '2' }] }];
      var rulesForL = [{ left: 'L', right: [{ type: 'TERMINAL', symbol: '3' }] }, { left: 'L', right: [] }];
      var rulesForM = [{ left: 'M', right: [{ type: 'TERMINAL', symbol: '4' }] }, { left: 'M', right: [] }];
      var rulesForN = [{ left: 'N', right: [{ type: 'TERMINAL', symbol: '5' }] }, { left: 'N', right: [] }];
      var rulesForO = [{ left: 'O', right: [{ type: 'TERMINAL', symbol: '6' }] }, { left: 'O', right: [] }];
      ruleIndex = {
        'A': rulesForA,
        'B': rulesForB,
        'C': rulesForC,
        'D': rulesForD,
        'E': rulesForE,
        'F': rulesForF,
        'G': rulesForG,
        'H': rulesForH,
        'I': rulesForI,
        'J': rulesForJ,
        'K': rulesForK,
        'L': rulesForL,
        'M': rulesForM,
        'N': rulesForN,
        'O': rulesForO
      };
    });

    it('should return cached values', function (done) {
      _follow_table_compiler2.default.testAPI.generateFollowFor('A', table, ruleIndex).then(function () {
        assert.deepEqual(table['JUNK'], 'VALUE');
        done();
      }).catch(done);
    });
  });
});