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

var render = function render(code) {

  var renderRuleTable = function renderRuleTable() {
    return code.ruleTable.map(function (rule) {
      return JSON.stringify(rule);
    }).join(',\n  ');
  };

  var renderStates = function renderStates() {
    return code.states.map(function (state) {
      return state.render();
    }).join(',\n  ');
  };

  return '\nimport Stream from \'stream\';\n\nlet rules, parseTable, input, stack, curNodes;\n\nlet nodes = [];\n\nlet nodeStack = [];\n\nlet LeafNode = function(type, contents) {\n  this.id = nodes.length;\n  this.type = type;\n  this.contents = contents;\n  this.children = [];\n};\n\nlet TrunkNode = function(type, children) {\n  this.id = nodes.length;\n  this.type = type;\n  this.children = children.map(child => child.id);\n};\n\nlet shift = function(newState) {\n  return function(token, type) {\n    let node = new LeafNode(type, token);\n    nodes.push(node);\n    nodeStack.push(node);\n    stack.push(parseTable[newState]);\n    return true;\n  };\n};\n\nlet reduce = function(ruleIndex) {\n  return function(token, type) {\n    let rule = rules[ruleIndex];\n    curNodes = nodeStack.splice(-rule.rightCount, rule.rightCount);\n    stack.splice(-rule.rightCount, rule.rightCount)\n    input.push({ content: \'\', type: rule.left });\n  };\n};\n\nlet goto = function(newState) {\n  return function(token, type) {\n    let node = new TrunkNode(type, curNodes);\n    nodes.push(node);\n    nodeStack.push(node);\n    stack.push(parseTable[newState]);\n    return true;\n  };\n};\n\nlet accept = function() {\n  return function(token, type) {\n    curNodes = nodeStack.splice(-1, 1);\n    let node = new TrunkNode(type, curNodes);\n    nodes.push(node);\n    return true;\n  };\n}\n\nrules = [\n  ' + renderRuleTable() + '\n];\n\nparseTable = [\n  ' + renderStates() + '\n];\n\nstack = [parseTable[0]];\n\nlet processToken = function(token) {\n  input = [token];\n  while (input.length) {\n    let symbol = input[input.length-1];\n    let top = stack[stack.length-1];\n    if (top[symbol.type](symbol.content, symbol.type)) {\n      input.pop();\n    }\n  }\n};\n\nclass Transformer extends Stream.Transform {\n\n  constructor() {\n    super({ objectMode: true });\n  }\n\n  _transform(token, encoding, done) {\n    processToken(token);\n    done();\n  }\n\n  _flush(done) {\n    processToken({ content: \'\', type: \'$\' });\n    this.push(nodes);\n    done();\n  }\n};\n\nexport default function() {\n  return new Transformer();\n};\n\n';
};

var Transformer = function (_Stream$Transform) {
  _inherits(Transformer, _Stream$Transform);

  function Transformer() {
    _classCallCheck(this, Transformer);

    console.log('render start');
    return _possibleConstructorReturn(this, Object.getPrototypeOf(Transformer).call(this, { objectMode: true }));
  }

  _createClass(Transformer, [{
    key: '_transform',
    value: function _transform(code, encoding, done) {
      console.log('Running render');
      this.push(render(code));
      done();
    }
  }]);

  return Transformer;
}(_stream2.default.Transform);

;

;