'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var through2 = require('through2');

var compiler = function compiler() {

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

  return through2.obj(function (chunk, encoding, callback) {
    this.push(compile(chunk));
    callback();
  });
};

exports.default = compiler;