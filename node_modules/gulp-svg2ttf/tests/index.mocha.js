/* eslint max-nested-callbacks:0 func-names:0 */

'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var Stream = require('stream');
var fs = require('fs');
var path = require('path');

var assert = require('assert');
var StreamTest = require('streamtest');

var svg2ttf = require('../src/index.js');

describe('gulp-svg2ttf conversion', function() {
  var filename = path.join(__dirname, 'fixtures', 'iconsfont');
  var ttf = fs.readFileSync(filename + '.ttf');
  var ttfCopyfighted = fs.readFileSync(filename + '-copyright.ttf');
  var generationTimestamp = 3;

  // Iterating through versions
  StreamTest.versions.forEach(function(version) {

    describe('for ' + version + ' streams', function() {

      describe('with null contents', function() {

        it('should let null files pass through', function(done) {

          StreamTest[version].fromObjects([new gutil.File({
            path: 'bibabelula.foo',
            contents: null,
          })])
          .pipe(svg2ttf({
            timestamp: generationTimestamp,
          }))
          .pipe(StreamTest[version].toObjects(function(err, objs) {
            if(err) {
              return done(err);
            }
            assert.equal(objs.length, 1);
            assert.equal(objs[0].path, 'bibabelula.foo');
            assert.equal(objs[0].contents, null);
            done();
          }));

        });

      });

      describe('in buffer mode', function() {

        it('should work', function(done) {

          gulp.src(filename + '.svg', { buffer: true })
            .pipe(svg2ttf({
              timestamp: generationTimestamp,
            }))
            // Uncomment to regenerate the test files if changes in the svg2ttf lib
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.equal(objs.length, 1);
              assert.equal(objs[0].path, filename + '.ttf');
              assert.equal(objs[0].contents.toString('utf-8'), ttf.toString('utf-8'));
              done();
            }));

        });

        it('should work with the copyright option', function(done) {

          gulp.src(filename + '.svg', { buffer: true })
            .pipe(svg2ttf({
              timestamp: generationTimestamp,
              copyright: 'Brothershood of mens 2015 - Infinity',
            }))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.equal(objs.length, 1);
              assert.equal(objs[0].path, filename + '.ttf');
              assert.deepEqual(objs[0].contents, ttfCopyfighted);
              done();
            }));

        });

        it('should work with the clone option', function(done) {

          gulp.src(filename + '.svg', { buffer: true })
            .pipe(svg2ttf({
              clone: true,
              timestamp: generationTimestamp,
            }))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.equal(objs.length, 2);
              assert.equal(objs[0].path, filename + '.svg');
              assert.equal(
                objs[0].contents.toString('utf-8'),
                fs.readFileSync(filename + '.svg', 'utf-8')
              );
              assert.equal(objs[1].path, filename + '.ttf');
              assert.equal(objs[1].contents.toString('utf-8'), ttf.toString('utf-8'));
              done();
            }));

        });

        it('should let non-svg files pass through', function(done) {

          StreamTest[version].fromObjects([new gutil.File({
            path: 'bibabelula.foo',
            contents: new Buffer('ohyeah'),
          })])
          .pipe(svg2ttf({
            timestamp: generationTimestamp,
          }))
          .pipe(StreamTest[version].toObjects(function(err, objs) {
            if(err) {
              return done(err);
            }
            assert.equal(objs.length, 1);
            assert.equal(objs[0].path, 'bibabelula.foo');
            assert.equal(objs[0].contents.toString('utf-8'), 'ohyeah');
            done();
          }));

        });
      });


      describe('in stream mode', function() {
        it('should work', function(done) {

          gulp.src(filename + '.svg', { buffer: false })
            .pipe(svg2ttf({
              timestamp: generationTimestamp,
            }))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.equal(objs.length, 1);
              assert.equal(objs[0].path, filename + '.ttf');
              objs[0].contents.pipe(StreamTest[version].toChunks(function(err, chunks) {
                if(err) {
                  return done(err);
                }
                assert.deepEqual(Buffer.concat(chunks), ttf);
                done();
              }));
            }));

        });

        it('should work with the clone option', function(done) {

          gulp.src(filename + '.svg', { buffer: false })
            .pipe(svg2ttf({
              clone: true,
              timestamp: generationTimestamp,
            }))
            .pipe(StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.equal(objs.length, 2);
              assert.equal(objs[0].path, filename + '.svg');
              assert.equal(objs[1].path, filename + '.ttf');
              objs[0].contents.pipe(StreamTest[version].toText(function(err, text) {
                if(err) {
                  return done(err);
                }
                assert.equal(text, fs.readFileSync(filename + '.svg', 'utf-8'));
                objs[1].contents.pipe(StreamTest[version].toChunks(function(err, chunks) {
                  if(err) {
                    return done(err);
                  }
                  assert.deepEqual(Buffer.concat(chunks), ttf);
                  done();
                }));
              }));
            }));

        });

        it('should let non-svg files pass through', function(done) {

          StreamTest[version].fromObjects([new gutil.File({
            path: 'bibabelula.foo',
            contents: new Stream.PassThrough(),
          })])
          .pipe(svg2ttf({
            timestamp: generationTimestamp,
          }))
          .pipe(StreamTest[version].toObjects(function(err, objs) {
            if(err) {
              return done(err);
            }
            assert.equal(objs.length, 1);
            assert.equal(objs[0].path, 'bibabelula.foo');
            assert(objs[0].contents instanceof Stream.PassThrough);
            done();
          }));

        });
      });

    });

  });

});
