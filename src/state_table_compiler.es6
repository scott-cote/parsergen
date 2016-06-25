import Stream from 'stream';

class Transformer extends Stream.Transform {

  constructor() {
    console.log('st start')
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    console.log('st run')
    done(null, code);
  }
};
export default function() {
  return new Transformer();
};
