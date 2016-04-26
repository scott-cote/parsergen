
let SimpleRuleModule = {

  createClass: function(Term) {

    let SimpleRule = function(id, left, right) {

      this.leftMatches = function(symbol) {
        return symbol === left;
      };

      this.getLeft = function() {
        return left;
      };

      this.getRight = function() {
        return right;
      }

      this.getRightCount = function() {
        return right.length;
      };

      this.getFirstRight = function() {
        return right[0];
      };

      this.createTerm = function() {
        return new Term(id, left, [], right);
      };
    };

    return SimpleRule;
  }
};

export default SimpleRuleModule;
