
let RuleModule = {

  createClass: function(SimpleRule) {

    let Rule = function(left, right) {

      this.simplify = function(terminals) {
        let tokens = right.split(' ').map(symbol => { return {
          symbol: symbol,
          type: 'TERMINAL'
        }});
        return [new SimpleRule(left, tokens)];
      };
    };

    return Rule;
  }
};

export default RuleModule;
