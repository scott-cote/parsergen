
let SimpleRulesModule = {

  createClass: function(SimpleRule) {

    let SimpleRules = function(terminals) {

      let rules = [];

      let first = {};

      let follow = {};

      let nonterminals;

      this.addRule = function(left, right) {
        rules.push(new SimpleRule(rules.length, left, right));
      };

      this.createStartTerm = function() {
        return rules[0].createTerm();
      };

      this.getRootTerm = function() {
        return rules[0].createTerm();
      };

      this.getTerminals = function() {
        return terminals;
      };

      this.getNonterminals = function() {
        nonterminals = nonterminals || [...new Set(terminals.concat(rules.map(rule => rule.getLeft())))];
        return nonterminals;
      };

      this.getSymbols = function() {
        return this.getNonterminals().concat(terminals);
      };

      this.createTermsFor = function(symbol) {
        return rules.filter(rule => rule.leftMatches(symbol))
          .map(rule => rule.createTerm());
      };

      this.getNontermMap = function() {
        return rules.slice(1).map(rule => rule.getLeft());
      };

      this.getPopMap = function() {
        return rules.slice(1).map(rule => rule.getRightCount());
      };

      this.getFirstFor = function(symbol) {
        let self = this;
        if (!first[symbol]) {
          if (terminals.find(terminal => symbol === terminal)) {
            first[symbol] = [symbol];
          } else {
            first[symbol] = [...new Set(rules
              .filter(rule => symbol === rule.getLeft() && symbol !== rule.getFirstRight().symbol)
              .reduce((value, rule) => {
                return value.concat(self.getFirstFor(rule.getFirstRight().symbol));
              }, []))];
          }
        }
        return first[symbol];
      };

      this.getFollowFor = function(nonterminal) {
        let self = this;
        if (!follow[nonterminal]) {
          let allFollow = rules.reduce((outterValue, rule) => {
            outterValue = outterValue.concat(rule.getRight().reduce((value, token, index, array) => {
              if (nonterminal === token.symbol) {
                if (index < array.length-1) {
                  let newVal = self.getFirstFor(array[index+1].symbol);
                  return value.concat(newVal);
                } else {
                  let newVal = self.getFollowFor(rule.getLeft());
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
