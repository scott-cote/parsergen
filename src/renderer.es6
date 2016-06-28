import Stream from 'stream';

let render = function(code) {

  let renderRuleTable = function() {
    return code.ruleTable.map(rule => JSON.stringify(rule)).join(',\n  ');
  };

  let renderState = function(state) {
    let values = Object.keys(state.row).map(key => {
      return `"${key}": ${state.row[key]}`;
    }).join();
    return `{ ${values} }`;
  };

  let renderStates = function() {
    return code.states.map(state => renderState(state)).join(',\n  ');
  };

  return `
import Stream from 'stream';

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
  ${renderRuleTable()}
];

parseTable = [
  ${renderStates()}
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

class Transformer extends Stream.Transform {

  constructor() {
    super({ objectMode: true });
  }

  _transform(token, encoding, done) {
    processToken(token);
    done();
  }

  _flush(done) {
    processToken({ content: '', type: '$' });
    this.push(nodes);
    done();
  }
};

export default function() {
  return new Transformer();
};

`;
};

class Transformer extends Stream.Transform {

  constructor() {
    console.log('render start')
    super({ objectMode : true });
  }

  _transform(code, encoding, done) {
    console.log('Running render');
    this.push(render(code));
    done();
  }
};

export default function() {
  return new Transformer();
};
