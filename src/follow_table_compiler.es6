import Stream from 'stream';

/*

  for each rule in rules
    for each item and index in rule.right
      if item.symbol == symbol
        nextItem = rule.right[index+1]
        if nextItem, traverse next chain adding first until !first.canBeEmpty
          or you reach the end. If end, add generateFollowFor(rule.left)
        else add generateFollowFor(rule.left)

*/

/*
let generateFollowFor = function(symbol, table, rules) {

  let reduceItem = function(item, index, items) {
    let result = Promise.resolve();
    return result;
  };

  let reduceRule = function(rule) {
    let result = Promise.resolve();
    rule.right.forEach((item, index, items) => {
      result = result.then(() => reduceItem(item, index, items));
    });
    return result;
  };

  let result = Promise.resolve();

  rules.forEach(rule => {
    result = result.then(() => reduceRule(rule));
  });

  return result;
};

*/

let generateRuleIndex = function(rules) {
  let ruleIndex = {};
  return rules.reduce((ruleIndex, rule) => {
    new Set(
      rule.right
        .filter(item => item.type === 'NONTERMINAL')
        .map(item => item.symbol)
    ).forEach(symbol => {
      ruleIndex[symbol] = ruleIndex[symbol] || [];
      ruleIndex[symbol].push(rule);
    });
    return ruleIndex;
  }, {});
};

let generateFollowFor = function(symbol, followTable, firstTable, ruleIndex) {
  let result = Promise.resolve();
  if (!followTable[symbol]) {
    ruleIndex[symbol].forEach(rule => {
      let right = rule.right.map(item => item.symbol);
      right = right.slice(right.indexOf(symbol)+1);
      let symbols = right.reduce((item, symbols) => {
        return symbols;
      }, new Set());
      console.log(JSON.stringify(symbols));
      result = result.then(() => symbols);
    });
  }
  return result;
};

let generateFollowTable = function(options) {
  let table = {};
  let ruleIndex = generateRuleIndex(options.rules);
  let result = Promise.resolve();
  Object.keys(ruleIndex).forEach(symbol => {
    result = result.then(() => generateFollowFor(symbol, table, options.firstTable, ruleIndex));
  });
  return result;
};

class Transformer extends Stream.Transform {

  constructor() {
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    generateFollowTable(code).then(followTable => {
      code.followTable = followTable;
      this.push(code);
    });
  }
};

let followTableCompiler = function() {
  return new Transformer();
};

followTableCompiler.testAPI = {
  generateRuleIndex,
  generateFollowFor
};

export default followTableCompiler;
