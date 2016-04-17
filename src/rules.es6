
let Rules = {

  create: function(Rule) {

    let rules = [];

    let RulesClass = function() {

    };

    RulesClass.prototype.addRule = function(left, right) {
      rules.push(new Rule(left, right));
    };

    RulesClass.prototype.createSimpleRules = function() {

    };

    return new RulesClass();
  }
};

export default Rules;
