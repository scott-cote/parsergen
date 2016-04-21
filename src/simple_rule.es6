
let SimpleRuleModule = {

  createClass: function(Term) {

    let SimpleRule = function(left, right) {

      this.leftMatches = function(symbol) {
        return symbol === left;
      };

      this.getLeft = function() {
        return left;
      };

      this.createTerm = function() {
        return new Term(left, [], right);
      };
    };

    return SimpleRule;
  }
};

export default SimpleRuleModule;
