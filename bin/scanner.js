'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tokenizer = require('tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createTokenizer = function createTokenizer() {

  var tokenizer = new _tokenizer2.default();

  tokenizer.addRule(/^(\s)+$/, 'TOKEN_WHITESPACE');
  tokenizer.addRule(/^\w+$/, 'TOKEN_IDENTIFIER');
  tokenizer.addRule(/^;$/, 'TOKEN_SEMICOLON');
  tokenizer.addRule(/^->$/, 'TOKEN_ROCKET');
  tokenizer.ignore('TOKEN_WHITESPACE');

  return tokenizer;
};

var scanner = function scanner() {
  return _through2.default.obj(function (chunk, encoding, done) {
    var _this = this;

    var tokenizer = createTokenizer();
    tokenizer.on('token', function (token) {
      return _this.push(token);
    });
    tokenizer.on('finish', done);
    tokenizer.end(chunk);
  });
};

exports.default = scanner;