import thru from 'through2';

let compiler = function() {
  return thru.obj(function(code, encoding, done) {
    code.rules = code.complexRules.slice();
    this.push(code);
    done();
  });
};

export default compiler;
