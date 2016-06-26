import Stream from 'stream';

/*
this.getFollowFor = function(nonterminal, follow, code) {
  let self = this;
  if (!follow[nonterminal]) {
    let allFollow = code.rules.reduce((outterValue, rule) => {
      outterValue = outterValue.concat(rule.right.reduce((value, token, index, array) => {
        if (nonterminal === token.symbol) {
          if (index < array.length-1) {
            let newVal = self.getFirstFor(array[index+1].symbol);
            return value.concat(newVal);
          } else {
            let newVal = self.getFollowFor(rule.left);
            return value.concat(newVal);
          }
        }
        return value;
      }, []));
      return outterValue;
    }, []);
    follow[nonterminal] = [...new Set(allFollow)];
  }
  return follow[nonterminal];
};
*/

/*

  for each rule in rules
    for each item and index in rule.right
      if item.symbol == symbol
        nextItem = rule.right[index+1]
        if nextItem, traverse next chain adding first until !first.canBeEmpty
          or you reach the end. If end, add generateFollowFor(rule.left)
        else add generateFollowFor(rule.left)

*/

let generateFollowFor = function(symbol, table, rules) {
  return new Promise((resolve, reject) => {
    resolve();
  });
};

let compile = function(code) {
  code.followTable = {};
  let result = Promise.resolve();
  code.nonterminals.forEach(symbol => {
    result = result.then(() => generateFollowFor(symbol, code.followTable, code.rules));
  });
  return result;
};

   /*
  let table = {};

  let addToFollowSet = function(symbol, item) {
    let set = table[symbol] || new Set();
    set.add(item);
    table[symbol] = set;
  };

  code.rules.forEach(rule => {
    */
    /*
    rule.right.forEach((symbol, index) => {
      if (symbol.type == 'NONTERMINAL') {
        let nextSymbol = rule.right[index+1];
        if (nextSymbol) {
          // symbol then nextSymbol
          let first = code.firstTable[nextSymbol.symbol];
          Array.from(first.symbols).forEach(item => {
            addToFollowSet(symbol.symbol, item);
          });
        } else {
          // symbol at end
        }
      }
    });
    */
    /*
  });
  return table;
  */

class Transformer extends Stream.Transform {

  constructor() {
    console.log('follow start')
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    console.log('follow run')
    compile(code).then(() => done(null, code)).catch(done);
  }
};

let followTableCompiler = function() {
  return new Transformer();
};

followTableCompiler.testAPI = {
};

export default followTableCompiler;
