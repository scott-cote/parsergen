import thru from 'through2';

let compiler = function() {

  let getRulesFor = function(symbol, rules) {
    return code.rules.filter(rule => rule.left === symbol);
  };

  let getFirstForRule = function(rule, table) {
    /*
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
    */
    return;
  };

  let getFirstSetFor = function(symbol, table, terminals) {
    let result = { canBeEmpty: false, symbols: [] };

    if (terminals.has(symbol)) {
      result.symbols.push(symbol);
    } else {
      result = getRulesFor(symbol).reduce((cntx, rule) => {
        if (!cntx) {
          return cntx;
        } else if (rule.right.length === 0) {
          cntx.canBeEmpty = true;
          return cntx;
        } else {
          let first = getFirstForRule(rule, table);
          if (!first) reutrn;
          if (first.canBeEmpty) cntx.canBeEmpty = true;
          cntx.symbols = cntx.symbols.concat(first.symbols);
          return cntx;
        }
      }, result);
    }

    return result;
  };

  let compile = function(code) {

    code.testFirstTable = Array.from(code.terminals.keys()).reduce((table, symbol) => {
      table[symbol] = { canBeEmpty: false, symbols: [symbol] };
      return table;
    }, {});

    let symbols = Array.from(code.nonterminals.keys()).reverse();

    while (symbols.length) {
      symbols = symbols.reduce((cntx, symbol) => {
        let rules =  code.rules.filter(rule => rule.left === symbol);

        let ready = rules.reduce((ready, rule) => {
          if (!ready) return false;
          return rule.right.reduce((ready, element) => {
            if (!ready) return false;
            if (element.symbol === symbol) return true;
            return !!code.testFirstTable[element.symbol];
          }, true);
        }, true);

        if (ready) {
          code.testFirstTable[symbol] = rules.reduce((first, rule) => {
            let index = rule.right.findIndex(element => {
              return !element.canBeEmpty;
            });
            if (index === -1) {
              cntx.canBeEmpty = true;
            } else {
              console.log(index);
              // ...
            }
            return first;
          }, { canBeEmpty: false, symbols: [] });
        } else {
          cntx.symbols.push(symbol);
        }

        return cntx;
      }, { symbols: [], table: code.testFirstTable }).symbols;
    }

    /*
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
    */

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
