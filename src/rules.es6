
let RulesModule = {

  createClass: function(Rule, SimpleRules) {

    let Rules = function(startSymbol, terminals) {

      let rules = [new Rule(startSymbol+"'", startSymbol+' $')];

      this.addRule = function(left, right) {
        rules.push(new Rule(left, right));
      };

      this.createSimpleRules = function(terminals) {
        let simpleRules = new SimpleRules(terminals);
        rules.forEach(rule => simpleRules.push(rule.simplify(terminals)));
        return simpleRules;
      };
    };

    return Rules;
  }
};

export default RulesModule;
