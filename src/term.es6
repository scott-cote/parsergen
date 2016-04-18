
let TermModule = {

  createClass: function() {

    let Term = function(left, middle, right) {

      /*
      this.hasRight = function() {
        return right.length > 0;
      };
      */

      this.getRightToken = function() {
        if (right[0]) return right[0].symbol;
      };

      this.getRightNonterminal = function() {
        let token = right[0];
        if (token && token.type === 'NONTERMINAL') return token.symbol;
      }

      this.createShiftTerm = function() {
        return new Term(left, middle.concat(right[0]), right.slice(1));
      };

      this.debugPrint = function() {
        console.log(left+' -> '+middle.join(' ')+' . '+right.join(' '));
      };
    };

    return Term;
  }
};

export default TermModule;
