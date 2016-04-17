
let RulesModule = {

  createClass: function(Rule) {

    let Rules = function() {

      let rules = [];

      this.addRule = function(left, right) {
        rules.push(new Rule(left, right));
      };

      this.createSimpleRules = function() {
        // ...
      };
    };

    return Rules;
  }
};

export default RulesModule;
