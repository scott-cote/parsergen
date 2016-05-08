import Tokenizer from 'tokenizer';
import thru from 'through2';

let createTokenizer = function() {

  let tokenizer = new Tokenizer();

  tokenizer.addRule(/^(\s)+$/, 'TOKEN_WHITESPACE');
  tokenizer.addRule(/^\w+$/, 'TOKEN_IDENTIFIER');
  tokenizer.addRule(/^;$/, 'TOKEN_SEMICOLON');
  tokenizer.addRule(/^->$/, 'TOKEN_ROCKET');
  tokenizer.ignore('TOKEN_WHITESPACE');

  return tokenizer;
};

let scanner = function() {
  return thru.obj(function(chunk, encoding, done) {
    let tokenizer = createTokenizer();
    tokenizer.on('token', token => this.push(token));
    tokenizer.on('finish', done);
    tokenizer.end(chunk);
  });
};

export default scanner;
