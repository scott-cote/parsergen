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
          code.testFirstTable[symbol] = rules.reduce((first, rule) => {
            let index = rule.right.findIndex(element => {
              return !element.canBeEmpty;
            });
            let elements;
            if (index === -1) {
              cntx.canBeEmpty = true;
              // elements = rule.right.slice();
            } else {
              // elements = rule.right.slice();
            }
            // cntx.symbols = cntx.symbols.concat();
            return first;
          }, { canBeEmpty: false, symbols: [] });
        } else {
          cntx.symbols.push(symbol);
        }

        return cntx;
      }, { symbols: [], table: code.testFirstTable }).symbols;
    }

    console.log(JSON.stringify(code.testFirstTable));

    return code;
  };

  return thru.obj(function(code, encoding, done) {
    this.push(compile(code));
    done();
  });
};

export default compiler;
