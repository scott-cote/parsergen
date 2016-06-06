import chai from 'chai';

let assert = chai.assert;

import firstTableCompiler from '../bin/first_table_compiler.js';

describe('firstTableCompiler', () => {

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

  describe('compareAugmentedRules', () => {

  });

});
