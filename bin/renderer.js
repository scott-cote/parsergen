'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
  return new Transformer();
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var renderer = function renderer() {

  var render = function render(code) {

    var renderRuleTable = function renderRuleTable() {
      return code.ruleTable.map(function (rule) {
        return JSON.stringify(rule);
      }).join(',\n    ');
    };

    return '\nimport thru from \'through2\';\n\nlet parser = function parser() {\n\n  let rules, parseTable, input, stack, curNodes;\n\n  let nodes = [];\n\n  let nodeStack = [];\n\n  let LeafNode = function(type, contents) {\n    this.id = nodes.length;\n    this.type = type;\n    this.contents = contents;\n    this.children = [];\n  };\n\n  let TrunkNode = function(type, children) {\n    this.id = nodes.length;\n    this.type = type;\n    this.children = children.map(child => child.id);\n  };\n\n  let shift = function(newState) {\n    return function(token, type) {\n      let node = new LeafNode(type, token);\n      nodes.push(node);\n      nodeStack.push(node);\n      stack.push(parseTable[newState]);\n      return true;\n    };\n  };\n\n  let reduce = function(ruleIndex) {\n    return function(token, type) {\n      let rule = rules[ruleIndex];\n      curNodes = nodeStack.splice(-rule.rightCount, rule.rightCount);\n      stack.splice(-rule.rightCount, rule.rightCount)\n      input.push({ content: \'\', type: rule.left });\n    };\n  };\n\n  let goto = function(newState) {\n    return function(token, type) {\n      let node = new TrunkNode(type, curNodes);\n      nodes.push(node);\n      nodeStack.push(node);\n      stack.push(parseTable[newState]);\n      return true;\n    };\n  };\n\n  let accept = function() {\n    return function(token, type) {\n      curNodes = nodeStack.splice(-1, 1);\n      let node = new TrunkNode(type, curNodes);\n      nodes.push(node);\n      return true;\n    };\n  }\n\n  rules = [\n    ' + renderRuleTable() + '\n  ];\n\n  parseTable = [\n    ' + code.states.render() + '\n  ];\n\n  stack = [parseTable[0]];\n\n  let processToken = function(token) {\n    input = [token];\n    while (input.length) {\n      let symbol = input[input.length-1];\n      let top = stack[stack.length-1];\n      if (top[symbol.type](symbol.content, symbol.type)) {\n        input.pop();\n      }\n    }\n  };\n\n  return thru.obj(function(chunk, encoding, done) {\n    processToken(chunk);\n    done();\n  }, function(done) {\n    processToken({ content: \'\', type: \'$\' });\n    this.push(nodes);\n    done();\n  });\n};\n\nexport default parser;\n\n';
  };

  return thru.obj(function (code, encoding, done) {
    this.push(render(code));
    done();
  });
};

var Transformer = function (_Stream$Transform) {
  _inherits(Transformer, _Stream$Transform);

  function Transformer() {
    _classCallCheck(this, Transformer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Transformer).call(this, { objectMode: true }));
  }

  _createClass(Transformer, [{
    key: '_transform',
    value: function _transform(code, encoding, done) {
      done(null, code);
    }
  }]);

  return Transformer;
}(Stream.Transform);

;
;