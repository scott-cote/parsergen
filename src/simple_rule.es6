
let SimpleRuleModule = {

  createClass: function(Term) {

    let SimpleRule = function(left, right) {

      this.createTerm = function() {
        return new Term(left, [], right);
      }
    };

    return SimpleRule;
  }
};

export default SimpleRuleModule;
