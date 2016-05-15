import thru from 'through2';

let compiler = function() {
  return thru.obj(function(code, encoding, done) {

    let compile = function(code) {

      code.rules = code.complexRules.map(rule => rule);

      code.rules.push({
        left: code.complexRules[0].left+"'",
        right: [code.complexRules[0].left, '$']
      });

      code.nonterminals = new Set(
        code.rules.map(rule => rule.left)
      );

      code.terminals = new Set(
        code.rules.map(rule => rule.right)
          .reduce((value, symbols) => value.concat(symbols), [])
          .filter(symbol => !code.nonterminals.has(symbol))
      );

      code.symbols = new Set([...code.nonterminals, ...code.terminals]);

      return code;
    };

    this.push(compile(code));
    done();
  });
};

export default compiler;
