
let RuleModule = {

  createClass: function(SimpleRule) {

    let Rule = function(left, right) {

      this.simplify = function(terminals) {
        let tokens = right.split(' ').map(symbol => { return {
          symbol: symbol,
          type: terminals.find(token => token === symbol) ? 'TERMINAL' : 'NONTERMINAL'
        }});
        return [new SimpleRule(0, left, tokens)];
      };
    };

    return Rule;
  }
};

export default RuleModule;
