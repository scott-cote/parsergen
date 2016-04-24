
let StatesModule = {

  createClass: function(State) {

    let States = function(simpleRules) {

      let states = [];

      let rootTermsState = {};

      this.debugPrint = function() {
        states.forEach((state, index) => {
          console.log('');
          console.log('I'+index);
          state.debugPrint();
        });
      };

      this.printTable = function() {
        states.forEach((state, index) => {
          let row = state.createRow();
          row.state = index;
          console.log(JSON.stringify(row));
        });
      };

      states.push(new State(0, simpleRules, simpleRules.getRootTerm()));

      let index = 0; while (index < states.length) {
        simpleRules.getSymbols().forEach(symbol => {
          if (symbol === '$') return;
          let rootTerms = states[index].getRootTermsFor(symbol);
          if (rootTerms.length) {
            let id = rootTerms.map(term => term.getId()).sort().join();
            let state = rootTermsState[id] || states.length;
            if (state === states.length) {
              rootTermsState[id] = state;
              states.push(new State(states.length, simpleRules, rootTerms));
            }
            states[index].setGotoFor(symbol, state);
          }
        });
        index++;
      }
    };

    return States;
  }

};

export default StatesModule;
