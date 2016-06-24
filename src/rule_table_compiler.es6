import Stream from 'stream';


  let compile = function(code) {
    code.ruleTable = code.rules.map(rule => { return  { left: rule.left, rightCount: rule.right.length }});
    return code;
  };


class Transformer extends Stream.Transform {

  constructor() {
    console.log('rt start')
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    this.push(compile(code));
    done();
  }
};

export default function() {
  return new Transformer();
};
