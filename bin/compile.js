'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var compile = function compile(nodes) {

  var getRulesRoot = function getRulesRoot() {
    var root = nodes[nodes.length - 1];
    return nodes[root.children[0]];
  };

  var compileLeft = function compileLeft(current) {
    var ident = nodes[current.children[0]];
    return ident.contents;
  };

  var compileRight = function compileRight(current) {
    if (current.type === 'RIGHT') {
      return current.children.map(function (id) {
        return compileRight(nodes[id]);
      }).reduce(function (value, elements) {
        return value.concat(elements);
      }, []);
    } else {
      return current.contents;
    }
  };

  var compileRule = function compileRule(current) {
    var left = nodes[current.children[0]];
    var right = nodes[current.children[2]];
    return { left: compileLeft(left), right: compileRight(right) };
  };

  var compileRules = function compileRules(current) {
    if (current.type === 'RULES') {
      return current.children.map(function (id) {
        return compileRules(nodes[id]);
      }).reduce(function (value, rules) {
        return value.concat(rules);
      }, []);
    } else {
      return compileRule(current);
    }
  };

  var root = getRulesRoot();

  return compileRules(root);
};

exports.default = compile;