
let SimpleRulesModule = {

  createClass: function(Term) {

    let SimpleRules = function(code) {

      let rules = [];

      let first = {};

      let follow = {};

      let nonterminals;

      this.getRules = function() {
        return rules;
      };

      /*
      this.toString = function() {
        return rules.map(rule => rule.toString()).join();
      };
      */

      this.addRule = function(left, right) {
        rules.push({ id: rules.length, left, right })
        //rules.push(new SimpleRule(rules.length, left, right));
      };

      /*
      this.createStartTerm = function() {
        let rule = rules[0];
        return new Term(rule.id, rule.left, [], rule.right);
      };
      */

      this.getRootTerm = function() {
        let rule = rules[0];
        return new Term(rule.id, rule.left, [], rule.right);
      };

      this.getNonterminals = function() {
        nonterminals = nonterminals || [...new Set([...code.terminals].concat(rules.map(rule => rule.left)))];
        //console.log('nonterminals')
        //console.log(JSON.stringify(nonterminals))
        //console.log(JSON.stringify(code.nonterminals.keys()))
        return nonterminals;
      };

      this.getSymbols = function() {
        let symbols = this.getNonterminals().concat(code.terminals);
        //console.log('symbols')
        //console.log(JSON.stringify(symbols))
        //console.log(JSON.stringify(code.symbols.keys()))
        return symbols;
      };

      this.createTermsFor = function(symbol) {
        return rules.filter(rule => rule.left === symbol)
          .map(rule => new Term(rule.id, rule.left, [], rule.right));
      };

      this.getNontermMap = function() {
        return rules.slice(1).map(rule => rule.left);
      };

      this.getPopMap = function() {
        return rules.slice(1).map(rule => rule.getRightCount());
      };

      this.render = function() {
        return rules.slice(1).map(rule => rule.render()).join(',\n    ');
      };

      this.getFirstFor = function(symbol) {
        let self = this;
        if (!first[symbol]) {
          if (code.terminals.has(symbol)) {
            first[symbol] = [symbol];
          } else {
            first[symbol] = [...new Set(rules
              .filter(rule => symbol === rule.left && symbol !== rule.right[0].symbol)
              .reduce((value, rule) => {
                return value.concat(self.getFirstFor(rule.right[0].symbol));
              }, []))];
          }
        }
        return first[symbol];
      };

      this.getFollowFor = function(nonterminal) {
        let self = this;
        if (!follow[nonterminal]) {
          let allFollow = rules.reduce((outterValue, rule) => {
            outterValue = outterValue.concat(rule.right.reduce((value, token, index, array) => {
              if (nonterminal === token.symbol) {
                if (index < array.length-1) {
                  let newVal = self.getFirstFor(array[index+1].symbol);
                  return value.concat(newVal);
                } else {
                  let newVal = self.getFollowFor(rule.left);
                  return value.concat(newVal);
                }
              }
              return value;
            }, []));
            return outterValue;
          }, []);
          follow[nonterminal] = [...new Set(allFollow)];
        }
        return follow[nonterminal];
      };
    };

    return SimpleRules;
  }
};

export default SimpleRulesModule;
