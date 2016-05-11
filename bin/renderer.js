'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderer = function renderer() {

  var render = function render(code) {

    var renderRuleTable = function renderRuleTable() {
      return code.ruleTable.map(function (rule) {
        return JSON.stringify(rule);
      }).join(',\n    ');
    };

    return '\nimport thru from \'through2\';\n\nlet parser = function parser() {\n\n  let rules, parseTable, input, stack, curNodes;\n\n  let nodes = [];\n\n  let nodeStack = [];\n\n  let LeafNode = function(type, contents) {\n    this.id = nodes.length;\n    this.type = type;\n    this.contents = contents;\n    this.children = [];\n  };\n\n  let TrunkNode = function(type, children) {\n    this.id = nodes.length;\n    this.type = type;\n    this.children = children.map(child => child.id);\n  };\n\n  let shift = function(newState) {\n    return function(token, type) {\n      let node = new LeafNode(type, token);\n      nodes.push(node);\n      nodeStack.push(node);\n      stack.push(parseTable[newState]);\n      return true;\n    };\n  };\n\n  let reduce = function(ruleIndex) {\n    return function(token, type) {\n      let rule = rules[ruleIndex-1];\n      curNodes = nodeStack.splice(-rule.rightCount, rule.rightCount);\n      stack.splice(-rule.rightCount, rule.rightCount)\n      input.push({ content: \'\', type: rule.left });\n    };\n  };\n\n  let goto = function(newState) {\n    return function(token, type) {\n      let node = new TrunkNode(type, curNodes);\n      nodes.push(node);\n      nodeStack.push(node);\n      stack.push(parseTable[newState]);\n      return true;\n    };\n  };\n\n  let accept = function() {\n    return function(token, type) {\n      curNodes = nodeStack.splice(-1, 1);\n      let node = new TrunkNode(type, curNodes);\n      nodes.push(node);\n      return true;\n    };\n  }\n\n  rules = [\n    ' + renderRuleTable() + '\n  ];\n\n  parseTable = [\n    ' + code.states.render() + '\n  ];\n\n  stack = [parseTable[0]];\n\n  let processToken = function(token) {\n    input = [token];\n    while (input.length) {\n      let symbol = input[input.length-1];\n      let top = stack[stack.length-1];\n      if (top[symbol.type](symbol.content, symbol.type)) {\n        input.pop();\n      }\n    }\n  };\n\n  return thru.obj(function(chunk, encoding, done) {\n    processToken(chunk);\n    done();\n  }, function(done) {\n    processToken({ content: \'\', type: \'$\' });\n    this.push(nodes);\n    done();\n  });\n};\n\nexport default parser;\n\n';
  };

  return _through2.default.obj(function (code, encoding, done) {
    this.push(render(code));
    done();
  });
};

exports.default = renderer;