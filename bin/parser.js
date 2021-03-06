'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parser = function parser() {

  var rules = void 0,
      parseTable = void 0,
      input = void 0,
      stack = void 0,
      curNodes = void 0;

  var nodes = [];

  var nodeStack = [];

  var LeafNode = function LeafNode(type, contents) {
    this.id = nodes.length;
    this.type = type;
    this.contents = contents;
    this.children = [];
  };

  var TrunkNode = function TrunkNode(type, children) {
    this.id = nodes.length;
    this.type = type;
    this.children = children.map(function (child) {
      return child.id;
    });
  };

  var shift = function shift(newState) {
    return function (token, type) {
      var node = new LeafNode(type, token);
      nodes.push(node);
      nodeStack.push(node);
      stack.push(parseTable[newState]);
      return true;
    };
  };

  var reduce = function reduce(ruleIndex) {
    return function (token, type) {
      var rule = rules[ruleIndex];
      curNodes = nodeStack.splice(-rule.rightCount, rule.rightCount);
      stack.splice(-rule.rightCount, rule.rightCount);
      input.push({ content: '', type: rule.left });
    };
  };

  var goto = function goto(newState) {
    return function (token, type) {
      var node = new TrunkNode(type, curNodes);
      nodes.push(node);
      nodeStack.push(node);
      stack.push(parseTable[newState]);
      return true;
    };
  };

  var accept = function accept() {
    return function (token, type) {
      curNodes = nodeStack.splice(-1, 1);
      var node = new TrunkNode(type, curNodes);
      nodes.push(node);
      return true;
    };
  };

  rules = [{ "left": "RULES'", "rightCount": 2 }, { "left": "RULES", "rightCount": 2 }, { "left": "RULES", "rightCount": 1 }, { "left": "RULE", "rightCount": 4 }, { "left": "LEFT", "rightCount": 1 }, { "left": "RIGHT", "rightCount": 2 }, { "left": "RIGHT", "rightCount": 1 }];

  parseTable = [{ "RULES": goto(1), "RULE": goto(2), "LEFT": goto(3), "TOKEN_IDENTIFIER": shift(4) }, { "RULE": goto(5), "LEFT": goto(3), "$": accept(), "TOKEN_IDENTIFIER": shift(4) }, { "$": reduce(2), "TOKEN_IDENTIFIER": reduce(2) }, { "TOKEN_ROCKET": shift(6) }, { "TOKEN_ROCKET": reduce(4) }, { "$": reduce(1), "TOKEN_IDENTIFIER": reduce(1) }, { "RIGHT": goto(7), "TOKEN_IDENTIFIER": shift(8) }, { "TOKEN_SEMICOLON": shift(9), "TOKEN_IDENTIFIER": shift(10) }, { "TOKEN_SEMICOLON": reduce(6), "TOKEN_IDENTIFIER": reduce(6) }, { "$": reduce(3), "TOKEN_IDENTIFIER": reduce(3) }, { "TOKEN_SEMICOLON": reduce(5), "TOKEN_IDENTIFIER": reduce(5) }];

  stack = [parseTable[0]];

  var processToken = function processToken(token) {
    input = [token];
    while (input.length) {
      var symbol = input[input.length - 1];
      var top = stack[stack.length - 1];
      if (top[symbol.type](symbol.content, symbol.type)) {
        input.pop();
      }
    }
  };

  return _through2.default.obj(function (chunk, encoding, done) {
    processToken(chunk);
    done();
  }, function (done) {
    processToken({ content: '', type: '$' });
    this.push(nodes);
    done();
  });
};

exports.default = parser;