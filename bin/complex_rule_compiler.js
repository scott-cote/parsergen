'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var compiler = function compiler() {

  var compile = function compile(ast) {

    var getRulesRoot = function getRulesRoot() {
      var root = ast[ast.length - 1];
      return ast[root.children[0]];
    };

    var compileLeft = function compileLeft(current) {
      var ident = ast[current.children[0]];
      return ident.contents;
    };

    var compileRight = function compileRight(current) {
      if (current.type === 'RIGHT') {
        return current.children.map(function (id) {
          return compileRight(ast[id]);
        }).reduce(function (value, elements) {
          return value.concat(elements);
        }, []);
      } else {
        return current.contents;
      }
    };

    var compileRule = function compileRule(current) {
      var left = ast[current.children[0]];
      var right = ast[current.children[2]];
      return { left: compileLeft(left), right: compileRight(right) };
    };

    var compileRules = function compileRules(current) {
      if (current.type === 'RULES') {
        return current.children.map(function (id) {
          return compileRules(ast[id]);
        }).reduce(function (value, rules) {
          return value.concat(rules);
        }, []);
      } else {
        return compileRule(current);
      }
    };

    var root = getRulesRoot();

    var code = { complexRules: compileRules(root) };

    return code;
  };

  return thru.obj(function (ast, encoding, done) {
    this.push(compile(ast));
    done();
  });
};

exports.default = compiler;