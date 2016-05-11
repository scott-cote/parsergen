import thru from 'through2';

let generator = function() {

  let generate = function(code) {
    code.ruleTable = code.rules.map(rule => { return  { left: rule.left, rightCount: rule.right.length }});
    return code;
  };

  return thru.obj(function(code, encoding, done) {
    this.push(generate(code));
    done();
  });
};

export default generator;
