import Stream from 'stream';


let compile = function(code) {

  code.rules = [{
    left: code.complexRules[0].left+"'",
    right: [code.complexRules[0].left, '$']
  }].concat(code.complexRules);

  code.nonterminals = new Set(
    code.rules.map(rule => rule.left)
  );

  code.terminals = new Set(
    code.rules.map(rule => rule.right)
      .reduce((value, symbols) => value.concat(symbols), [])
      .filter(symbol => !code.nonterminals.has(symbol))
  );

  code.symbols = new Set([...code.nonterminals, ...code.terminals]);

  code.rules = code.rules.map((rule, index) => { return {
    id: index,
    left: rule.left,
    right: rule.right.map(symbol => { return {
      symbol: symbol,
      type: code.terminals.has(symbol) ? 'TERMINAL' : 'NONTERMINAL'
    }})
  }});

  return code;
};

class Transformer extends Stream.Transform {

  constructor() {
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    this.push(compile(code));
    done();
  }

  _flush(done) {
    done();
  }
};

export default function() {
  return new Transformer();
};
