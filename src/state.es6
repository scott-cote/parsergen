
let StateModule = {

  createClass: function() {

    let State = function() {

      let terms = [];

      this.addTerm = function(term) {
        terms.push(term);
        return this;
      }
    };

    return State;
  }

};

export default StateModule;
