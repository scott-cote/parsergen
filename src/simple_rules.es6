
let SimpleRulesModule = {

  createClass: function() {

    let SimpleRules = function(terminals) {

      let rules = [];

      let nonterminals;

      this.push = function(newRules) {
        rules = rules.concat(newRules);
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
    };

    return SimpleRules;
  }
};

export default SimpleRulesModule;
