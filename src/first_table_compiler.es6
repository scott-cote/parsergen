import thru from 'through2';

let compiler = function() {

  let getRulesFor = function(symbol) {
    return code.rules.filter(rule => rule.left === symbol);
  };

  let getFirstForRule = function(rule) {
    return rule.right.reduce((cntx, element) => {
      if (!cntx.done) {
        let first = getFirstSetFor(element.symbol);
        if (!first.canBeEmpty) {
          cntx.done = true;
          cntx.canBeEmpty = false;
        }
        cntx.symbols = cntx.symbols.concat(first);
      }
      return cntx;
    }, { done: false, canBeEmpty: true, symbols: [] });
  };

  let getFirstSetFor = function(symbol, table, terminals) {
    let result = { canBeEmpty: false, symbols: [] };

    if (terminals.has(symbol)) {
      result.symbols.push(symbol);
    } else {
      result = getRulesFor(symbol).reduce((cntx, rule) => {
        if (rule.right.length === 0) {
          cntx.canBeEmpty = true;
        } else {
          /*
          let first = getFirstForRule(rule);
          if (first.canBeEmpty) cntx.canBeEmpty = true;
          cntx.symbols = cntx.symbols.concat(first.symbols);
          */
        }
        return cntx;
      }, result);
    }

    return result;
  };

  let compile = function(code) {

    let symbols = Array.from(code.symbols.keys());

    let table = {};

    while (symbols.length) {
      symbols = symbols.reduce((cntx, symbol) => {
        let firstSet = getFirstSetFor(symbol, table, code.terminals);
        if (firstSet) {
          cntx.table[symbol] = firstSet;
        }  else {
          cntx.symbols.push(symbol);
        }
        return cntx;
      }, { symbols: [], table: table }).symbols;
    }

    /*
    code.testFirstTable = Array.from(code.symbols.keys()).reduce((table, symbol) => {
      table[symbol] = getFirstSetFor(symbol, code.terminals);
      return table;
    }, {});
    */

    console.log(JSON.stringify(code.testFirstTable));

    return code;
  };

  return thru.obj(function(code, encoding, done) {
    this.push(compile(code));
    //this.push(code);
    done();
  });
};

export default compiler;
