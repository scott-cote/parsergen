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
    3a. if Y1 dosen't contain empty set then first(Y1 Y2 .. Yk) equals first(Y1)

    */

    let terminalRecord;
    let terminalTable;
    let nonterminalTable;
    let ruleIndex;

    beforeEach(() => {
      terminalTable = {
        '1': { canBeEmpty: false, symbols: new Set(['1']) },
        '2': { canBeEmpty: false, symbols: new Set(['2']) },
        '3': { canBeEmpty: false, symbols: new Set(['3']) }
      };
      nonterminalTable = {
        'A': { canBeEmpty: false, symbols: new Set(['B']) }
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
      ruleIndex = {
        'A': rulesForA,
        'B': rulesForB,
        'C': rulesForC,
        'D': rulesForD
      };
    });

    it('should return cached values', done => {
      firstTableCompiler.testAPI.generateFirstFor('A', terminalTable, nonterminalTable, ruleIndex).then(first => {
        first.symbols = Array.from(first.symbols);
        assert.deepEqual({ canBeEmpty: false, symbols: ['B'] }, first);
        done();
      }).catch(done);
    });

    it('should obey rule 1', done => {
      firstTableCompiler.testAPI.generateFirstFor('1', terminalTable, nonterminalTable, ruleIndex).then(first => {
        first.symbols = Array.from(first.symbols);
        assert.deepEqual({ canBeEmpty: false, symbols: ['1'] }, first);
        done();
      }).catch(done);
    });

    it('should obey rule 2', done => {
      firstTableCompiler.testAPI.generateFirstFor('B', terminalTable, nonterminalTable, ruleIndex).then(first => {
        first.symbols = Array.from(first.symbols);
        assert.deepEqual({ canBeEmpty: true, symbols: [] }, first);
        done();
      }).catch(done);
    });

    it('should obey rule 3a', done => {
      firstTableCompiler.testAPI.generateFirstFor('C', terminalTable, nonterminalTable, ruleIndex).then(first => {
        first.symbols = Array.from(first.symbols);
        assert.deepEqual({ canBeEmpty: false, symbols: ['1','2'] }, first);
        done();
      }).catch(done);
    });
  });

  /*

  //  { canBeEmpty: false, symbols: new Set([symbol]) }

  describe('generateTerminalEntries', () => {

    it('should return and empty table when passed and empty terminals set', () => {
      let terminals = new Set();
      let table = firstTableCompiler.testAPI.generateTerminalEntries(terminals);
      assert.equal(0, Object.keys(table).length);
    });

    it('should return a table with one key for each terminal', () => {
      let terminals = new Set(['A', 'B', 'C', 'D']);
      let table = firstTableCompiler.testAPI.generateTerminalEntries(terminals);
      assert.lengthOf(Object.keys(table), 4);
    });

    it('should return a proper table', () => {
      let terminals = new Set(['A', 'B', 'C', 'D']);
      let table = firstTableCompiler.testAPI.generateTerminalEntries(terminals);
      assert.lengthOf(Object.keys(table), 4);
      Object.keys(table).forEach(key => {
        assert.equal(true, terminals.has(key));
        assert.deepEqual({ canBeEmpty: false, symbols: [key] }, table[key]);
      });
    });
  });

  describe('getDependencies', () => {

    it('should return an empty set for a rule with a zero length right', () => {
      let rule = { left: 'A', right: [] };
      let dependencies = firstTableCompiler.testAPI.getDependencies(rule);
      assert.equal(0, dependencies.size);
    });

    it('should return a set with one element for each dependency', () => {
      let rule = { left: 'A', right: [
        { symbol: 'B' },
        { symbol: 'C' },
        { symbol: 'D' }
      ]};
      let dependencies = firstTableCompiler.testAPI.getDependencies(rule);
      assert.equal(3, dependencies.size);
      ['B','C','D'].forEach(symbol => {
        assert.equal(true, dependencies.has(symbol));
      });
    });

    it('should not return the rule itself as a dependency', () => {
      let rule = { left: 'A', right: [
        { symbol: 'A' },
        { symbol: 'B' },
        { symbol: 'A' },
        { symbol: 'C' },
        { symbol: 'D' },
        { symbol: 'A' }
      ]};
      let dependencies = firstTableCompiler.testAPI.getDependencies(rule);
      assert.equal(3, dependencies.size);
      ['B','C','D'].forEach(symbol => {
        assert.equal(true, dependencies.has(symbol));
      });
      assert.equal(false, dependencies.has('A'));
    });

  });

  describe('augmentRule', () => {

    it('should agment the rule', () => {
      let rule = { left: 'A', right: [
        { symbol: 'C' },
        { symbol: 'D' },
        { symbol: 'E' }
      ]};
      let augmentedRule = firstTableCompiler.testAPI.augmentRule(rule);
      assert.deepEqual({ orgRule: rule, dependencies: new Set(['C','D','E']) }, augmentedRule);
    });

  });

  describe('compareAugmentedRules', () => {

    it('should return 1 when ruleA depends on ruleB', () => {
      let ruleA = firstTableCompiler.testAPI.augmentRule({ left: 'A', right: [
        { symbol: 'C' },
        { symbol: 'D' },
        { symbol: 'E' },
        { symbol: 'B' }
      ]});
      let ruleB = firstTableCompiler.testAPI.augmentRule({ left: 'B', right: [
        { symbol: 'E' },
        { symbol: 'F' },
        { symbol: 'G' }
      ]});
      let value = firstTableCompiler.testAPI.compareAugmentedRules(ruleA, ruleB);
      assert.equal(1, value);
    });

    it('should return 0 when neither rule depends on the other', () => {
      let ruleA = firstTableCompiler.testAPI.augmentRule({ left: 'A', right: [
        { symbol: 'C' },
        { symbol: 'D' },
        { symbol: 'E' }
      ]});
      let ruleB = firstTableCompiler.testAPI.augmentRule({ left: 'B', right: [
        { symbol: 'E' },
        { symbol: 'F' },
        { symbol: 'G' }
      ]});
      let value = firstTableCompiler.testAPI.compareAugmentedRules(ruleA, ruleB);
      assert.equal(0, value);
    });

    it('should return -1 when ruleB depends on ruleA', () => {
      let ruleA = firstTableCompiler.testAPI.augmentRule({ left: 'A', right: [
        { symbol: 'C' },
        { symbol: 'D' },
        { symbol: 'E' }
      ]});
      let ruleB = firstTableCompiler.testAPI.augmentRule({ left: 'B', right: [
        { symbol: 'E' },
        { symbol: 'F' },
        { symbol: 'G' },
        { symbol: 'A' }
      ]});
      let value = firstTableCompiler.testAPI.compareAugmentedRules(ruleA, ruleB);
      assert.equal(-1, value);
    });

  });

  describe('getSortedRules', () => {

    it('should get the sorted rules', () => {
      let ruleA = { left: 'A', right: [
        { symbol: 'E' },
        { symbol: 'F' },
        { symbol: 'B' }
      ]};
      let ruleB = { left: 'B', right: [
        { symbol: 'E' },
        { symbol: 'F' },
        { symbol: 'C' }
      ]};
      let ruleC = { left: 'C', right: [
        { symbol: 'E' },
        { symbol: 'F' }
      ]};
      let ruleD1 = { left: 'D', right: [
        { symbol: 'E' }
      ]};
      let ruleD2 = { left: 'D', right: [
        { symbol: 'E' },
        { symbol: 'A' }
      ]};
      let rules = firstTableCompiler.testAPI.getSortedRules([ruleA, ruleB, ruleC, ruleD1, ruleD2]);
      assert.deepEqual(['C','B','A','D','D'], rules.map(rule => rule.left));
    });

  });
  */
});
