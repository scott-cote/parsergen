import thru from 'through2';

let compiler = function() {
  return thru.obj(function(code, encoding, done) {
    code.nonterminals = new Set(code.rules.map(rule => rule.left));
    code.terminals = new Set(code.rules.map(rule => rule.right)
      .reduce((value, syms) => value.concat(syms), [])
      .filter(symbol => !code.nonterminals.has(symbol)));
    code.terminals.add('$');
    this.push(code);
    done();
  });
};

export default compiler;
