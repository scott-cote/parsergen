import thru from 'through2';

let compiler = function() {
  return thru.obj(function(code, encoding, done) {

    let compile = function(code) {

      code.nonterminals = new Set(
        code.complexRules.map(rule => rule.left)
      );

      code.terminals = new Set(
        code.complexRules.map(rule => rule.right)
          .reduce((value, symbols) => value.concat(symbols), ['$'])
          .filter(symbol => !code.nonterminals.has(symbol))
      );

      code.symbols = new Set([...code.nonterminals, ...code.terminals]);

      code.rules = code.complexRules.map(rule => rule);

      return code;
    };

    this.push(compile(code));
    done();
  });
};

export default compiler;
