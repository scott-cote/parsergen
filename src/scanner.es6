import Stream from 'stream';
import Tokenizer from 'tokenizer';

let createTokenizer = function() {

  let tokenizer = new Tokenizer();

  tokenizer.addRule(/^(\s)+$/, 'TOKEN_WHITESPACE');
  tokenizer.addRule(/^\w+$/, 'TOKEN_IDENTIFIER');
  tokenizer.addRule(/^;$/, 'TOKEN_SEMICOLON');
  tokenizer.addRule(/^->$/, 'TOKEN_ROCKET');
  tokenizer.ignore('TOKEN_WHITESPACE');

  return tokenizer;
};

class Transformer extends Stream.Transform {

  constructor() {
    super({ readableObjectMode : true });
  }

  _transform(data, encoding, done) {
    if (!this.tokenizer) {
      this.tokenizer = createTokenizer();
      this.tokenizer.on('token', token => this.push(token));
    }
    this.tokenizer.write(data);
    done();
  }

  _flush(done) {
    this.tokenizer.on('finish', done);
    this.tokenizer.end();
  }
};

export default function() {
  return new Transformer();
};
