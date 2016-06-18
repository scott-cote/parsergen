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
    super({
      readableObjectMode : true,
      writableObjectMode: true
    });
  }

  _transform(data, encoding, done) {
    let tokenizer = createTokenizer();
    tokenizer.on('token', token => this.push(token));
    tokenizer.on('finish', done);
    tokenizer.end(data);
  }
};

export default function() {
  return new Transformer();
};
