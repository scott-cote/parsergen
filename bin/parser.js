'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
  return new Transformer();
};

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Transformer = function (_Stream$Transform) {
  _inherits(Transformer, _Stream$Transform);

  function Transformer() {
    _classCallCheck(this, Transformer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Transformer).call(this, { objectMode: true }));
  }

  _createClass(Transformer, [{
    key: '_transform',
    value: function _transform(token, encoding, done) {
      if (token) {
        processToken(token);
        done();
      } else {
        processToken({ content: '', type: '$' });
        done(null, nodes);
      }
    }
  }]);

  return Transformer;
}(_stream2.default.Transform);

;

;