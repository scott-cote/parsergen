export default function(rules, states) {
  return `

var parser = function(error) {

  var rules, parseTable, input, stack, curNodes;

  var nodes = [];

  var nodeStack = [];

  var LeafNode = function(type, contents) {
    this.id = nodes.length;
    this.type = type;
    this.contents = contents;
    this.children = [];
  };

  var TrunkNode = function(type, children) {
    this.id = nodes.length;
    this.type = type;
    this.children = children.map(function(child) { return child.id });
  };

  var shift = function(newState) {
    return function(token, type) {
      var node = new LeafNode(type, token);
      nodes.push(node);
      nodeStack.push(node);
      stack.push(parseTable[newState]);
      return true;
    };
  };

  var reduce = function(ruleIndex) {
    return function(token, type) {
      var rule = rules[ruleIndex-1];
      curNodes = nodeStack.splice(-rule.rightCount, rule.rightCount);
      stack.splice(-rule.rightCount, rule.rightCount)
      input.push({ content: '', type: rule.left });
    };
  };

  var goto = function(newState) {
    return function(token, type) {
      var node = new TrunkNode(type, curNodes);
      nodes.push(node);
      nodeStack.push(node);
      stack.push(parseTable[newState]);
      return true;
    };
  };

  var accept = function() {
    return function(token, type) {
      curNodes = nodeStack.splice(-1, 1);
      var node = new TrunkNode(type, curNodes);
      nodes.push(node);
      return true;
    };
  }

  rules = [
    ${rules}
  ];

  parseTable = [
    ${states}
  ];

  stack = [parseTable[0]];

  error = error || function() {
    throw 'parser error';
  }

  this.processToken = function(content, type) {
    input = [{ content, type }];
    while (input.length) {
      var symbol = input[input.length-1];
      var top = stack[stack.length-1];
      if ((top[symbol.type]||error)(symbol.content, symbol.type)) {
        input.pop();
      }
    }
  };

  this.end = function() {
    this.processToken('', '$');
    return nodes;
  }
};

exports.default = parser;

`;
}
