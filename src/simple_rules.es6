
let SimpleRulesModule = {

  createClass: function() {

    let SimpleRules = function() {

      let rules = [];

      this.push = function(newRules) {
        rules = rules.concat(newRules);
      };

      this.createStartTerm = function() {
        return rules[0].createTerm();
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
