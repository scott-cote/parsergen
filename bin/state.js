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

      this.getFirstFor = function (symbol) {
        return code.testFirstTable[symbol].symbols;
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
        var _this = this;

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
          var follow = _this.getFollowFor(term.getLeft());
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