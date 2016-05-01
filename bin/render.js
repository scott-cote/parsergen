"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (rules, states) {
  return "\n\nvar Parser = function(error) {\n\n  var rules, parseTable, input, stack, curNodes;\n\n  var nodes = [];\n\n  var nodeStack = [];\n\n  var LeafNode = function(type, contents) {\n    this.id = nodes.length;\n    this.type = type;\n    this.contents = contents;\n    this.children = [];\n  };\n\n  var TrunkNode = function(type, children) {\n    this.id = nodes.length;\n    this.type = type;\n    this.children = children.map(function(child) { return child.id });\n  };\n\n  var shift = function(newState) {\n    return function(token, type) {\n      var node = new LeafNode(type, token);\n      nodes.push(node);\n      nodeStack.push(node);\n      stack.push(parseTable[newState]);\n      return true;\n    };\n  };\n\n  var reduce = function(ruleIndex) {\n    return function(token, type) {\n      var rule = rules[ruleIndex-1];\n      curNodes = nodeStack.splice(-rule.rightCount, rule.rightCount);\n      stack.splice(-rule.rightCount, rule.rightCount)\n      input.push({ content: '', type: rule.left });\n    };\n  };\n\n  var goto = function(newState) {\n    return function(token, type) {\n      var node = new TrunkNode(type, curNodes);\n      nodes.push(node);\n      nodeStack.push(node);\n      stack.push(parseTable[newState]);\n      return true;\n    };\n  };\n\n  var accept = function() {\n    return function(token, type) {\n      curNodes = nodeStack.splice(-1, 1);\n      var node = new TrunkNode(type, curNodes);\n      nodes.push(node);\n      return true;\n    };\n  }\n\n  rules = [\n    " + rules + "\n  ];\n\n  parseTable = [\n    " + states + "\n  ];\n\n  stack = [parseTable[0]];\n\n  error = error || function() {\n    throw 'parser error';\n  }\n\n  this.processToken = function(content, type) {\n    input = [{ content, type }];\n    while (input.length) {\n      var symbol = input[input.length-1];\n      var top = stack[stack.length-1];\n      if ((top[symbol.type]||error)(symbol.content, symbol.type)) {\n        input.pop();\n      }\n    }\n  };\n\n  this.end = function() {\n    this.processToken('', '$');\n    return nodes;\n  }\n};\n\nexports.default = Parser;\n\n";
};