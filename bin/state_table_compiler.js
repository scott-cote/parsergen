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

  var setGotoFor = function setGotoFor(state, symbol, value) {
    state.terms.filter(function (term) {
      return symbol === getRightSymbol(term);
    }).forEach(function (term) {
      return term.goto = value;
    });
    Object.keys(state.row).forEach(function (key) {
      var item = state.row[key];
      if (symbol === item.symbol && (item.operation === 'shift' || item.operation === 'goto')) {
        item.value = value;
      }
    });
  };

  var createShiftTerm = function createShiftTerm(term) {
    var newMiddle = term.right[0] ? term.middle.concat(term.right[0]) : term.middle;
    return { rule: term.rule, left: term.left, middle: newMiddle, right: term.right.slice(1) };
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
      //state.terms = state.terms.concat(newTerms);
      newTerms.forEach(function (term) {
        return addTerm(state, term);
      });
    }
  };

  var completeState = function completeState(state) {
    var termIndex = {};
    var index = 0;while (index < state.terms.length) {
      expandTerm(state, termIndex, state.terms[index]);
      index++;
    }
  };

  var getSeedTermsFor = function getSeedTermsFor(state, symbol) {
    return state.terms.filter(function (term) {
      return symbol === getRightSymbol(term);
    }).map(function (term) {
      return createShiftTerm(term);
    });
  };

  var getFollowFor = function getFollowFor(state, nonterminal) {
    var self = this;
    if (!follow[nonterminal]) {
      var allFollow = code.rules.reduce(function (outterValue, rule) {
        outterValue = outterValue.concat(rule.right.reduce(function (value, token, index, array) {
          if (nonterminal === token.symbol) {
            if (index < array.length - 1) {
              var newVal = getFirstFor(array[index + 1].symbol);
              return value.concat(newVal);
            } else {
              var _newVal = getFollowFor(self, rule.left);
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

  var addTerm = function addTerm(state, term) {
    state.terms.push(term);
    var nonterminal = getRightNonterminal(term);
    if (!!nonterminal) {
      state.row[nonterminal] = { operation: 'goto', symbol: getRightSymbol(term) }; // `goto(${term.goto})`;
      return;
    }
    var terminal = getRightTerminal(term);
    if (!!terminal) {
      if (terminal === '$') {
        state.row[terminal] = { operation: 'accept' }; // 'accept()';
      } else {
          state.row[terminal] = { operation: 'shift', symbol: getRightSymbol(term) }; // 'shift('+term.goto+')';
        }
      return;
    };
    if (!getRightSymbol(term)) {
      getFollowFor(state, term.left).forEach(function (symbol) {
        state.row[symbol] = { operation: 'reduce', value: term.rule }; // 'reduce('+term.rule+')';
      });
      return;
    };
  };

  var createState = function createState(seedTerms) {
    var state = { row: {}, terms: [] };
    seedTerms.forEach(function (term) {
      return addTerm(state, term);
    });
    return state;
  };

  var spawnStates = function spawnStates(state, states, stateCache) {
    code.symbols.forEach(function (symbol) {
      if (symbol === '$') return;
      var seedTerms = getSeedTermsFor(state, symbol);
      if (seedTerms.length) {
        var id = seedTerms.map(function (term) {
          return getId(term);
        }).sort().join();
        var stateIndex = stateCache[id] || states.length;
        if (stateIndex === states.length) {
          stateCache[id] = stateIndex;
          states.push(createState(seedTerms));
        }
        setGotoFor(state, symbol, stateIndex);
      }
    });
  };

  code.states = [];

  var stateCache = {};

  var rule = code.rules[0];
  code.states.push(createState([{ rule: rule.id, left: rule.left, middle: [], right: rule.right }]));

  var index = 0;while (index < code.states.length) {
    var state = code.states[index];
    completeState(state);
    spawnStates(state, code.states, stateCache);
    index++;
  }

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