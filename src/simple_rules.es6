
let SimpleRulesModule = {

  createClass: function() {

    let SimpleRules = function(terminals) {

      let rules = [];

      let symbols;

      this.push = function(newRules) {
        rules = rules.concat(newRules);
      };

      this.createStartTerm = function() {
        return rules[0].createTerm();
      };

      this.getRootTerm = function() {
        return rules[0].createTerm();
      };

      this.getSymbols = function() {
        symbols = symbols || [...new Set(terminals.concat(rules.map(rule => rule.getLeft())))];
        return symbols;
      };

      this.createTermsFor = function(symbol) {
        return rules.filter(rule => rule.leftMatches(symbol))
          .map(rule => rule.createTerm());
      };
    };

    return SimpleRules;
  }
};

export default SimpleRulesModule;
