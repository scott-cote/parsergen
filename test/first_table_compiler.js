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

  describe('augmentRule', function () {

    it('should agment the rule', function () {
      var rule = { left: 'A', right: [{ symbol: 'C' }, { symbol: 'D' }, { symbol: 'E' }] };
      var augmentedRule = _first_table_compiler2.default.testAPI.augmentRule(rule);
      assert.deepEqual({ orgRule: rule, dependencies: new Set(['C', 'D', 'E']) }, augmentedRule);
    });
  });

  describe('compareAugmentedRules', function () {

    it('should return 1 when ruleA depends on ruleB', function () {
      var ruleA = _first_table_compiler2.default.testAPI.augmentRule({ left: 'A', right: [{ symbol: 'C' }, { symbol: 'D' }, { symbol: 'E' }, { symbol: 'B' }] });
      var ruleB = _first_table_compiler2.default.testAPI.augmentRule({ left: 'B', right: [{ symbol: 'E' }, { symbol: 'F' }, { symbol: 'G' }] });
      var value = _first_table_compiler2.default.testAPI.compareAugmentedRules(ruleA, ruleB);
      assert.equal(1, value);
    });

    it('should return 0 when neither rule depends on the other', function () {
      var ruleA = _first_table_compiler2.default.testAPI.augmentRule({ left: 'A', right: [{ symbol: 'C' }, { symbol: 'D' }, { symbol: 'E' }] });
      var ruleB = _first_table_compiler2.default.testAPI.augmentRule({ left: 'B', right: [{ symbol: 'E' }, { symbol: 'F' }, { symbol: 'G' }] });
      var value = _first_table_compiler2.default.testAPI.compareAugmentedRules(ruleA, ruleB);
      assert.equal(0, value);
    });

    it('should return -1 when ruleB depends on ruleA', function () {
      var ruleA = _first_table_compiler2.default.testAPI.augmentRule({ left: 'A', right: [{ symbol: 'C' }, { symbol: 'D' }, { symbol: 'E' }] });
      var ruleB = _first_table_compiler2.default.testAPI.augmentRule({ left: 'B', right: [{ symbol: 'E' }, { symbol: 'F' }, { symbol: 'G' }, { symbol: 'A' }] });
      var value = _first_table_compiler2.default.testAPI.compareAugmentedRules(ruleA, ruleB);
      assert.equal(-1, value);
    });
  });

  describe('getSortedRules', function () {

    it('should get the sorted rules', function () {
      var ruleA = { left: 'A', right: [{ symbol: 'D' }, { symbol: 'E' }, { symbol: 'B' }] };
      var ruleB = { left: 'B', right: [{ symbol: 'D' }, { symbol: 'E' }, { symbol: 'C' }] };
      var ruleC = { left: 'C', right: [{ symbol: 'D' }, { symbol: 'E' }] };
      var rules = _first_table_compiler2.default.testAPI.getSortedRules([ruleA, ruleB, ruleC]);
      assert.deepEqual(['C', 'B', 'A'], rules.map(function (rule) {
        return rule.left;
      }));
    });
  });
});