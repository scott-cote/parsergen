
let TermModule = {

  createClass: function() {

    let Term = function(left, middle, right) {

      /*
      this.hasRight = function() {
        return right.length > 0;
      };
      */

      this.getId = function() {
        //console.log(JSON.stringify(middle))
        return left+' -> '+middle.map(element => element.symbol).join(' ')+' . '+right.map(element => element.symbol).join(' ');
      };

      this.getRightToken = function() {
        if (right[0]) return right[0].symbol;
      };

      this.getRightNonterminal = function() {
        let token = right[0];
        if (token && token.type === 'NONTERMINAL') return token.symbol;
      }

      this.createShiftTerm = function() {
        let newMiddle = right[0] ? middle.concat(right[0]) : middle;
        return new Term(left, newMiddle, right.slice(1));
      };

      this.debugPrint = function() {
        console.log(this.getId());
      };
    };

    return Term;
  }
};

export default TermModule;
