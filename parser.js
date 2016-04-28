

var Parser = function(error) {

  var rules, parseTable, input, stack;

  var nodes = [];

  var LeafNode = function() {

  };

  var TrunkNode = function() {

  };

  var shift = function(newState) {
    return function(token, type) {
      var top = stack[stack.length-1];
      stack.push(parseTable[newState]);
      nodes.push(new LeafNode());
      return true;
    };
  };

  var reduce = function(ruleIndex) {
    return function(token, type) {
      var top = stack[stack.length-1];
      var rule = rules[ruleIndex-1];
      stack.splice(-rule.rightCount, rule.rightCount)
      top = stack[stack.length-1];
      input.push({ content: '', type: rule.left });
    };
  };

  var goto = function(newState) {
    return function(token, type) {
      var top = stack[stack.length-1];
      stack.push(parseTable[newState]);
      nodes.push(new TrunkNode())
      return true;
    };
  };

  var accept = function() {
    return function(token, type) {
      nodes.push(new TrunkNode())
      return true;
    };
  }

  rules = [
    { left: 'RULES', rightCount: 2 }, // RULES -> RULES RULE;
    { left: 'RULES', rightCount: 1 }, // RULES -> RULE;
    { left: 'RULE', rightCount: 4 }, // RULE -> LEFT TOKEN_ROCKET RIGHT TOKEN_SEMICOLON;
    { left: 'LEFT', rightCount: 1 }, // LEFT -> TOKEN_IDENTIFIER;
    { left: 'RIGHT', rightCount: 2 }, // RIGHT -> RIGHT TOKEN_IDENTIFIER;
    { left: 'RIGHT', rightCount: 1 } // RIGHT -> TOKEN_IDENTIFIER;
  ];

  parseTable = [
    {"RULES":goto(2),"RULE":goto(3),"LEFT":goto(4),"TOKEN_IDENTIFIER":shift(1),"state":0},
    {"TOKEN_ROCKET":reduce(4),"state":1},
    {"RULE":goto(5),"LEFT":goto(4),"$":accept(),"TOKEN_IDENTIFIER":shift(1),"state":2},
    {"$":reduce(2),"TOKEN_IDENTIFIER":reduce(2),"state":3},
    {"TOKEN_ROCKET":shift(6),"state":4},
    {"$":reduce(1),"TOKEN_IDENTIFIER":reduce(1),"state":5},
    {"RIGHT":goto(8),"TOKEN_IDENTIFIER":shift(7),"state":6},
    {"TOKEN_SEMICOLON":reduce(6),"TOKEN_IDENTIFIER":reduce(6),"state":7},
    {"TOKEN_SEMICOLON":shift(9),"TOKEN_IDENTIFIER":shift(10),"state":8},
    {"$":reduce(3),"TOKEN_IDENTIFIER":reduce(3),"state":9},
    {"TOKEN_SEMICOLON":reduce(5),"TOKEN_IDENTIFIER":reduce(5),"state":10}
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
  }
};

exports.default = Parser;

