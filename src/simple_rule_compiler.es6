import thru from 'through2';

let compiler = function() {
  // NOOP for now
  return thru.obj(function(code, encoding, done) {
    this.push(code);
    done();
  });
};

export default compiler;
