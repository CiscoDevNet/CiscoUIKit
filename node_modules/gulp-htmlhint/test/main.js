/* eslint-env node, mocha */
'use strict';
var fs = require('fs');
var should = require('should');
var gutil = require('gulp-util');
var vfs = require('vinyl-fs');
var path = require('path');
var File = gutil.File;
var HTMLHint = require('htmlhint').HTMLHint;
var htmlhint = require('../');

require('mocha');

var getFile = function (filePath) {
    filePath = 'test/' + filePath;
    return new File({
        path: filePath,
        cwd: 'test/',
        base: path.dirname(filePath),
        contents: fs.readFileSync(filePath)
    });
};

describe('gulp-htmlhint', function () {
    it('should pass valid file', function (done) {
        var valid = 0;

        var fakeFile = getFile('fixtures/valid.html');

        var stream = htmlhint();

        stream.on('error', function (err) {
            should.not.exist(err);
        });

        stream.on('data', function (file) {
            should.exist(file);
            file.htmlhint.success.should.equal(true);
            should.exist(file.path);
            should.exist(file.relative);
            should.exist(file.contents);
            ++valid;
        });

        stream.once('end', function () {
            valid.should.equal(1);
            done();
        });

        stream.write(fakeFile);
        stream.end();
    });

    it('should fail invalid file', function (done) {
        var invalid = 0;

        var fakeFile = getFile('fixtures/invalid.html');

        var stream = htmlhint();

        stream.on('error', function (err) {
            should.not.exist(err);
        });

        stream.on('data', function (file) {
            should.exist(file);
            file.htmlhint.success.should.equal(false);
            file.htmlhint.errorCount.should.equal(1);
            file.htmlhint.messages.length.should.equal(1);
            should.exist(file.path);
            should.exist(file.relative);
            should.exist(file.contents);
            ++invalid;
        });

        stream.once('end', function () {
            invalid.should.equal(1);
            done();
        });

        stream.write(fakeFile);
        stream.end();
    });

    it('should lint two files', function (done) {
        var a = 0;

        var file1 = getFile('fixtures/valid.html');
        var file2 = getFile('fixtures/invalid.html');

        var stream = htmlhint();
        stream.on('data', function () {
            ++a;
        });

        stream.once('end', function () {
            a.should.equal(2);
            done();
        });

        stream.write(file1);
        stream.write(file2);
        stream.end();
    });

    it('should support options', function (done) {
        var a = 0;

        var file = getFile('fixtures/invalid.html');

        var stream = htmlhint({
            'tag-pair': false
        });
        stream.on('data', function (newFile) {
            ++a;
            should.exist(newFile.htmlhint.success);
            newFile.htmlhint.success.should.equal(true);
            should.not.exist(newFile.htmlhint.results);
            should.not.exist(newFile.htmlhint.options);
        });
        stream.once('end', function () {
            a.should.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });

    it('should support htmlhintrc', function (done) {
        var a = 0;

        var file = getFile('fixtures/invalid.html');

        var stream = htmlhint('test/htmlhintrc.json');
        stream.on('data', function (newFile) {
            ++a;
            should.exist(newFile.htmlhint.success);
            newFile.htmlhint.success.should.equal(true);
            should.not.exist(newFile.htmlhint.results);
            should.not.exist(newFile.htmlhint.options);
        });
        stream.once('end', function () {
            a.should.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });

    it('should emit error on failure', function (done) {
        var file = getFile('fixtures/invalid.html');

        var stream = htmlhint();

        var failStream = htmlhint.reporter('fail');
        stream.pipe(failStream);

        failStream.on('error', function (err) {
            should.exist(err);
            err.message.indexOf(file.relative).should.not.equal(-1, 'should say which file');
            done();
        });

        stream.write(file);
        stream.end();
    });

    it('should add a htmlhint rule', function () {
        var fakeRule = {
            id: 'foo',
            description: 'bar',
            init: function () {}
        };
        htmlhint.addRule(fakeRule);
        HTMLHint.rules[fakeRule.id].should.equal(fakeRule);
    });
});

describe('htmlhint.reporter', function () {
    it('should not fail for more than 16 files', function (done) {
        var a = 0;

        var stream = vfs.src('test/fixtures/morethan16/*.html')
            .pipe(htmlhint())
            .pipe(htmlhint.reporter(function () {
                a++;
            }));

        stream.on('data', function () {
        });

        stream.once('end', function () {
            a.should.equal(17);
            done();
        });
    });

    it('should load custom reporters by package name', function (done) {
        var valid = 0;

        var stream = vfs.src('test/fixtures/valid.html')
            .pipe(htmlhint())
            .pipe(htmlhint.reporter('htmlhint-stylish'));

        stream.on('error', function (err) {
            should.not.exist(err);
        });

        stream.on('data', function (file) {
            should.exist(file);
            /* eslint no-unused-expressions: 0 */
            file.htmlhint.success.should.be.true;
            should.exist(file.path);
            should.exist(file.relative);
            should.exist(file.contents);
            ++valid;
        });

        stream.once('end', function () {
            valid.should.equal(1);
            done();
        });
    });
});

describe('htmlhint.errorreporter', function () {
    it('should throw an error when using on an invalid file', function (done) {
        var error = false;
        var stream = vfs.src('test/fixtures/invalid.html')
            .pipe(htmlhint())
            .pipe(htmlhint.failReporter());

        stream.on('error', function (err) {
            error = true;
            gutil.colors.stripColor(err.message).should.containEql('[L9:C1] Tag must be paired, missing: [ </h1> ], start tag match failed [ <h1> ]');
            err.name.should.equal('Error');
            done();
        });

        stream.once('end', function () {
            /* eslint no-unused-expressions: 0 */
            error.should.be.true;
            done();
        });
    });

    it('should not show file errors if suppress option is explicitly set', function (done) {
        var error = false;
        var stream = vfs.src('test/fixtures/invalid.html')
            .pipe(htmlhint())
            .pipe(htmlhint.failReporter({
                suppress: true
            }));

        stream.on('error', function (err) {
            error = true;
            gutil.colors.stripColor(err.message).should.containEql('HTMLHint failed.');
            err.name.should.equal('Error');
            done();
        });

        stream.once('end', function () {
            /* eslint no-unused-expressions: 0 */
            error.should.be.true;
            done();
        });
    });
});
