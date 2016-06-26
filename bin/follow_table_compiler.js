'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

this.getFollowFor = function(nonterminal, follow, code) {
  let self = this;
  if (!follow[nonterminal]) {
    let allFollow = code.rules.reduce((outterValue, rule) => {
      outterValue = outterValue.concat(rule.right.reduce((value, token, index, array) => {
        if (nonterminal === token.symbol) {
          if (index < array.length-1) {
            let newVal = self.getFirstFor(array[index+1].symbol);
            return value.concat(newVal);
          } else {
            let newVal = self.getFollowFor(rule.left);
            return value.concat(newVal);
          }
        }
        return value;
      }, []));
      return outterValue;
    }, []);
    follow[nonterminal] = [...new Set(allFollow)];
  }
  return follow[nonterminal];
};

*/

/*

  for each rule in rules
    for each item and index in rule.right
      if item.symbol == symbol
        nextItem = rule.right[index+1]
        if nextItem, traverse next chain adding first until !first.canBeEmpty
          or you reach the end. If end, add generateFollowFor(rule.left)
        else add generateFollowFor(rule.left)

*/

// reduceRule collectRule

// reduceRules collectRules

var processRule = function processRule(symbol, table, rule) {
  var result = Promise.resolve();
  rule.right.forEach(function (item, index) {
    result = result.then(function () {
      return processProcessItem(symbol, table, item, index);
    });
  });
  return result;
};

var generateFollowFor = function generateFollowFor(symbol, table, rules) {
  var result = Promise.resolve();
  rules.forEach(function (rule) {
    result = result.then(function () {
      return processRule(symbol, table, rule);
    });
  });
  return result;
};

var compile = function compile(code) {
  code.followTable = {};
  var result = Promise.resolve();
  /*
  code.nonterminals.forEach(symbol => {
    result = result.then(() => generateFollowFor(symbol, code.followTable, code.rules));
  });
  */
  return result;
};

/*
let table = {};
let addToFollowSet = function(symbol, item) {
 let set = table[symbol] || new Set();
 set.add(item);
 table[symbol] = set;
};
code.rules.forEach(rule => {
 */
/*
rule.right.forEach((symbol, index) => {
  if (symbol.type == 'NONTERMINAL') {
    let nextSymbol = rule.right[index+1];
    if (nextSymbol) {
      // symbol then nextSymbol
      let first = code.firstTable[nextSymbol.symbol];
      Array.from(first.symbols).forEach(item => {
        addToFollowSet(symbol.symbol, item);
      });
    } else {
      // symbol at end
    }
  }
});
*/
/*
});
return table;
*/

var Transformer = function (_Stream$Transform) {
  _inherits(Transformer, _Stream$Transform);

  function Transformer() {
    _classCallCheck(this, Transformer);

    console.log('follow start');
    return _possibleConstructorReturn(this, Object.getPrototypeOf(Transformer).call(this, { objectMode: true }));
  }

  _createClass(Transformer, [{
    key: '_transform',
    value: function _transform(code, encoding, done) {
      console.log('follow run');
      compile(code).then(function () {
        return done(null, code);
      }).catch(done);
    }
  }]);

  return Transformer;
}(_stream2.default.Transform);

;

var followTableCompiler = function followTableCompiler() {
  return new Transformer();
};

followTableCompiler.testAPI = {};

exports.default = followTableCompiler;