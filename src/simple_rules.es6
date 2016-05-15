
let SimpleRulesModule = {

  createClass: function(Term) {

    let SimpleRules = function(code) {

      let first = {};

      let follow = {};

      let nonterminals;

      this.getRootTerm = function() {
        let rule = code.rules[0];
        return new Term(rule.id, rule.left, [], rule.right);
      };

      this.createTermsFor = function(symbol) {
        return code.rules.filter(rule => rule.left === symbol)
          .map(rule => new Term(rule.id, rule.left, [], rule.right));
      };

      this.getFirstFor = function(symbol) {
        let self = this;
        if (!first[symbol]) {
          if (code.terminals.has(symbol)) {
            first[symbol] = [symbol];
          } else {
            first[symbol] = [...new Set(code.rules
              .filter(rule => symbol === rule.left && symbol !== rule.right[0].symbol)
              .reduce((value, rule) => {
                return value.concat(self.getFirstFor(rule.right[0].symbol));
              }, []))];
          }
        }
        return first[symbol];
      };

      this.getFollowFor = function(nonterminal) {
        let self = this;
        if (!follow[nonterminal]) {
          let allFollow = code.rules.reduce((outterValue, rule) => {
            outterValue = outterValue.concat(rule.right.reduce((value, token, index, array) => {
              if (nonterminal === token.symbol) {
                if (index < array.length-1) {
                  let newVal = self.getFirstFor(array[index+1].symbol);
                  return value.concat(newVal);
                } else {
                  let newVal = self.getFollowFor(rule.left);
                  return value.concat(newVal);
                }
              }
              return value;
            }, []));
            return outterValue;
          }, []);
          follow[nonterminal] = [...new Set(allFollow)];
        }
        return follow[nonterminal];
      };
    };

    return SimpleRules;
  }
};

export default SimpleRulesModule;
