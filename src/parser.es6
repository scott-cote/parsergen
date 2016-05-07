

var through2 = require('through2');

var parser = function parser() {

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
    {"left":"RULES","rightCount":2},
{"left":"RULES","rightCount":1},
{"left":"RULE","rightCount":4},
{"left":"LEFT","rightCount":1},
{"left":"RIGHT","rightCount":2},
{"left":"RIGHT","rightCount":1}
  ];

  parseTable = [
    { "RULES": goto(2),"RULE": goto(3),"LEFT": goto(4),"TOKEN_IDENTIFIER": shift(1) },
{ "TOKEN_ROCKET": reduce(4) },
{ "RULE": goto(5),"LEFT": goto(4),"$": accept(),"TOKEN_IDENTIFIER": shift(1) },
{ "$": reduce(2),"TOKEN_IDENTIFIER": reduce(2) },
{ "TOKEN_ROCKET": shift(6) },
{ "$": reduce(1),"TOKEN_IDENTIFIER": reduce(1) },
{ "RIGHT": goto(8),"TOKEN_IDENTIFIER": shift(7) },
{ "TOKEN_SEMICOLON": reduce(6),"TOKEN_IDENTIFIER": reduce(6) },
{ "TOKEN_SEMICOLON": shift(9),"TOKEN_IDENTIFIER": shift(10) },
{ "$": reduce(3),"TOKEN_IDENTIFIER": reduce(3) },
{ "TOKEN_SEMICOLON": reduce(5),"TOKEN_IDENTIFIER": reduce(5) }
  ];

  stack = [parseTable[0]];

  var processToken = function(token) {
    input = [token];
    while (input.length) {
      var symbol = input[input.length-1];
      var top = stack[stack.length-1];
      if (top[symbol.type](symbol.content, symbol.type)) {
        input.pop();
      }
    }
  };

  return through2.obj(function(chunk, encoding, callback) {
    processToken(chunk);
    callback();
  }, function(callback) {
    processToken({ content: '', type: '$' });
    this.push(nodes);
    callback();
  });
};

export default parser;

