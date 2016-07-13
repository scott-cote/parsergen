import Stream from 'stream';

let generateTerminalEntries = function(terminals) {
  return Array.from(terminals.keys()).reduce((table, symbol) => {
    table[symbol] = { canBeEmpty: false, symbols: [symbol] };
    return table;
  }, {});
};

let generateRuleIndex = function(rules) {
  return rules.reduce((ruleIndex, rule) => {
    let rules = ruleIndex[rule.left] || [];
    rules.push(rule);
    ruleIndex[rule.left] = rules;
    return ruleIndex;
  }, {});
};

let generateFirstFor = function(symbol, table, ruleIndex) {

  let ruleReduction = { canBeEmpty: false, symbols: [] };

  let reduceRule = function(rule) {

    let itemReduction = { canBeEmpty: true, symbols: [] };

    let reduceItem = function(item) {
      if (!itemReduction.canBeEmpty) return;
      return generateFirstFor(item.symbol, table, ruleIndex).then(() => {
        let first = table[item.symbol];
        itemReduction.symbols = itemReduction.symbols.concat(first.symbols);
        if (!first.canBeEmpty) itemReduction.canBeEmpty = false;
      });
    };

    let result = Promise.resolve();

    rule.right.filter(item => item.symbol != rule.left).forEach(item => {
      result = result.then(() => reduceItem(item));
    });

    return result.then(() => {
      ruleReduction.canBeEmpty = ruleReduction.canBeEmpty || itemReduction.canBeEmpty;
      ruleReduction.symbols = ruleReduction.symbols.concat(itemReduction.symbols);
      return
    });
  };

  let result = Promise.resolve();

  if (!table[symbol]) {
    ruleIndex[symbol].forEach(rule => {
      result = result.then(() => reduceRule(rule));
    });
    result = result.then(() => {
      table[symbol] = ruleReduction;
    });
  }

  return result;
};

let generateFirstTable = function(options) {
  let table = generateTerminalEntries(options.terminals);
  let ruleIndex = generateRuleIndex(options.rules);
  let result = Promise.resolve();
  Object.keys(ruleIndex).forEach(symbol => {
    result = result.then(() => generateFirstFor(symbol, table, ruleIndex));
  });
  result = result.then(() => {
    Object.keys(table).forEach(key => {
      table[key].symbols = new Set(table[key].symbols);
    });
    return table;
  });
  return result;
};

class Transformer extends Stream.Transform {

  constructor() {
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    console.log('table started')
    generateFirstTable(code).then(firstTable => {
      code.firstTable = firstTable;
      console.log('table done')
      this.push(code);
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
