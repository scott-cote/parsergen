'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TermModule = {

  createClass: function createClass() {

    var Term = function Term(left, middle, right) {

      /*
      this.hasRight = function() {
        return right.length > 0;
      };
      */

      this.getId = function () {
        return left + ' -> ' + middle.map(function (element) {
          return element.symbol;
        }).join(' ') + ' . ' + right.map(function (element) {
          return element.symbol;
        }).join(' ');
      };

      this.getRightToken = function () {
        if (right[0]) return right[0].symbol;
      };

      this.getRightNonterminal = function () {
        var token = right[0];
        if (token && token.type === 'NONTERMINAL') return token.symbol;
      };

      this.createShiftTerm = function () {
        return new Term(left, middle.concat(right[0]), right.slice(1));
      };

      this.debugPrint = function () {
        console.log(this.getId());
      };
    };

    return Term;
  }
};

exports.default = TermModule;