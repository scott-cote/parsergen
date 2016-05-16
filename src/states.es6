
let StatesModule = {

  createClass: function(State, Term) {

    let States = function(code) {

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

      this.render = function() {
        return states.map(state => state.render()).join(',\n    ')  ;
      };

      this.getRootTerm = function() {
        let rule = code.rules[0];
        return new Term(rule.id, rule.left, [], rule.right);
      };

      states.push(new State(0, code, this.getRootTerm()));

      let index = 0; while (index < states.length) {
        code.symbols.forEach(symbol => {
          if (symbol === '$') return;
          let rootTerms = states[index].getRootTermsFor(symbol);
          if (rootTerms.length) {
            let id = rootTerms.map(term => term.getId()).sort().join();
            let state = rootTermsState[id] || states.length;
            if (state === states.length) {
              rootTermsState[id] = state;
              states.push(new State(states.length, code, rootTerms));
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
