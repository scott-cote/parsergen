'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
  return new Transformer();
};

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var compiler = function compiler() {
  return thru.obj(function (code, encoding, done) {

    var compile = function compile(code) {

      code.rules = [{
        left: code.complexRules[0].left + "'",
        right: [code.complexRules[0].left, '$']
      }].concat(code.complexRules);

      code.nonterminals = new Set(code.rules.map(function (rule) {
        return rule.left;
      }));

      code.terminals = new Set(code.rules.map(function (rule) {
        return rule.right;
      }).reduce(function (value, symbols) {
        return value.concat(symbols);
      }, []).filter(function (symbol) {
        return !code.nonterminals.has(symbol);
      }));

      code.symbols = new Set([].concat(_toConsumableArray(code.nonterminals), _toConsumableArray(code.terminals)));

      code.rules = code.rules.map(function (rule, index) {
        return {
          id: index,
          left: rule.left,
          right: rule.right.map(function (symbol) {
            return {
              symbol: symbol,
              type: code.terminals.has(symbol) ? 'TERMINAL' : 'NONTERMINAL'
            };
          })
        };
      });

      return code;
    };

    this.push(compile(code));
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
      console.log('trans');
      //done(null, code);
    }
  }, {
    key: '_flush',
    value: function _flush(done) {
      console.log('flush');
      done();
    }
  }]);

  return Transformer;
}(_stream2.default.Transform);

;
;