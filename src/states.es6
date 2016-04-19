
let StatesModule = {

  createClass: function(State) {

    let States = function(simpleRules) {

      let states = [];

      let selectorIndex = {};

      this.addState = function(selector) {
        console.log('add state')
        let state = new State(states.length);
        states.push(state);
        selectorIndex[selector] = state;
        return state;
      };

      this.findBySelector = function(selector) {
        return selectorIndex[selector];
      };

      this.debugPrint = function() {
        states.forEach((state, index) => {
          console.log('I'+index);
          state.debugPrint();
        });
      };

      let startTerm = simpleRules.createStartTerm();
      this.addState('FOO').addUniqueTerms(startTerm);

      let index = 0; while (index < states.length) {
        states[index].expand(this, simpleRules);
        index++;
      }
    };

    return States;
  }

};

export default StatesModule;
