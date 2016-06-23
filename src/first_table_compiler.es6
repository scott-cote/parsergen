import Stream from 'stream';
import asyncReduce from 'async-reduce';

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

let generateFirstFor = function(symbol, table, ruleIndex) {

  let reduceRule = function(cntx, rule, done) {

    //console.log('reduceRule '+rule.left);

    let reduceSymbol = function(cntx, symbol, done) {

      //console.log('reduceSymbol '+symbol);

      if (!cntx.canBeEmpty) done(null, cntx);
      generateFirstFor(symbol, table, ruleIndex).then(() => {
          //console.log('Got results for '+symbol);
          let first = table[symbol];
          cntx.symbols = cntx.symbols.concat(first.symbols);
          if (!first.canBeEmpty) cntx.canBeEmpty = false;
          done(null, cntx);
        }).catch(done);
    };

    let collectResults = function(err, results) {
      if (err) return done(err);
      cntx.canBeEmpty = cntx.canBeEmpty || results.canBeEmpty;
      cntx.symbols = cntx.symbols.concat(results.symbols);
      done(null, cntx);
    };

    asyncReduce(rule.right.map(element => element.symbol).filter(symbol => symbol != rule.left),
      { canBeEmpty: true, symbols: [] }, reduceSymbol, collectResults);
  };

  return new Promise((resolve, reject) => {
    if (!!table[symbol]) {
      //console.log('skipping, '+symbol+' already generated');
      return resolve();
    }
    let collectResults = function(err, result) {
      if (err) return reject(err);
      table[symbol] = result;
      //console.log(symbol+' = '+JSON.stringify(table[symbol]));
      resolve();
    };
    asyncReduce(ruleIndex[symbol], { canBeEmpty: false, symbols: [] },
      reduceRule, collectResults
    );
  });
};

let generateNonterminalEntries = function(table, options) {
  let ruleIndex = options.rules.reduce((ruleIndex, rule) => {
    let rules = ruleIndex[rule.left] || [];
    rules.push(rule);
    ruleIndex[rule.left] = rules;
    return ruleIndex;
  }, {});
  let result = Promise.resolve();
  Object.keys(ruleIndex).forEach(symbol => {
    result = result.then(() => generateFirstFor(symbol, table, ruleIndex));
  });
  return result;
};

let generateFirstTable = function(options) {
  let table = generateTerminalEntries(options.terminals);
  return generateNonterminalEntries(table, options).then(table => {
    table.keys().forEach(key => {
      table[key].symbols = new Set(table[key].symbols);
    });
    return table;
  });
};

let compiler = function() {
  return thru.obj(function(code, encoding, done) {
    generateFirstTable(code).then(firstTable => {
      code.firstTable = firstTable;
      this.push(code);
      done();
    });
  });
};

class Transformer extends Stream.Transform {

  constructor() {
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    generateFirstTable(code).then(firstTable => {
      code.firstTable = firstTable;
      this.push(code);
      console.log('table done')
      done();
    }).catch(done);
  }

  _flush(done) {
    done();
  }
};

let firstTableCompiler = function() {
  return new Transformer();
};

firstTableCompiler.testAPI = {
  generateFirstFor
};

export default firstTableCompiler;
