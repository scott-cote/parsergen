import thru from 'through2';

let generateFirstTable = function(options) {

  let firstTable = Array.from(options.terminals.keys()).reduce((table, symbol) => {
    table[symbol] = { canBeEmpty: false, symbols: [symbol] };
    return table;
  }, {});

  let symbols = Array.from(options.nonterminals.keys()).reverse();

  while (symbols.length) {
    symbols = symbols.reduce((cntx, symbol) => {
      let rules =  options.rules.filter(rule => rule.left === symbol);

      let ready = rules.reduce((ready, rule) => {
        if (!ready) return false;
        return rule.right.reduce((ready, element) => {
          if (!ready) return false;
          if (element.symbol === symbol) return true;
          return !!firstTable[element.symbol];
        }, true);
      }, true);

      if (ready) {
        firstTable[symbol] = rules.reduce((cntx, rule) => {
          let index = rule.right.findIndex(element => {
            return !element.canBeEmpty;
          });
          let symbols;
          if (index === -1) {
            cntx.canBeEmpty = true;
            symbols = rule.right.map(element => element.symbol);
          } else {
            symbols = rule.right.slice(0, index+1).map(element => element.symbol);
          }
          cntx.symbols = cntx.symbols.concat(
            symbols.filter(current => current != symbol).map(current => firstTable[current].symbols)
          );
          return cntx;
        }, { canBeEmpty: false, symbols: [] });
      } else {
        cntx.symbols.push(symbol);
      }

      return cntx;
    }, { symbols: [], table: firstTable }).symbols;
  }

  return firstTable;
};

let compiler = function() {
  return thru.obj(function(code, encoding, done) {
    code.firstTable = generateFirstTable(code);
    this.push(code);
    done();
  });
};

compiler.testAPI = {
  generateFirstTable
};

export default compiler;
