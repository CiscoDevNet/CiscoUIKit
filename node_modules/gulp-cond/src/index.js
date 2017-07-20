var Stream = require('readable-stream');

var PLUGIN_NAME = 'gulp-cond';

function gulpCond(condition, expr1, expr2) {
  var value = 'function' == typeof condition ? condition() : condition;
  var outStream;

  if(value) {
    outStream = 'function' == typeof expr1 ? expr1() : expr1;
  } else if(expr2) {
    outStream = 'function' == typeof expr2 ? expr2() : expr2;
  } else {
    outStream = new Stream.PassThrough({objectMode: true});
  }

  return outStream;
};

module.exports = gulpCond;
