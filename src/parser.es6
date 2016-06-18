
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
      let rule = rules[ruleIndex];
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
    {"left":"RULES'","rightCount":2},
    {"left":"RULES","rightCount":2},
    {"left":"RULES","rightCount":1},
    {"left":"RULE","rightCount":4},
    {"left":"LEFT","rightCount":1},
    {"left":"RIGHT","rightCount":2},
    {"left":"RIGHT","rightCount":1}
  ];

  parseTable = [
    { "RULES": goto(1),"RULE": goto(2),"LEFT": goto(3),"TOKEN_IDENTIFIER": shift(4) },
    { "RULE": goto(5),"LEFT": goto(3),"$": accept(),"TOKEN_IDENTIFIER": shift(4) },
    { "$": reduce(2),"TOKEN_IDENTIFIER": reduce(2) },
    { "TOKEN_ROCKET": shift(6) },
    { "TOKEN_ROCKET": reduce(4) },
    { "$": reduce(1),"TOKEN_IDENTIFIER": reduce(1) },
    { "RIGHT": goto(7),"TOKEN_IDENTIFIER": shift(8) },
    { "TOKEN_SEMICOLON": shift(9),"TOKEN_IDENTIFIER": shift(10) },
    { "TOKEN_SEMICOLON": reduce(6),"TOKEN_IDENTIFIER": reduce(6) },
    { "$": reduce(3),"TOKEN_IDENTIFIER": reduce(3) },
    { "TOKEN_SEMICOLON": reduce(5),"TOKEN_IDENTIFIER": reduce(5) }
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
    console.log(JSON.stringify(chunk))
    processToken(chunk);
    done();
  }, function(done) {
    processToken({ content: '', type: '$' });
    this.push(nodes);
    done();
  });
};

export default parser;
