'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StateModule = {

  createClass: function createClass() {

    var State = function State(id, simpleRules, rootTerms) {

      var terms = [].concat(rootTerms);

      var stateComplete = false;

      var symbolLookup = void 0;

      var completeState = function completeState() {

        if (stateComplete) return;

        var termIndex = {};

        var expandTerm = function expandTerm(term) {
          var symbol = term.getRightNonterminal();
          if (symbol) {
            var newTerms = simpleRules.createTermsFor(symbol).filter(function (term) {
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
          var follow = simpleRules.getFollowFor(term.getLeft());
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