
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
    };

    return SimpleRules;
  }
};

export default SimpleRulesModule;
