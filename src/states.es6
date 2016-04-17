
let StatesModule = {

  createClass: function(State) {

    let States = function(simpleRules) {

      let states = [new State().addTerm(simpleRules.createStartTerm())];
    };

    return States;
  }

};

export default StatesModule;
