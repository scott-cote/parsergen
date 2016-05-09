
let RulesModule = {

  createClass: function(SimpleRule, SimpleRules) {

    let Rules = function(startSymbol, terminals) {

      // let rules = [new Rule(startSymbol+"'", [startSymbol,'$'])];

      let rules = [{ left: startSymbol+"'", right: [startSymbol,'$']}];

      this.toString = function() {
        return rules.map(rule => rule.toString()).join('::');
      };

      this.addRule = function(left, right) {
        rules.push({left, right});
      };

      this.createSimpleRules = function(terminals) {
        let simplify = function(rule, terminals) {
          let tokens = rule.right.map(symbol => { return {
            symbol: symbol,
            type: terminals.find(token => token === symbol) ? 'TERMINAL' : 'NONTERMINAL'
          }});
          return [new SimpleRule(0, rule.left, tokens)];
        };

        let simpleRules = new SimpleRules(terminals);
        rules.forEach(rule => {
          //simpleRules.push(rule.simplify(terminals)));
          simplify(rule, terminals).forEach(rule => simpleRules.addRule(rule.getLeft(), rule.getRight()));
        });
        return simpleRules;
      };
    };

    return Rules;
  }
};

export default RulesModule;
