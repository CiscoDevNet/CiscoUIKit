/* eslint max-nested-callbacks:[1] */

'use strict';

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var gutil = require('gulp-util');

var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var assert = require('assert');
var streamtest = require('streamtest');
var neatequal = require('neatequal');

var svgicons2svgfont = require('../src/index');
var defaultMetadataProvider = require('svgicons2svgfont/src/metadata');

describe('gulp-svgicons2svgfont', function() {

  beforeEach(function(done) {
    mkdirp(path.join(__dirname, 'results'), done);
  });

  afterEach(function(done) {
    rimraf(path.join(__dirname, 'results'), done);
  });

  streamtest.versions.forEach(function(version) {
    describe('for ' + version + ' streams', function() {

      describe('must emit an error', function() {

        it('when a glyph is bad', function(done) {
          streamtest[version].fromObjects([new gutil.File({
            path: 'bibabelula.svg',
            contents: streamtest.v2.fromChunks(['oh', 'yeah']),
          })])
          .pipe(svgicons2svgfont({
            fontName: 'unprefixedicons',
          })
          .on('error', function(err) {
            assert.equal(
              err.message,
              'Non-whitespace before first tag.\nLine: 0\nColumn: 1\nChar: o'
            );
          }).pipe(streamtest.v2.toObjects(function(err) {
            if(err) {
              return done(err);
            }
            done();
          })));
        });

      });

      describe('with null contents', function() {

        it('should let null files pass through', function(done) {
          var file = new gutil.File({
            path: 'bibabelula.svg',
            contents: null,
          });

          streamtest[version].fromObjects([file])
          .pipe(svgicons2svgfont({
            fontName: 'cleanicons',
          }))
          .pipe(streamtest.v2.toObjects(function(err, files) {
            if(err) {
              return done(err);
            }
            assert.equal(files[0].path, 'bibabelula.svg');
            assert.equal(files[0].contents, null);
            assert.equal(files.length, 1);
            done();
          }));
        });

      });

      it('should let non-svg files pass through (prependUnicode)', function(done) {
        var file = new gutil.File({
          path: 'bibabelula.foo',
          contents: streamtest.v2.fromChunks(['oh', 'yeah']),
        });

        streamtest[version].fromObjects([file])
        .pipe(svgicons2svgfont({
          fontName: 'unprefixedicons',
          startUnicode: 0xE001,
          prependUnicode: true,
        }))
        .pipe(streamtest.v2.toObjects(function(err, files) {
          if(err) {
            return done(err);
          }
          assert.equal(files[0].path, 'bibabelula.foo');
          assert.equal(files.length, 1);
          done();
        }));
      });

      it('should let non-svg files pass through', function(done) {
        var file = new gutil.File({
          path: 'bibabelula.foo',
          contents: streamtest.v2.fromChunks(['oh', 'yeah']),
        });

        streamtest[version].fromObjects([file])
        .pipe(svgicons2svgfont({
          fontName: 'unprefixedicons',
          startUnicode: 0xE001,
        }))
        .pipe(streamtest.v2.toObjects(function(err, files) {
          if(err) {
            return done(err);
          }
          assert.equal(files[0].path, 'bibabelula.foo');
          assert.equal(files.length, 1);
          done();
        }));
      });

      describe('in stream mode', function() {

        it('should work with cleanicons', function(done) {
          gulp.src(
            path.join(__dirname, 'fixtures', 'cleanicons', '*.svg'),
            { buffer: false }
          )
            .pipe(svgicons2svgfont({
              fontName: 'cleanicons',
              startUnicode: 0xE001,
            }))
            .pipe(streamtest.v2.toObjects(function(err, files) {
              if(err) {
                return done(err);
              }
              assert.equal(files.length, 1);
              assert.equal(files[0].isStream(), true);
              files[0].pipe(streamtest.v2.toText(function(err2, text) {
                if(err2) {
                  return done(err2);
                }
                assert.equal(
                  text,
                  fs.readFileSync(
                    path.join(__dirname, 'expected', 'test-cleanicons-font.svg'),
                    'utf8'
                  )
                );
                done();
              }));
            }));
        });

        it('should work with the metadataProvider option', function(done) {
          gulp.src(
            path.join(__dirname, 'fixtures', 'cleanicons', '*.svg'),
            { buffer: false }
          )
            .pipe(svgicons2svgfont({
              fontName: 'cleanicons',
              metadataProvider: defaultMetadataProvider({
                startUnicode: 0xE001,
              }),
            }))
            .pipe(streamtest.v2.toObjects(function(err, files) {
              if(err) {
                return done(err);
              }
              assert.equal(files.length, 1);
              assert.equal(files[0].isStream(), true);
              files[0].pipe(streamtest.v2.toText(function(err2, text) {
                if(err2) {
                  return done(err2);
                }
                assert.equal(
                  text,
                  fs.readFileSync(
                    path.join(__dirname, 'expected', 'test-cleanicons-font.svg'),
                    'utf8'
                  )
                );
                done();
              }));
            }));
        });

        it('should work with prefixedicons', function(done) {
          gulp.src(
            path.join(__dirname, 'fixtures', 'prefixedicons', '*.svg'),
            { buffer: false }
          )
            .pipe(svgicons2svgfont({
              fontName: 'prefixedicons',
              startUnicode: 0xE001,
            }))
            .pipe(streamtest.v2.toObjects(function(err, files) {
              if(err) {
                return done(err);
              }
              assert.equal(files.length, 1);
              assert.equal(files[0].isStream(), true);
              files[0].pipe(streamtest.v2.toText(function(err2, text) {
                if(err2) {
                  return done(err2);
                }
                assert.equal(
                  text,
                  fs.readFileSync(
                    path.join(__dirname, 'expected', 'test-prefixedicons-font.svg'),
                    'utf8'
                  )
                );
                done();
              }));
            }));
        });

        it('should work with originalicons', function(done) {
          gulp.src(
            path.join(__dirname, 'fixtures', 'originalicons', '*.svg'),
            { buffer: false }
          )
            .pipe(svgicons2svgfont({
              fontName: 'originalicons',
            }))
            .pipe(streamtest.v2.toObjects(function(err, files) {
              if(err) {
                return done(err);
              }
              assert.equal(files.length, 1);
              assert.equal(files[0].isStream(), true);
              files[0].pipe(streamtest.v2.toText(function(err2, text) {
                if(err2) {
                  return done(err2);
                }
                assert.equal(
                  text,
                  fs.readFileSync(
                    path.join(__dirname, 'expected', 'test-originalicons-font.svg'),
                    'utf8'
                  )
                );
                done();
              }));
            }));
        });

        describe('', function() {

          beforeEach(function(done) {
            gulp.src(path.join(__dirname, 'fixtures', 'unprefixedicons', '*.svg'))
              .pipe(gulp.dest(path.join(__dirname, 'results', 'unprefixedicons')))
              .on('error', done)
              .on('end', done);
          });

          it('should work with unprefixed icons and the prependUnicode option', function(done) {
            gulp.src(
              path.join(__dirname, 'results', 'unprefixedicons', '*.svg'),
              { buffer: false }
            )
              .pipe(svgicons2svgfont({
                fontName: 'unprefixedicons',
                prependUnicode: true,
              }))
              .pipe(streamtest.v2.toObjects(function(err, files) {
                if(err) {
                  return done(err);
                }
                assert.equal(files.length, 1);
                assert.equal(files[0].isStream(), true);
                files[0].pipe(streamtest.v2.toText(function(err2, text) {
                  if(err2) {
                    return done(err2);
                  }
                  assert.equal(
                    text,
                    fs.readFileSync(
                      path.join(__dirname, 'expected', 'test-unprefixedicons-font.svg'),
                      'utf8'
                    )
                  );
                  assert.equal(fs.existsSync(path.join(
                    __dirname, 'results', 'unprefixedicons', 'uEA01-arrow-down.svg'
                  )), true);
                  assert.equal(
                    fs.readFileSync(path.join(
                      __dirname, 'results', 'unprefixedicons',
                      'uEA01-arrow-down.svg'
                    ), 'utf8'),
                    fs.readFileSync(path.join(
                      __dirname, 'fixtures', 'unprefixedicons',
                      'arrow-down.svg'
                    ), 'utf8')
                  );
                  assert.equal(fs.existsSync(path.join(
                    __dirname, 'results', 'unprefixedicons', 'uEA02-arrow-left.svg'
                  )), true);
                  assert.equal(
                    fs.readFileSync(path.join(
                      __dirname, 'results', 'unprefixedicons',
                      'uEA02-arrow-left.svg'
                    ), 'utf8'),
                    fs.readFileSync(path.join(
                      __dirname, 'fixtures', 'unprefixedicons', 'arrow-left.svg'
                    ), 'utf8')
                  );
                  assert.equal(fs.existsSync(path.join(
                    __dirname, 'results', 'unprefixedicons', 'uEA03-arrow-right.svg'
                  )), true);
                  assert.equal(
                    fs.readFileSync(path.join(
                      __dirname, 'results', 'unprefixedicons',
                      'uEA03-arrow-right.svg'
                    ), 'utf8'),
                    fs.readFileSync(path.join(
                      __dirname, 'fixtures', 'unprefixedicons', 'arrow-right.svg'
                    ), 'utf8')
                  );
                  assert.equal(fs.existsSync(path.join(
                    __dirname, 'results', 'unprefixedicons', 'uEA04-arrow-up.svg'
                  )), true);
                  assert.equal(
                    fs.readFileSync(path.join(
                      __dirname, 'results', 'unprefixedicons',
                      'uEA04-arrow-up.svg'
                    ), 'utf8'),
                    fs.readFileSync(path.join(
                      __dirname, 'fixtures', 'unprefixedicons', 'arrow-up.svg'
                    ), 'utf8')
                  );
                  done();
                }));
              }));
          });

        });

        describe('', function() {

          beforeEach(function(done) {
            gulp.src(path.join(__dirname, 'fixtures', 'unicons', '*.svg'))
              .pipe(gulp.dest(path.join(__dirname, 'results', 'unicons')))
              .on('error', done)
              .on('end', done);
          });

          it('should work with mixed icons and the prependUnicode option', function(done) {
            gulp.src(
              path.join(__dirname, 'results', 'unicons', '*.svg'),
              { buffer: false }
            )
              .pipe(svgicons2svgfont({
                fontName: 'unicons',
                prependUnicode: true,
              })).on('error', done)
              .pipe(streamtest.v2.toObjects(function(err, files) {
                if(err) {
                  return done(err);
                }
                assert.equal(files.length, 1);
                assert.equal(files[0].isStream(), true);
                files[0].pipe(streamtest.v2.toText(function(err2, text) {
                  if(err2) {
                    return done(err2);
                  }
                  assert.equal(
                    text,
                    fs.readFileSync(
                      path.join(__dirname, 'expected', 'test-unicons-font.svg'),
                      'utf8'
                    )
                  );
                  assert.equal(fs.existsSync(path.join(
                    __dirname, 'results', 'unicons', 'uEA01-twitter.svg'
                  )), true);
                  assert.equal(
                    fs.readFileSync(path.join(
                      __dirname, 'results', 'unicons',
                      'uEA01-twitter.svg'
                    ), 'utf8'),
                    fs.readFileSync(path.join(
                      __dirname, 'fixtures', 'unicons', 'uEA01-twitter.svg'
                    ), 'utf8')
                  );
                  assert.equal(fs.existsSync(path.join(
                    __dirname, 'results', 'unicons', 'uEA02-facebook.svg'
                  )), true);
                  assert.equal(
                    fs.readFileSync(path.join(
                      __dirname, 'results', 'unicons',
                      'uEA02-facebook.svg'
                    ), 'utf8'),
                    fs.readFileSync(path.join(
                      __dirname, 'fixtures', 'unicons', 'facebook.svg'
                    ), 'utf8')
                  );
                  done();
                }));
              }));
          });

        });

        it('should emit an event with the codepoint mapping', function(done) {
          var codepoints;

          gulp.src(
            path.join(__dirname, 'fixtures', 'cleanicons', '*.svg'),
            { buffer: false }
          )
            .pipe(svgicons2svgfont({
              fontName: 'cleanicons',
              startUnicode: 0xE001,
            }))
            .on('glyphs', function(_codepoints_) {
              codepoints = _codepoints_;
            })
            .pipe(streamtest.v2.toObjects(function(err, files) {
              if(err) {
                return done(err);
              }
              assert.equal(files.length, 1);
              assert.equal(files[0].isStream(), true);
              files[0].pipe(streamtest.v2.toText(function(err2, text) {
                if(err2) {
                  return done(err2);
                }
                assert(codepoints);
                neatequal(
                  codepoints,
                  JSON.parse(fs.readFileSync(
                    path.join(__dirname, 'expected', 'test-codepoints.json'),
                    'utf8'
                  ))
                );
                assert.equal(
                  text,
                  fs.readFileSync(
                    path.join(__dirname, 'expected', 'test-cleanicons-font.svg'),
                    'utf8'
                  )
                );
                done();
              }));
            }));
        });

        it('should support filename change', function(done) {
          gulp.src(
            path.join(__dirname, 'fixtures', 'cleanicons', '*.svg'),
            { buffer: false }
          )
            .pipe(svgicons2svgfont({
              fontName: 'cleanicons',
              fileName: 'newName',
              startUnicode: 0xE001,
            }))
            .pipe(streamtest.v2.toObjects(function(err, files) {
              if(err) {
                return done(err);
              }
              assert.equal(files.length, 1);
              assert.equal(files[0].isStream(), true);
              assert.equal(fs.exists(__dirname, 'fixtures', 'cleanicons', 'newName.svg'));
              done();
            }));
        });

      });

      describe('in buffer mode', function() {

        it('should work with cleanicons', function(done) {
          gulp.src(
            path.join(__dirname, 'fixtures', 'cleanicons', '*.svg'),
            { buffer: true }
          )
            .pipe(svgicons2svgfont({
              fontName: 'cleanicons',
              startUnicode: 0xE001,
            }))
            .pipe(streamtest.v2.toObjects(function(err, files) {
              if(err) {
                return done(err);
              }
              assert.equal(files.length, 1);
              assert.equal(files[0].isBuffer(), true);
              assert.equal(
                files[0].contents.toString('utf8'),
                fs.readFileSync(path.join(__dirname, 'expected', 'test-cleanicons-font.svg'))
              );
              done();
            }));
        });

        it('should work with prefixedicons', function(done) {
          gulp.src(
            path.join(__dirname, 'fixtures', 'prefixedicons', '*.svg'),
            { buffer: true }
          )
            .pipe(svgicons2svgfont({
              fontName: 'prefixedicons',
              startUnicode: 0xE001,
            }))
            .pipe(streamtest.v2.toObjects(function(err, files) {
              if(err) {
                return done(err);
              }
              assert.equal(files.length, 1);
              assert.equal(files[0].isBuffer(), true);
              assert.equal(
                files[0].contents.toString('utf8'),
                fs.readFileSync(path.join(__dirname, 'expected', 'test-prefixedicons-font.svg'))
              );
              done();
            }));
        });

        it('should work with originalicons', function(done) {
          gulp.src(
            path.join(__dirname, 'fixtures', 'originalicons', '*.svg'),
            { buffer: true }
          )
            .pipe(svgicons2svgfont({
              fontName: 'originalicons',
            }))
            .pipe(streamtest.v2.toObjects(function(err, files) {
              if(err) {
                return done(err);
              }
              assert.equal(files.length, 1);
              assert.equal(files[0].isBuffer(), true);
              assert.equal(
                files[0].contents.toString('utf8'),
                fs.readFileSync(path.join(__dirname, 'expected', 'test-originalicons-font.svg'))
              );
              done();
            }));
        });

        it('should support filename change', function(done) {
          gulp.src(
            path.join(__dirname, 'fixtures', 'cleanicons', '*.svg'),
            { buffer: true }
          )
            .pipe(svgicons2svgfont({
              fontName: 'cleanicons',
              fileName: 'newName',
              startUnicode: 0xE001,
            }))
            .pipe(streamtest.v2.toObjects(function(err, files) {
              if(err) {
                return done(err);
              }
              assert.equal(files.length, 1);
              assert.equal(files[0].isBuffer(), true);
              assert.equal(fs.exists(__dirname, 'fixtures', 'cleanicons', 'newName.svg'));
              done();
            }));
        });
      });

    });

  });


  describe('must throw error', function() {

    it('when no fontname is given', function() {
      assert.throws(function() {
        svgicons2svgfont();
      });
    });

    it('when using old options', function() {
      assert.throws(function() {
        svgicons2svgfont({
          appendUnicode: true,
        });
      });
    });

  });


});
