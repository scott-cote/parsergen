import Stream from 'stream';

/*

  for each rule in rules
    for each item and index in rule.right
      if item.symbol == symbol
        nextItem = rule.right[index+1]
        if nextItem, traverse next chain adding first until !first.canBeEmpty
          or you reach the end. If end, add generateFollowFor(rule.left)
        else add generateFollowFor(rule.left)

*/

/*
let generateFollowFor = function(symbol, table, rules) {

  let reduceItem = function(item, index, items) {
    let result = Promise.resolve();
    return result;
  };

  let reduceRule = function(rule) {
    let result = Promise.resolve();
    rule.right.forEach((item, index, items) => {
      result = result.then(() => reduceItem(item, index, items));
    });
    return result;
  };

  let result = Promise.resolve();

  rules.forEach(rule => {
    result = result.then(() => reduceRule(rule));
  });

  return result;
};

*/

let compileRule = function(rule, table) {
  console.log(JSON.stringify(rule.right));
}

let compile = function(code) {
  code.followTable = {};
  let result = Promise.resolve();
  code.rules.forEach(rule => {
    result = result.then(() => compileRule(rule, code.followTable));
  });
  return result;
};

class Transformer extends Stream.Transform {

  constructor() {
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    compile(code).then(() => done(null, code)).catch(done);
  }
};

let followTableCompiler = function() {
  return new Transformer();
};

followTableCompiler.testAPI = {
};

export default followTableCompiler;
