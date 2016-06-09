import thru from 'through2';

let generateTerminalEntries = function(terminals) {
  return Array.from(terminals.keys()).reduce((table, symbol) => {
    table[symbol] = { canBeEmpty: false, symbols: new Set([symbol]) };
    return table;
  }, {});
};

let getDependencies = function(rule) {
  return new Set(rule.right
    .filter(element => element.symbol !== rule.left)
    .map(element => element.symbol));
};

let augmentRule = function(rule) {
  return { orgRule: rule, dependencies: getDependencies(rule) };
};

let compareAugmentedRules = function(ruleA, ruleB) {
  if (ruleA.dependencies.has(ruleB.orgRule.left)) {
    return 1;
  }
  if (ruleB.dependencies.has(ruleA.orgRule.left)) {
    return -1;
  }
  return 0;
};

let getSortedRules = function(rules) {
  return rules.map(augmentRule).reduce((augmentedRules, rule) => {
    augmentedRules.unshift(rule);
    return augmentedRules.sort(compareAugmentedRules);
  }, []).map(rule => rule.orgRule);
};

/*
let canRuleBeEmpty = function(rule) {
  // this is wrong ... canBeEmpty is part of the table
  return -1 === rule.right.findIndex(element => { return !element.canBeEmpty });
};
*/

/*
let generateNonterminalSymbols = function(symbol, rule, terminalTable, nonterminalTable) {
  return rule.right.reduce((cntx, element) => {
    if (cntx.done || element.symbol === symbol) return cntx;
    cntx.done = !element.canBeEmpty;
    let expandedSymbols = terminalTable[element.symbol] || nonterminalTable[element.symbol];
    cntx.symbols = cntx.symbols.concat(expandedSymbols);
    return cntx;
  }, { done: false, symbols: [] }).symbols;
};

let generateNonterminalEntry = function(terminalTable, nonterminalTable, rules) {
  return rules.reduce((cntx, rule) => {
    cntx.canBeEmpty = cntx.canBeEmpty || canRuleBeEmpty(rule);
    cntx.symbols = cntx.symbols.concat(generateNonterminalSymbols(rule));
    return cntx;
  }, { canBeEmpty: false, symbols: [] });
};

*/

/*
let generateNonterminalEntries = function(terminalTable, options) {
  return getSortedRules(options.rules).reduce((nonterminalTable, rule) => {
    let record = nonterminalTable[rule.left] || { canBeEmpty: false, symbols: new Set() };
    record.canBeEmpty = record.canBeEmpty || rule.left.length === 0;
    record.symbols = new Set([...record.symbols, ...getFirstForRule(rule, nonterminalTable)]);
    nonterminalTable[rule.left] = record;
  }, {});
};
*/

let generateFirstFor = function(symbol, rules) {
  return Promise.resolve();
};

let generateNonterminalEntries = function(terminalTable, options) {
  let ruleIndex = options.rules.reduce((ruleIndex, rule) => {
    let rules = ruleIndex[rule.left] || [];
    rules.push(rule);
    ruleIndex[rule.left] = rules;
    return ruleIndex;
  }, {});
  let result = Promise.resolve();
  Object.keys(ruleIndex).forEach(symbol => {
    result = result.then(() => generateFirstFor(symbol, ruleIndex[symbol]));
  });
  return result;
};

let generateFirstTable = function(options) {
  let terminalTable = generateTerminalEntries(options.terminals);
  return generateNonterminalEntries(terminalTable, options).then((nonterminalTable) => {
    return Object.assign({}, terminalTable, nonterminalTable);
  });
};

let compiler = function() {
  return thru.obj(function(code, encoding, done) {
    generateFirstTable(code).then(firstTable => {
      console.log(JSON.stringify(firstTable))
      code.firstTable = firstTable;
      this.push(code);
      done();
    });
  });
};

compiler.testAPI = {
  generateTerminalEntries,
  getDependencies,
  augmentRule,
  compareAugmentedRules,
  getSortedRules
};

export default compiler;
