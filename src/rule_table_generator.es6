import thru from 'through2';

let generator = function() {

  let generate = function(code) {
    return code;
  };

  return thru.obj(function(code, encoding, done) {
    this.push(generate(code));
    done();
  });
};

export default generator;
