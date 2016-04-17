
let RulesModule = {

  createClass: function(Rule, SimpleRules) {

    let Rules = function(startSymbol) {

      let rules = [new Rule(startSymbol, startSymbol+' EOF')];

      this.addRule = function(left, right) {
        rules.push(new Rule(left, right));
      };

      this.createSimpleRules = function() {
        let simpleRules = new SimpleRules();
        rules.forEach(rule => simpleRules.push(rule.simplify()));
        return simpleRules;
      };
    };

    return Rules;
  }
};

export default RulesModule;
