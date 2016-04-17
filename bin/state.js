"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StateModule = {

  createClass: function createClass() {

    var State = function State() {

      var terms = [];

      this.addTerm = function (term) {
        terms.push(term);
        return this;
      };
    };

    return State;
  }

};

exports.default = StateModule;