import thru from 'through2';

let generateTerminalEntries = function(terminals) {
  return Array.from(terminals.keys()).reduce((table, symbol) => {
    table[symbol] = { canBeEmpty: false, symbols: [symbol] };
    return table;
  }, {});
};

let getDependencies = function(rule) {
  return new Set(rule.right
    .filter(element => element.symbol !== rule.left)
    .map(element => element.symbol));
};

let compareAugmentedRules = function(ruleA, ruleB) {
  if (ruleA.dependencies.has(ruleB.orgRule.left)) {
    return -1;
  }
  if (ruleB.dependencies.has(ruleA.orgRule.left)) {
    return 1;
  }
  return 0;
};

let getSortedRules = function(rules) {
  return rules
    .map(rule => { return { orgRule: rule, dependencies: getDependencies(rule) }})
    .sort(compareAugmentedRules)
    .map(rule => rule.orgRule);
};

/*
let checkDependencies = function(symbol, terminalTable, nonterminalTable, rules) {
  return rules.filter(rule => rule.left === symbol).reduce((ready, rule) => {
    if (!ready) return false;
    return rule.right.reduce((ready, element) => {
      if (!ready) return false;
      if (element.symbol === symbol) return true;
      return !!(terminalTable[element.symbol]||nonterminalTable[element.symbol]);
    }, true);
  }, true);
};

let canRuleBeEmpty = function(rule) {
  return -1 === rule.right.findIndex(element => { return !element.canBeEmpty; });
};

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

let generateNonterminalEntries = function(terminalTable, options) {

  let nonterminalTable = {};
  let symbols = Array.from(options.nonterminals.keys()).reverse();

  while (symbols.length) {
    symbols = symbols.reduce((nextPass, symbol) => {
      if (checkDependencies(symbol, terminalTable, nonterminalTable, options.rules)) {
        nonterminalTable[symbol] = generateNonterminalEntry(symbol,
          terminalTable, nonterminalTable, options.rules);
      } else {
        nextPass.push(symbol);
      }
      return nextPass;
    }, []);
  }

  return nonterminalTable;
};

let generateFirstTable = function(options) {
  let terminalTable = generateTerminalEntries(options.terminals);
  let nonterminalTable = generateNonterminalEntries(terminalTable, options);
  return Object.assign({}, terminalTable, nonterminalTable);
};
*/
let compiler = function() {
  return thru.obj(function(code, encoding, done) {
    //code.firstTable = generateFirstTable(code);
    this.push(code);
    done();
  });
};

compiler.testAPI = {
  generateTerminalEntries,
  getDependencies
};

export default compiler;
