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

var compile = function compile(code) {

  var follow = {};

  var getFirstFor = function getFirstFor(symbol) {
    return Array.from(code.firstTable[symbol].symbols);
  };

  var getId = function getId(term) {
    return term.left + '>' + term.middle.map(function (element) {
      return element.symbol;
    }).join(':') + '.' + term.right.map(function (element) {
      return element.symbol;
    }).join(':');
  };

  var getRightNonterminal = function getRightNonterminal(term) {
    var token = term.right[0];
    if (token && token.type === 'NONTERMINAL') return token.symbol;
  };

  var getRightSymbol = function getRightSymbol(term) {
    if (term.right[0]) return term.right[0].symbol;
  };

  var getRightTerminal = function getRightTerminal(term) {
    var token = term.right[0];
    if (token && token.type === 'TERMINAL') return token.symbol;
  };

  var createRow = function createRow(state) {
    state.terms.filter(function (term) {
      return getRightNonterminal(term);
    }).forEach(function (term) {
      state.row[getRightNonterminal(term)] = 'goto(' + term.goto + ')';
    });
    state.terms.filter(function (term) {
      return getRightTerminal(term);
    }).forEach(function (term) {
      var terminal = getRightTerminal(term);
      if (terminal === '$') {
        state.row[terminal] = 'accept()';
      } else {
        state.row[terminal] = 'shift(' + term.goto + ')';
      }
    });
    state.terms.filter(function (term) {
      return !getRightSymbol(term);
    }).forEach(function (term) {
      var follow = getFollowFor(code, state, term.left);
      follow.forEach(function (symbol) {
        state.row[symbol] = 'reduce(' + term.rule + ')';
      });
    });
    return state.row;
  };

  var setGotoFor = function setGotoFor(state, symbol, value) {
    state.terms.filter(function (term) {
      return symbol === getRightSymbol(term);
    }).forEach(function (term) {
      return term.goto = value;
    });
  };

  var createShiftTerm = function createShiftTerm(term) {
    var newMiddle = term.right[0] ? term.middle.concat(term.right[0]) : term.middle;
    return { rule: term.rule, left: term.left, middle: newMiddle, right: term.right.slice(1) };
  };

  var createSymbolLookup = function createSymbolLookup(state) {
    if (state.symbolLookup) return;
    state.symbolLookup = {};
    state.terms.filter(function (term) {
      return !!getRightSymbol(term);
    }).forEach(function (term) {
      return state.symbolLookup[getRightSymbol(term)] = true;
    });
  };

  var createTermsFor = function createTermsFor(symbol) {
    return code.rules.filter(function (rule) {
      return rule.left === symbol;
    }).map(function (rule) {
      return { rule: rule.id, left: rule.left, middle: [], right: rule.right };
    });
  };

  var expandTerm = function expandTerm(state, termIndex, term) {
    var symbol = getRightNonterminal(term);
    if (symbol) {
      var newTerms = createTermsFor(symbol).filter(function (term) {
        return !termIndex[getId(term)];
      });
      newTerms.forEach(function (term) {
        return termIndex[getId(term)] = true;
      });
      state.terms = state.terms.concat(newTerms);
    }
  };

  var completeState = function completeState(code, state) {

    if (state.stateComplete) return;

    var termIndex = {};

    var index = 0;while (index < state.terms.length) {
      expandTerm(state, termIndex, state.terms[index]);
      index++;
    }

    state.stateComplete = true;
  };

  var getSeedTermsFor = function getSeedTermsFor(code, state, symbol) {
    if (!state.symbolLookup[symbol]) return [];
    return state.terms.filter(function (term) {
      return symbol === getRightSymbol(term);
    }).map(function (term) {
      return createShiftTerm(term);
    });
  };

  var getFollowFor = function getFollowFor(code, state, nonterminal) {
    var self = this;
    if (!follow[nonterminal]) {
      var allFollow = code.rules.reduce(function (outterValue, rule) {
        outterValue = outterValue.concat(rule.right.reduce(function (value, token, index, array) {
          if (nonterminal === token.symbol) {
            if (index < array.length - 1) {
              var newVal = getFirstFor(array[index + 1].symbol);
              return value.concat(newVal);
            } else {
              var _newVal = getFollowFor(code, self, rule.left);
              return value.concat(_newVal);
            }
          }
          return value;
        }, []));
        return outterValue;
      }, []);
      follow[nonterminal] = [].concat(_toConsumableArray(new Set(allFollow)));
    }
    return follow[nonterminal];
  };

  var State = function State(id, code, rootTerms) {

    var state = this;

    state.row = {};

    state.terms = [].concat(rootTerms);

    state.stateComplete = false;

    state.symbolLookup;
  };

  var generateStates = function generateStates(code) {

    var states = [];

    var stateCache = {};

    var rule = code.rules[0];
    states.push(new State(0, code, { rule: rule.id, left: rule.left, middle: [], right: rule.right }));

    var index = 0;while (index < states.length) {
      var state = states[index];
      completeState(code, state);
      createSymbolLookup(state);
      code.symbols.forEach(function (symbol) {
        if (symbol === '$') return;
        var seedTerms = getSeedTermsFor(code, states[index], symbol);
        if (seedTerms.length) {
          var id = seedTerms.map(function (term) {
            return getId(term);
          }).sort().join();
          var _state = stateCache[id] || states.length;
          if (_state === states.length) {
            stateCache[id] = _state;
            states.push(new State(states.length, code, seedTerms));
          }
          setGotoFor(states[index], symbol, _state);
        }
      });
      createRow(states[index]);
      index++;
    }

    return states;
  };

  code.states = generateStates(code);
  code.stateTable = code.states.map(function (state) {
    return state.row;
  });
  return code;
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
      try {
        done(null, compile(code));
      } catch (err) {
        done(err);
      }
    }
  }]);

  return Transformer;
}(_stream2.default.Transform);

;

;