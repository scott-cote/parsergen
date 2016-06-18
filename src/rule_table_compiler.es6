import Stream from 'stream';

let compiler = function() {

  let compile = function(code) {
    code.ruleTable = code.rules.map(rule => { return  { left: rule.left, rightCount: rule.right.length }});
    return code;
  };

  return thru.obj(function(code, encoding, done) {
    this.push(compile(code));
    done();
  });
};
class Transformer extends Stream.Transform {

  constructor() {
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    done(null, code);
  }
};
export default function() {
  return new Transformer();
};
