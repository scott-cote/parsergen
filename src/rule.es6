
let RuleModule = {

  createClass: function(SimpleRule) {

    let Rule = function(left, right) {

      this.simplify = function() {
        return [new SimpleRule(left, right.split(' '))];
      };
    };

    return Rule;
  }
};

export default RuleModule;
