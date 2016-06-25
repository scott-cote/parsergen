import chai from 'chai';

let assert = chai.assert;

import firstTableCompiler from '../bin/first_table_compiler.js';

describe('firstTableCompiler', () => {

  describe('generateFirstFor', () => {

    /*

    Rules for First Sets

    1. If X is a terminal then first(x) is just X
    2. If there is a production X -> empty set, then add empty set to first(X)
    3. If there is a production X -> Y1 Y2 .. Yk then add first(Y1 Y2 .. Yk) to first(X)
    3a. If Y1 dosen't contain empty set then first(Y1 Y2 .. Yk) equals first(Y1)
    3b. If Y1 does contain empty set then first(Y1 Y2 .. Yk) is everything in first(Y1) except the empty set plus first(Y2 .. Yk)
    3c. If first first(Y1 Y2 .. Yk) all contain empty set then add it to first(Y1 Y2 .. Yk)

    */

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
        'A': { canBeEmpty: false, symbols: ['B'] }
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

    it('should return cached values', done => {
      firstTableCompiler.testAPI.generateFirstFor('A', table, ruleIndex).then(() => {
        assert.deepEqual(table['A'], { canBeEmpty: false, symbols: ['B'] });
        done();
      }).catch(done);
    });

    it('should obey rule 1', done => {
      firstTableCompiler.testAPI.generateFirstFor('1', table, ruleIndex).then(() => {
        assert.deepEqual(table['1'], { canBeEmpty: false, symbols: ['1'] });
        done();
      }).catch(done);
    });

    it('should obey rule 2', done => {
      firstTableCompiler.testAPI.generateFirstFor('B', table, ruleIndex).then(() => {
        assert.deepEqual(table['B'], { canBeEmpty: true, symbols: [] });
        done();
      }).catch(done);
    });

    it('should obey rule 3a', done => {
      firstTableCompiler.testAPI.generateFirstFor('C', table, ruleIndex).then(() => {
        assert.deepEqual(table['C'], { canBeEmpty: false, symbols: ['1','2'] });
        done();
      }).catch(done);
    });

    it('should obey rule 3b', done => {
      firstTableCompiler.testAPI.generateFirstFor('E', table, ruleIndex).then(() => {
        assert.deepEqual(table['E'], { canBeEmpty: false, symbols: ['1','2','3','4'] });
        done();
      }).catch(done);
    });

    it('should obey rule 3c', done => {
      firstTableCompiler.testAPI.generateFirstFor('I', table, ruleIndex).then(() => {
        assert.deepEqual(table['I'], { canBeEmpty: true, symbols: ['1','2','4','5','6'] });
        done();
      }).catch(done);
    });
  });
});
