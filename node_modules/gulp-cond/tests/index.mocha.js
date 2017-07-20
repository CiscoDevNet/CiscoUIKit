'use strict';

var StreamTest = require('streamtest');
var assert = require('assert');
var gulpCond = require('../src');
var Stream = require('readable-stream');
var File = require('vinyl');

function getStream(version) {
  return StreamTest[version].fromObjects([
    new File({
      path: 'file.foo',
      contents: null
    }),
    new File({
      path: 'file.foo',
      contents: null
    }),
    new File({
      path: 'file.foo',
      contents: null
    })
  ]);
}

function getTrans(prefix) {
  return Stream.Transform({
    objectMode: true,
    transform: function(file, unused, cb) {
      file.path = prefix + file.path;
      cb(null, file);
    }
  });
}

describe('gulp-cond', function() {

  StreamTest.versions.forEach(function (version) {

    describe('for ' + version + ' streams', function() {

      describe('with a valid condition', function() {

        describe('as a value', function() {

          it('should work with stream', function(done) {
            var n = 0;
            var ended1 = false;
            var ended2 = false;

            getStream(version)
              .pipe(gulpCond(true, getTrans('1').once('end', function() {
                ended1 = true;
              }), getTrans('2').once('end', function() {
                ended2 = true;
              })))
              .pipe(StreamTest[version].toObjects(function(err, objs) {
                objs.forEach(function (file) {
                  assert.equal(file.path, '1file.foo');
                  assert.equal(file.contents, null);
                  n++;
                });
                assert.equal(ended1, true);
                assert.equal(ended2, false);
                assert.equal(n, 3);
                done();
              }));
          });

          it('should work with fn returning a stream', function(done) {
            var n = 0;

            getStream(version)
              .pipe(gulpCond(true, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
              .pipe(StreamTest[version].toObjects(function(err, objs) {
                objs.forEach(function (file) {
                  assert.equal(file.path, '1file.foo');
                  assert.equal(file.contents, null);
                  n++;
                });
                assert.equal(n, 3);
                done();
              }));
          });

        });

      });

      describe('as a function', function() {

        it('should work', function(done) {
          var n = 0;

          getStream(version)
            .pipe(gulpCond(function () {
              return true;
            }, getTrans('1'), getTrans('2')))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              objs.forEach(function (file) {
                assert.equal(file.path, '1file.foo');
                assert.equal(file.contents, null);
                n++;
              });
              assert.equal(n, 3);
              done();
            }));
        });

        it('should work with fn returning a stream', function(done) {
          var n = 0;

          getStream(version)
            .pipe(gulpCond(function () {
              return true;
            }, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              objs.forEach(function (file) {
                assert.equal(file.path, '1file.foo');
                assert.equal(file.contents, null);
                n++;
              });
              assert.equal(n, 3);
              done();
            }));
        });

      });

    });

    describe('with an invalid condition and a expr2', function() {

      describe('as a value', function() {

        it('should work with stream', function(done) {
          var n = 0;

          getStream(version)
            .pipe(gulpCond(false, getTrans('1'), getTrans('2')))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              objs.forEach(function (file) {
                assert.equal(file.path, '2file.foo');
                assert.equal(file.contents, null);
                n++;
              });
              assert.equal(n, 3);
              done();
            }));
        });

        it('should work with fn returning a stream', function(done) {
          var n = 0;

          getStream(version)
            .pipe(gulpCond(false, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              objs.forEach(function (file) {
                assert.equal(file.path, '2file.foo');
                assert.equal(file.contents, null);
                n++;
              });
              assert.equal(n, 3);
              done();
            }));
        });

      });

      describe('as a function', function() {

        it('should work', function(done) {
          var n = 0;

          getStream(version)
            .pipe(gulpCond(function () {
              return false;
            }, getTrans('1'), getTrans('2')))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              objs.forEach(function (file) {
                assert.equal(file.path, '2file.foo');
                assert.equal(file.contents, null);
                n++;
              });
              assert.equal(n, 3);
              done();
            }));
        });

        it('should work with fn returning a stream', function(done) {
          var n = 0;

          getStream(version)
            .pipe(gulpCond(function () {
              return false;
            }, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              objs.forEach(function (file) {
                assert.equal(file.path, '2file.foo');
                assert.equal(file.contents, null);
                n++;
              });
              assert.equal(n, 3);
              done();
            }));
        });

      });

    });

    describe('with an invalid condition and no expr2', function() {

      describe('as a value', function() {

        it('should work with stream', function(done) {
          var n = 0;

          getStream(version)
            .pipe(gulpCond(false, getTrans('1')))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              objs.forEach(function (file) {
                assert.equal(file.path, 'file.foo');
                assert.equal(file.contents, null);
                n++;
              });
              assert.equal(n, 3);
              done();
            }));
        });

        it('should work with fn returning a stream', function(done) {
          var n = 0;

          getStream(version)
            .pipe(gulpCond(false, getTrans.bind(null, '1')))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              objs.forEach(function (file) {
                assert.equal(file.path, 'file.foo');
                assert.equal(file.contents, null);
                n++;
              });
              assert.equal(n, 3);
              done();
            }));
        });

      });

      describe('as a function', function() {

        it('should work', function(done) {
          var n = 0;

          getStream(version)
            .pipe(gulpCond(function () {
              return false;
            }, getTrans('1')))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              objs.forEach(function (file) {
                assert.equal(file.path, 'file.foo');
                assert.equal(file.contents, null);
                n++;
              });
              assert.equal(n, 3);
              done();
            }));
        });

        it('should work with fn returning a stream', function(done) {
          var n = 0;

          getStream(version)
            .pipe(gulpCond(function () {
              return false;
            }, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              objs.forEach(function (file) {
                assert.equal(file.path, '2file.foo');
                assert.equal(file.contents, null);
                n++;
              });
              assert.equal(n, 3);
              done();
            }));
        });

      });

    });

  });

});
