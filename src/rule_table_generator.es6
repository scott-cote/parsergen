import thru from 'through2';

let generator = function() {

  let generate = function(rules) {
    let code = { rules };
    return code;
  };

  return thru.obj(function(chunk, encoding, done) {
    this.push(generate(chunk));
    done();
  });
};

export default generator;
