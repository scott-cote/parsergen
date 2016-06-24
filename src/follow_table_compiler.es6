import Stream from 'stream';

let compiler = function() {
  return thru.obj(function(code, encoding, done) {
    this.push(code);
    done();
  });
};
class Transformer extends Stream.Transform {

  constructor() {
    console.log('follow start')
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    console.log('follow run')
    done(null, code);
  }
};

export default function() {
  return new Transformer();
};
