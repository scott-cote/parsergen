'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TermModule = {

  createClass: function createClass() {

    var Term = function Term(left, middle, right) {

      var goto = void 0;

      this.getId = function () {
        return left + '>' + middle.map(function (element) {
          return element.symbol;
        }).join(':') + '.' + right.map(function (element) {
          return element.symbol;
        }).join(':');
      };

      this.getRightSymbol = function () {
        if (right[0]) return right[0].symbol;
      };

      this.getRightNonterminal = function () {
        var token = right[0];
        if (token && token.type === 'NONTERMINAL') return token.symbol;
      };

      this.createShiftTerm = function () {
        var newMiddle = right[0] ? middle.concat(right[0]) : middle;
        return new Term(left, newMiddle, right.slice(1));
      };

      this.setGoto = function (value) {
        goto = value;
      };

      this.debugPrint = function () {
        console.log(this.getId(), ' ', goto ? goto : '');
      };
    };

    return Term;
  }
};

exports.default = TermModule;