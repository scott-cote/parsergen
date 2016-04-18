
let StatesModule = {

  createClass: function(State) {

    let States = function(simpleRules) {

      let states = [];

      let selectorIndex = {};

      this.addState = function(selector) {
        let state = new State();
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
      let selector = startTerm.getRightToken();
      this.addState(selector).addUniqueTerms(startTerm);

      let index = 0; while (index < states.length) {
        states[index].expand(this);
        index++;
      }
    };

    return States;
  }

};

export default StatesModule;
