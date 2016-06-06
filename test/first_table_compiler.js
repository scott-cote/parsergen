'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _first_table_compiler = require('../bin/first_table_compiler.js');

var _first_table_compiler2 = _interopRequireDefault(_first_table_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = _chai2.default.assert;

describe('firstTableCompiler', function () {

  describe('generateTerminalEntries', function () {

    it('should return and empty table when passed and empty terminals set', function () {
      var terminals = new Set();
      var table = _first_table_compiler2.default.testAPI.generateTerminalEntries(terminals);
      assert.equal(0, Object.keys(table).length);
    });

    it('should return a table with one key for each terminal', function () {
      var terminals = new Set(['A', 'B', 'C', 'D']);
      var table = _first_table_compiler2.default.testAPI.generateTerminalEntries(terminals);
      assert.lengthOf(Object.keys(table), 4);
    });

    it('should return a proper table', function () {
      var terminals = new Set(['A', 'B', 'C', 'D']);
      var table = _first_table_compiler2.default.testAPI.generateTerminalEntries(terminals);
      assert.lengthOf(Object.keys(table), 4);
      Object.keys(table).forEach(function (key) {
        assert.equal(true, terminals.has(key));
        assert.deepEqual({ canBeEmpty: false, symbols: [key] }, table[key]);
      });
    });
  });

  describe('getDependencies', function () {

    it('should return an empty set for a rule with a zero length right', function () {
      var rule = { left: 'A', right: [] };
      var dependencies = _first_table_compiler2.default.testAPI.getDependencies(rule);
      assert.equal(0, dependencies.size);
    });

    it('should return a set with one element for each dependency', function () {
      var rule = { left: 'A', right: [{ symbol: 'B' }, { symbol: 'C' }, { symbol: 'D' }] };
      var dependencies = _first_table_compiler2.default.testAPI.getDependencies(rule);
      assert.equal(3, dependencies.size);
      ['B', 'C', 'D'].forEach(function (symbol) {
        assert.equal(true, dependencies.has(symbol));
      });
    });

    it('should not return the rule itself as a dependency', function () {
      var rule = { left: 'A', right: [{ symbol: 'A' }, { symbol: 'B' }, { symbol: 'A' }, { symbol: 'C' }, { symbol: 'D' }, { symbol: 'A' }] };
      var dependencies = _first_table_compiler2.default.testAPI.getDependencies(rule);
      assert.equal(3, dependencies.size);
      ['B', 'C', 'D'].forEach(function (symbol) {
        assert.equal(true, dependencies.has(symbol));
      });
      assert.equal(false, dependencies.has('A'));
    });
  });

  describe('compareAugmentedRules', function () {});
});