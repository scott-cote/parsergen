'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var StateModule = {

  createClass: function createClass(Term) {
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

      var terms = [].concat(rootTerms);

      var stateComplete = false;

      var symbolLookup = void 0;

      var follow = {};

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
            terms = terms.concat(newTerms);
          }
        };

        var index = 0;while (index < terms.length) {
          expandTerm(terms[index]);
          index++;
        }

        stateComplete = true;
      };

      var createSymbolLookup = function createSymbolLookup() {
        if (symbolLookup) return;
        symbolLookup = {};
        terms.filter(function (term) {
          return !!getRightSymbol(term);
        }).forEach(function (term) {
          return symbolLookup[getRightSymbol(term)] = true;
        });
      };

      this.getRootTermsFor = function (symbol) {

        var createShiftTerm = function createShiftTerm(term) {
          var newMiddle = term.right[0] ? term.middle.concat(term.right[0]) : term.middle;
          return { rule: term.rule, left: term.left, middle: newMiddle, right: term.right.slice(1) };
        };

        completeState();
        createSymbolLookup();
        if (!symbolLookup[symbol]) return [];
        return terms.filter(function (term) {
          return symbol === getRightSymbol(term);
        }).map(function (term) {
          return createShiftTerm(term);
        });
      };

      this.setGotoFor = function (symbol, value) {
        terms.filter(function (term) {
          return symbol === getRightSymbol(term);
        }).forEach(function (term) {
          return term.goto = value;
        });
      };

      this.debugPrint = function () {
        terms.forEach(function (term) {
          return term.debugPrint();
        });
      };

      this.createRow = function () {
        var _this = this;

        var row = {};
        terms.filter(function (term) {
          return getRightNonterminal(term);
        }).forEach(function (term) {
          row[getRightNonterminal(term)] = 'goto(' + term.goto + ')';
        });
        terms.filter(function (term) {
          return getRightTerminal(term);
        }).forEach(function (term) {
          var terminal = getRightTerminal(term);
          if (terminal === '$') {
            row[terminal] = 'accept()';
          } else {
            row[terminal] = 'shift(' + term.goto + ')';
          }
        });
        terms.filter(function (term) {
          return !getRightSymbol(term);
        }).forEach(function (term) {
          //row['follow '+term.getLeft()] = 'r('+term.getRule()+')';
          var follow = _this.getFollowFor(term.left);
          follow.forEach(function (symbol) {
            row[symbol] = 'reduce(' + term.rule + ')';
          });
        });
        return row;
      };

      this.render = function () {
        var row = this.createRow();
        var values = Object.keys(row).map(function (key) {
          return '"' + key + '": ' + row[key];
        }).join();
        return '{ ' + values + ' }';
      };
    };

    return State;
  }
};

exports.default = StateModule;