
var Parser = function() {

  this.processToken = function(token, type) {
    console.log(type);
  };

  this.end = function() {
    return { nodes: [] };
  }
};

exports.default = Parser;
