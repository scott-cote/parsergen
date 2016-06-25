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

var _state = require('./state.js');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var State = _state2.default.createClass();

var generateStates = function generateStates(code) {

  var states = [];

  var rootTermsState = {};

  var getId = function getId(term) {
    return term.left + '>' + term.middle.map(function (element) {
      return element.symbol;
    }).join(':') + '.' + term.right.map(function (element) {
      return element.symbol;
    }).join(':');
  };

  var getRootTerm = function getRootTerm() {
    var rule = code.rules[0];
    return { rule: rule.id, left: rule.left, middle: [], right: rule.right };
  };

  states.push(new State(0, code, getRootTerm()));

  var index = 0;while (index < states.length) {
    code.symbols.forEach(function (symbol) {
      if (symbol === '$') return;
      var rootTerms = states[index].getRootTermsFor(symbol);
      if (rootTerms.length) {
        var id = rootTerms.map(function (term) {
          return getId(term);
        }).sort().join();
        var state = rootTermsState[id] || states.length;
        if (state === states.length) {
          rootTermsState[id] = state;
          states.push(new State(states.length, code, rootTerms));
        }
        states[index].setGotoFor(symbol, state);
      }
    });
    index++;
  }

  return states;
};

var Transformer = function (_Stream$Transform) {
  _inherits(Transformer, _Stream$Transform);

  function Transformer() {
    _classCallCheck(this, Transformer);

    console.log('gen start');
    return _possibleConstructorReturn(this, Object.getPrototypeOf(Transformer).call(this, { objectMode: true }));
  }

  _createClass(Transformer, [{
    key: '_transform',
    value: function _transform(code, encoding, done) {
      console.log('Running generator');
      code.states = generateStates(code);
      return done(null, code);
    }
  }]);

  return Transformer;
}(_stream2.default.Transform);

;

;