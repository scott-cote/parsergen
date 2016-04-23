
let TermModule = {

  createClass: function() {

    let Term = function(rule, left, middle, right) {

      let goto;

      this.getId = function() {
        return left+'>'+middle.map(element => element.symbol).join(':')+'.'+right.map(element => element.symbol).join(':');
      };

      this.getRightSymbol = function() {
        if (right[0]) return right[0].symbol;
      };

      this.getRightNonterminal = function() {
        let token = right[0];
        if (token && token.type === 'NONTERMINAL') return token.symbol;
      };

      this.getRightTerminal = function() {
        let token = right[0];
        if (token && token.type === 'TERMINAL') return token.symbol;
      };

      this.createShiftTerm = function() {
        let newMiddle = right[0] ? middle.concat(right[0]) : middle;
        return new Term(rule, left, newMiddle, right.slice(1));
      };

      this.setGoto = function(value) {
        goto = value;
      };

      this.getGoto = function() {
        return goto;
      };

      this.getLeft = function() {
        return left;
      }

      this.getRule = function() {
        return rule;
      }

      this.debugPrint = function() {
        console.log(this.getId(),' ',goto ? goto : '');
      };
    };

    return Term;
  }
};

export default TermModule;
