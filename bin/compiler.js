'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var through2 = require('through2');

var compiler = function compiler() {
  /*
  let getRulesRoot = function() {
    let root = nodes[nodes.length-1];
    return nodes[root.children[0]];
  };
   let compileLeft = function(current) {
    let ident = nodes[current.children[0]];
    return ident.contents;
  };
   let compileRight = function(current) {
    if (current.type === 'RIGHT') {
      return current.children
        .map(id => compileRight(nodes[id]))
        .reduce((value, elements) => value.concat(elements), []);
    } else {
      return current.contents;
    }
  };
   let compileRule = function(current) {
    let left = nodes[current.children[0]];
    let right = nodes[current.children[2]];
    return { left: compileLeft(left), right: compileRight(right) };
  };
   let compileRules = function(current) {
    if (current.type === 'RULES') {
      return current.children
        .map(id => compileRules(nodes[id]))
        .reduce((value, rules) => value.concat(rules), []);
    } else {
      return compileRule(current);
    }
  };
   let root = getRulesRoot();
   return compileRules(root);
  */

  return through2.obj(function (chunk, encoding, callback) {
    this.push(JSON.stringify(chunk) + '\n');
    callback();
  });
};

exports.default = compiler;