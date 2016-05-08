export default function(rules, states) {
  return `
import thru from 'through2';

let parser = function parser() {

  let rules, parseTable, input, stack, curNodes;

  let nodes = [];

  let nodeStack = [];

  let LeafNode = function(type, contents) {
    this.id = nodes.length;
    this.type = type;
    this.contents = contents;
    this.children = [];
  };

  let TrunkNode = function(type, children) {
    this.id = nodes.length;
    this.type = type;
    this.children = children.map(child => child.id);
  };

  let shift = function(newState) {
    return function(token, type) {
      let node = new LeafNode(type, token);
      nodes.push(node);
      nodeStack.push(node);
      stack.push(parseTable[newState]);
      return true;
    };
  };

  let reduce = function(ruleIndex) {
    return function(token, type) {
      let rule = rules[ruleIndex-1];
      curNodes = nodeStack.splice(-rule.rightCount, rule.rightCount);
      stack.splice(-rule.rightCount, rule.rightCount)
      input.push({ content: '', type: rule.left });
    };
  };

  let goto = function(newState) {
    return function(token, type) {
      let node = new TrunkNode(type, curNodes);
      nodes.push(node);
      nodeStack.push(node);
      stack.push(parseTable[newState]);
      return true;
    };
  };

  let accept = function() {
    return function(token, type) {
      curNodes = nodeStack.splice(-1, 1);
      let node = new TrunkNode(type, curNodes);
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

  let processToken = function(token) {
    input = [token];
    while (input.length) {
      let symbol = input[input.length-1];
      let top = stack[stack.length-1];
      if (top[symbol.type](symbol.content, symbol.type)) {
        input.pop();
      }
    }
  };

  return thru.obj(function(chunk, encoding, done) {
    processToken(chunk);
    done();
  }, function(done) {
    processToken({ content: '', type: '$' });
    this.push(nodes);
    done();
  });
};

export default parser;

`;
}
