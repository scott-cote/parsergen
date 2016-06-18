'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
  return new Transformer();
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Transformer = function (_Stream$Transform) {
  _inherits(Transformer, _Stream$Transform);

  function Transformer() {
    _classCallCheck(this, Transformer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Transformer).call(this, { objectMode: true }));
  }

  _createClass(Transformer, [{
    key: '_transform',
    value: function _transform(code, encoding, done) {
      done(null, code);
    }
  }]);

  return Transformer;
}(Stream.Transform);

;

;