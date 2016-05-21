import thru from 'through2';

let compiler = function() {

  let compile = function(code) {
    code.ruleTable = code.rules.map(rule => { return  { left: rule.left, rightCount: rule.right.length }});
    return code;
  };

  return thru.obj(function(code, encoding, done) {
    this.push(compile(code));
    done();
  });
};

export default compiler;
