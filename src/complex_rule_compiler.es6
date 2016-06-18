import Stream from 'stream';

let compile = function(ast) {

  let getRulesRoot = function() {
    let root = ast[ast.length-1];
    return ast[root.children[0]];
  };

  let compileLeft = function(current) {
    let ident = ast[current.children[0]];
    return ident.contents;
  };

  let compileRight = function(current) {
    if (current.type === 'RIGHT') {
      return current.children
        .map(id => compileRight(ast[id]))
        .reduce((value, elements) => value.concat(elements), []);
    } else {
      return current.contents;
    }
  };

  let compileRule = function(current) {
    let left = ast[current.children[0]];
    let right = ast[current.children[2]];
    return { left: compileLeft(left), right: compileRight(right) };
  };

  let compileRules = function(current) {
    if (current.type === 'RULES') {
      return current.children
        .map(id => compileRules(ast[id]))
        .reduce((value, rules) => value.concat(rules), []);
    } else {
      return compileRule(current);
    }
  };

  let root = getRulesRoot();

  return compileRules(root);
};

class Transformer extends Stream.Transform {

  constructor() {
    super({ objectMode : true });
  }

  _transform(ast, encoding, done) {
    let code = { complexRules: compile(ast) };
    this.push(code);
    done();
  }

  _flush(done) {
    done();
  }
};

export default function() {
  return new Transformer();
};
