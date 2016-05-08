import thru from 'through2';

let compiler = function() {
  // NOOP for now
  return thru.obj(function(chunk, encoding, done) {
    this.push(chunk);
    done();
  });
};

export default compiler;
