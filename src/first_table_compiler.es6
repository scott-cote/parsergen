import thru from 'through2';

let compiler = function() {

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
          code.testFirstTable[symbol] = rules.reduce((cntx, rule) => {
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
              symbols.filter(current => current != symbol).map(current => code.testFirstTable[current].symbols)
            );
            return cntx;
          }, { canBeEmpty: false, symbols: [] });
        } else {
          cntx.symbols.push(symbol);
        }

        return cntx;
      }, { symbols: [], table: code.testFirstTable }).symbols;
    }

    return code;
  };

  return thru.obj(function(code, encoding, done) {
    this.push(compile(code));
    done();
  });
};

export default compiler;
