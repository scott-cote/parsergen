'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var StateModule = {

  createClass: function createClass(Term) {

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

      this.generateFirstTable = function () {
        var _this = this;

        var getFirstSetFor = void 0;

        var getFirstForRule = function getFirstForRule(rule) {
          return rule.right.reduce(function (cntx, element) {
            if (!cntx.done) {
              var _first = getFirstSetFor(element.symbol);
              if (!_first.canBeEmpty) {
                cntx.done = true;
                cntx.canBeEmpty = false;
              }
              cntx.symbols = cntx.symbols.concat(_first);
            }
            return cntx;
          }, { done: false, canBeEmpty: true, symbols: [] });
        };

        var generateFirstSetFor = function generateFirstSetFor(symbol) {
          var result = { canBeEmpty: false, symbols: [] };
          if (code.terminals.has(symbol)) {
            result.symbols.push(symbol);
          } else {
            code.rules.filter(function (rule) {
              return rule.left === symbol;
            }).forEach(function (rule) {
              if (rule.right.length === 0) {
                result.canBeEmpty = true;
              } else {
                var _first2 = getFirstForRule(rule);
                if (_first2.canBeEmpty) result.canBeEmpty = true;
                result.symbols = result.symbols.concat(_first2.symbols);
              }
            });
          }
          return this.firstTable[symbol] = result;
        };

        getFirstSetFor = function getFirstSetFor(symbol) {
          return this.firstTable[symbol] || generateFirstSetFor(symbol);
        };

        this.firstTable = {};
        code.symbols.forEach(function (symbol) {
          _this.firstTable[symbol] = getFirstSetFor(symbol);
        });
      };

      var first = {};

      this.getFirstFor = function (symbol) {
        var self = this;
        if (!first[symbol]) {
          if (code.terminals.has(symbol)) {
            first[symbol] = [symbol];
          } else {
            first[symbol] = [].concat(_toConsumableArray(new Set(code.rules.filter(function (rule) {
              return symbol === rule.left && symbol !== rule.right[0].symbol;
            }).reduce(function (value, rule) {
              return value.concat(self.getFirstFor(rule.right[0].symbol));
            }, []))));
          }
        }

        console.log(symbol + ' - ' + first[symbol] + ' ' + code.testFirstTable[symbol].symbols);
        return first[symbol];
      };

      var createTermsFor = function createTermsFor(symbol) {
        return code.rules.filter(function (rule) {
          return rule.left === symbol;
        }).map(function (rule) {
          return new Term(rule.id, rule.left, [], rule.right);
        });
      };

      var completeState = function completeState() {

        if (stateComplete) return;

        var termIndex = {};

        var expandTerm = function expandTerm(term) {
          var symbol = term.getRightNonterminal();
          if (symbol) {
            var newTerms = createTermsFor(symbol).filter(function (term) {
              return !termIndex[term.getId()];
            });
            newTerms.forEach(function (term) {
              return termIndex[term.getId()] = true;
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
          return !!term.getRightSymbol();
        }).forEach(function (term) {
          return symbolLookup[term.getRightSymbol()] = true;
        });
      };

      this.getRootTermsFor = function (symbol) {
        completeState();
        createSymbolLookup();
        if (!symbolLookup[symbol]) return [];
        return terms.filter(function (term) {
          return symbol === term.getRightSymbol();
        }).map(function (term) {
          return term.createShiftTerm();
        });
      };

      this.setGotoFor = function (symbol, value) {
        terms.filter(function (term) {
          return symbol === term.getRightSymbol();
        }).forEach(function (term) {
          return term.setGoto(value);
        });
      };

      this.debugPrint = function () {
        terms.forEach(function (term) {
          return term.debugPrint();
        });
      };

      this.createRow = function () {
        var _this2 = this;

        var row = {};
        terms.filter(function (term) {
          return term.getRightNonterminal();
        }).forEach(function (term) {
          row[term.getRightNonterminal()] = 'goto(' + term.getGoto() + ')';
        });
        terms.filter(function (term) {
          return term.getRightTerminal();
        }).forEach(function (term) {
          var terminal = term.getRightTerminal();
          if (terminal === '$') {
            row[terminal] = 'accept()';
          } else {
            row[terminal] = 'shift(' + term.getGoto() + ')';
          }
        });
        terms.filter(function (term) {
          return !term.getRightSymbol();
        }).forEach(function (term) {
          //row['follow '+term.getLeft()] = 'r('+term.getRule()+')';
          var follow = _this2.getFollowFor(term.getLeft());
          follow.forEach(function (symbol) {
            row[symbol] = 'reduce(' + term.getRule() + ')';
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