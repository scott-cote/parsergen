
var Parser = function() {

  var rules, parseTable, stack;

  var shift = function(newState) {
    return function(token, type) {
      var top = stack[stack.length-1];
      console.log('in state: '+top.state);
      console.log('encountered '+type);
      console.log('shift to '+newState);
      stack.push(parseTable[newState]);
      return true;
    };
  };

  var reduce = function(ruleIndex) {
    return function(token, type) {
      var top = stack[stack.length-1];
      console.log('in state: '+top.state);
      console.log('encountered '+type);
      console.log('reduce using rule '+ruleIndex);
    };
  };

  var goto = function(newState) {
    return function(token, type) {
      var top = stack[stack.length-1];
      console.log('in state: '+top.state);
      console.log('encountered '+type);
      console.log('goto '+ruleIndex);
    };
  };

  rules = [
    { left: 'RULES', rightCount: 2 }, // RULES -> RULES RULE;
    { left: 'RULES', rightCount: 1 }, // RULES -> RULE;
    { left: 'RULE', rightCount: 4 }, // RULE -> LEFT TOKEN_ROCKET RIGHT TOKEN_SEMICOLON;
    { left: 'LEFT', rightCount: 1 }, // LEFT -> TOKEN_IDENTIFIER;
    { left: 'RIGHT', rightCount: 2 }, // RIGHT -> RIGHT TOKEN_IDENTIFIER;
    { right: 'RIGHT', rightCount: 1 } // RIGHT -> TOKEN_IDENTIFIER;
  ];

  parseTable = [
    {"RULES":goto(2),"RULE":goto(3),"LEFT":goto(4),"TOKEN_IDENTIFIER":shift(1),"state":0},
    {"TOKEN_ROCKET":reduce(4),"state":1},
    {"RULE":goto(5),"LEFT":goto(4),"$":accept(),"TOKEN_IDENTIFIER":shift(1),"state":2},
    {"$":r(2),"TOKEN_IDENTIFIER":r(2),"state":3},
    {"TOKEN_ROCKET":s(6),"state":4},
    {"$":r(1),"TOKEN_IDENTIFIER":r(1),"state":5},
    {"RIGHT":8,"TOKEN_IDENTIFIER":"s(7)","state":6},
    {"TOKEN_SEMICOLON":"r(6)","TOKEN_IDENTIFIER":"r(6)","state":7},
    {"TOKEN_SEMICOLON":"s(9)","TOKEN_IDENTIFIER":"s(10)","state":8},
    {"$":"r(3)","TOKEN_IDENTIFIER":"r(3)","state":9},
    {"TOKEN_SEMICOLON":"r(5)","TOKEN_IDENTIFIER":"r(5)","state":10}
  ];

  stack = [parseTable[0]];

  var error = function() {
    console.log('error')
  }

  this.processToken = function(token, type) {
    while(!(stack[stack.length-1][type]||error)(token, type));
  };

  this.end = function() {
    return { nodes: [] };
  }
};

exports.default = Parser;
