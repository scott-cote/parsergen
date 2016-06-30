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

var State = function State(id, code, rootTerms) {

  var state = this;

  state.row = {};

  state.getRightNonterminal = getRightNonterminal;

  state.getRightTerminal = getRightTerminal;

  state.getRightSymbol = getRightSymbol;

  state.terms = [].concat(rootTerms);

  var stateComplete = false;

  var symbolLookup = void 0;

  var follow = {};

  state.createRow = function () {
    state.terms.filter(function (term) {
      return state.getRightNonterminal(term);
    }).forEach(function (term) {
      state.row[state.getRightNonterminal(term)] = 'goto(' + term.goto + ')';
    });
    state.terms.filter(function (term) {
      return state.getRightTerminal(term);
    }).forEach(function (term) {
      var terminal = state.getRightTerminal(term);
      if (terminal === '$') {
        state.row[terminal] = 'accept()';
      } else {
        state.row[terminal] = 'shift(' + term.goto + ')';
      }
    });
    state.terms.filter(function (term) {
      return !state.getRightSymbol(term);
    }).forEach(function (term) {
      //row['follow '+term.getLeft()] = 'r('+term.getRule()+')';
      var follow = state.getFollowFor(term.left);
      follow.forEach(function (symbol) {
        state.row[symbol] = 'reduce(' + term.rule + ')';
      });
    });
    return state.row;
  };

  this.getFollowFor = function (nonterminal) {
    var self = this;
    if (!follow[nonterminal]) {
      var allFollow = code.rules.reduce(function (outterValue, rule) {
        outterValue = outterValue.concat(rule.right.reduce(function (value, token, index, array) {
          if (nonterminal === token.symbol) {
            if (index < array.length - 1) {
              var newVal = self.getFirstFor(array[index + 1].symbol);
              return value.concat(newVal);
            } else {
              var _newVal = self.getFollowFor(rule.left);
              return value.concat(_newVal);
            }
          }
          return value;
        }, []));
        return outterValue;
      }, []);
      follow[nonterminal] = [].concat(_toConsumableArray(new Set(allFollow)));
    }
    //console.log(nonterminal+': '+JSON.stringify(Array.from(code.followTable[nonterminal]))+' vs '+JSON.stringify(follow[nonterminal]));
    return follow[nonterminal];
  };

  this.getFirstFor = function (symbol) {
    return Array.from(code.firstTable[symbol].symbols);
  };

  var createTermsFor = function createTermsFor(symbol) {
    return code.rules.filter(function (rule) {
      return rule.left === symbol;
    }).map(function (rule) {
      return { rule: rule.id, left: rule.left, middle: [], right: rule.right };
    });
  };

  var completeState = function completeState() {

    if (stateComplete) return;

    var termIndex = {};

    var expandTerm = function expandTerm(term) {
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

    var index = 0;while (index < state.terms.length) {
      expandTerm(state.terms[index]);
      index++;
    }

    stateComplete = true;
  };

  var createSymbolLookup = function createSymbolLookup() {
    if (symbolLookup) return;
    symbolLookup = {};
    state.terms.filter(function (term) {
      return !!getRightSymbol(term);
    }).forEach(function (term) {
      return symbolLookup[getRightSymbol(term)] = true;
    });
  };

  this.getSeedTermsFor = function (symbol) {

    var createShiftTerm = function createShiftTerm(term) {
      var newMiddle = term.right[0] ? term.middle.concat(term.right[0]) : term.middle;
      return { rule: term.rule, left: term.left, middle: newMiddle, right: term.right.slice(1) };
    };

    completeState();
    createSymbolLookup();
    if (!symbolLookup[symbol]) return [];
    return state.terms.filter(function (term) {
      return symbol === getRightSymbol(term);
    }).map(function (term) {
      return createShiftTerm(term);
    });
  };

  this.setGotoFor = function (symbol, value) {
    state.terms.filter(function (term) {
      return symbol === getRightSymbol(term);
    }).forEach(function (term) {
      return term.goto = value;
    });
  };
};

var generateStates = function generateStates(code) {

  var states = [];

  var rootTermsState = {};

  /*
  let getId = function(term) {
    return term.left+'>'+term.middle.map(element => element.symbol).join(':')+'.'+term.right.map(element => element.symbol).join(':');
  };
  */

  var getRootTerm = function getRootTerm() {
    var rule = code.rules[0];
    return { rule: rule.id, left: rule.left, middle: [], right: rule.right };
  };

  states.push(new State(0, code, getRootTerm()));

  var index = 0;while (index < states.length) {
    code.symbols.forEach(function (symbol) {
      if (symbol === '$') return;
      var seedTerms = states[index].getSeedTermsFor(symbol);
      if (seedTerms.length) {
        var id = seedTerms.map(function (term) {
          return getId(term);
        }).sort().join();
        var state = rootTermsState[id] || states.length;
        if (state === states.length) {
          rootTermsState[id] = state;
          states.push(new State(states.length, code, seedTerms));
        }
        states[index].setGotoFor(symbol, state);
      }
    });
    states[index].createRow();
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
      code.stateTable = code.states.map(function (state) {
        return state.row;
      });
      return done(null, code);
    }
  }]);

  return Transformer;
}(_stream2.default.Transform);

;

;