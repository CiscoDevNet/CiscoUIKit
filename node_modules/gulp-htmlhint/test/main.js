/* eslint-env node, mocha */
'use strict';
const fs = require('fs');
const path = require('path');
const should = require('should');
const stripAnsi = require('strip-ansi');
const vfs = require('vinyl-fs');
const File = require('vinyl');
const HTMLHint = require('htmlhint').HTMLHint;
const htmlhint = require('../');

const getFile = function (filePath) {
  filePath = 'test/' + filePath;
  return new File({
    path: filePath,
    cwd: 'test/',
    base: path.dirname(filePath),
    contents: fs.readFileSync(filePath)
  });
};

// User defined custom rule for test
const customRules = [];
customRules.push({
  id: 'require-some-tag',
  description: 'Require the presence of some-tag as the first element in files and not duplicated.',
  init(parser, reporter) {
    const self = this;
    let someTagOccurrences = 0;
    let someTagIsFirstEl = false;
    let iteration = 0;
    function onTagStart(event) {
      const tagName = event.tagName.toLowerCase();
      if (tagName === 'some-tag' && iteration === 0) {
        someTagIsFirstEl = true;
        someTagOccurrences++;
      } else if (tagName === 'some-tag' && iteration > 0) {
        someTagOccurrences++;
      }
      if (!someTagIsFirstEl) {
        reporter.error('The tag <some-tag> must be present as first element.', event.line, event.col, self, event.raw);
        parser.removeListener('tagstart', onTagStart);
      }
      if (someTagOccurrences > 1) {
        reporter.error('The tag <some-tag> must be present only once.', event.line, event.col, self, event.raw);
        parser.removeListener('tagstart', onTagStart);
      }
      iteration++;
    }
    parser.addListener('tagstart', onTagStart);
  }
});

describe('gulp-htmlhint', () => {
  it('should pass valid file', done => {
    let valid = 0;

    const fakeFile = getFile('fixtures/valid.html');

    const stream = htmlhint();

    stream.on('error', err => {
      should.not.exist(err);
    });

    stream.on('data', file => {
      should.exist(file);
      file.htmlhint.success.should.equal(true);
      should.exist(file.path);
      should.exist(file.relative);
      should.exist(file.contents);
      ++valid;
    });

    stream.once('end', () => {
      valid.should.equal(1);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should fail invalid file', done => {
    let invalid = 0;

    const fakeFile = getFile('fixtures/invalid.html');

    const stream = htmlhint();

    stream.on('error', err => {
      should.not.exist(err);
    });

    stream.on('data', file => {
      should.exist(file);
      file.htmlhint.success.should.equal(false);
      file.htmlhint.errorCount.should.equal(1);
      file.htmlhint.messages.length.should.equal(1);
      should.exist(file.path);
      should.exist(file.relative);
      should.exist(file.contents);
      ++invalid;
    });

    stream.once('end', () => {
      invalid.should.equal(1);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should lint two files', done => {
    let a = 0;

    const file1 = getFile('fixtures/valid.html');
    const file2 = getFile('fixtures/invalid.html');

    const stream = htmlhint();
    stream.on('data', () => {
      ++a;
    });

    stream.once('end', () => {
      a.should.equal(2);
      done();
    });

    stream.write(file1);
    stream.write(file2);
    stream.end();
  });

  it('should support options', done => {
    let a = 0;

    const file = getFile('fixtures/invalid.html');

    const stream = htmlhint({
      'tag-pair': false
    });
    stream.on('data', newFile => {
      ++a;
      should.exist(newFile.htmlhint.success);
      newFile.htmlhint.success.should.equal(true);
      should.not.exist(newFile.htmlhint.results);
      should.not.exist(newFile.htmlhint.options);
    });
    stream.once('end', () => {
      a.should.equal(1);
      done();
    });

    stream.write(file);
    stream.end();
  });

  it('should support htmlhintrc', done => {
    let a = 0;

    const file = getFile('fixtures/invalid.html');

    const stream = htmlhint('test/htmlhintrc.json');
    stream.on('data', newFile => {
      ++a;
      should.exist(newFile.htmlhint.success);
      newFile.htmlhint.success.should.equal(true);
      should.not.exist(newFile.htmlhint.results);
      should.not.exist(newFile.htmlhint.options);
    });
    stream.once('end', () => {
      a.should.equal(1);
      done();
    });

    stream.write(file);
    stream.end();
  });

  it('should emit error on failure', done => {
    const file = getFile('fixtures/invalid.html');

    const stream = htmlhint();

    const failStream = htmlhint.reporter('fail');
    stream.pipe(failStream);

    failStream.on('error', err => {
      should.exist(err);
      err.message.indexOf(file.relative).should.not.equal(-1, 'should say which file');
      done();
    });

    stream.write(file);
    stream.end();
  });

  it('should add a htmlhint rule', () => {
    const fakeRule = {
      id: 'foo',
      description: 'bar',
      init() {}
    };
    htmlhint.addRule(fakeRule);
    HTMLHint.rules[fakeRule.id].should.equal(fakeRule);
  });
});

describe('htmlhint.reporter', () => {
  it('should not fail for more than 16 files', done => {
    let a = 0;

    const stream = vfs.src('test/fixtures/morethan16/*.html')
			.pipe(htmlhint())
			.pipe(htmlhint.reporter(() => {
  a++;
}));

    stream.on('data', () => {
    });

    stream.once('end', () => {
      a.should.equal(17);
      done();
    });
  });

  it('should load custom reporters by package name', done => {
    let valid = 0;

    const stream = vfs.src('test/fixtures/valid.html')
			.pipe(htmlhint())
			.pipe(htmlhint.reporter('htmlhint-stylish'));

    stream.on('error', err => {
      should.not.exist(err);
    });

    stream.on('data', file => {
      should.exist(file);
			/* eslint no-unused-expressions: 0 */
      file.htmlhint.success.should.be.true;
      should.exist(file.path);
      should.exist(file.relative);
      should.exist(file.contents);
      ++valid;
    });

    stream.once('end', () => {
      valid.should.equal(1);
      done();
    });
  });
});

describe('htmlhint.failOnError', () => {
  it('should throw an error when using on an invalid file', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/invalid.html')
			.pipe(htmlhint())
			.pipe(htmlhint.failOnError());

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('[L9:C1] Tag must be paired, missing: [ </h1> ], start tag match failed [ <h1> ]');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });

  it('should throw an error (from one file) when using more than one file', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/morethan16/*.html')
			.pipe(htmlhint())
			.pipe(htmlhint.failOnError());

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('[L9:C1] Tag must be paired, missing: [ </h1> ], start tag match failed [ <h1> ]');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });

  it('should not show file errors if suppress option is explicitly set', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/invalid.html')
			.pipe(htmlhint())
			.pipe(htmlhint.failOnError({
  suppress: true
}));

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('HTMLHint failed.');
      err.name.should.equal('Error');
      done();
    });

    it('should throw an error when using on an invalid file', done => {
      let error = false;
      const stream = vfs.src('test/fixtures/invalid.html')
				.pipe(htmlhint())
				.pipe(htmlhint.failOnError());

      stream.on('error', err => {
        error = true;
        stripAnsi(err.message).should.containEql('[L9:C1] Tag must be paired, missing: [ </h1> ], start tag match failed [ <h1> ]');
        err.name.should.equal('Error');
        done();
      });

      stream.once('end', () => {
				/* eslint no-unused-expressions: 0 */
        error.should.be.true;
        done();
      });
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });
});

describe('htmlhint.failReporter - backward compatibility', () => {
  it('should throw an error when using on an invalid file', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/invalid.html')
			.pipe(htmlhint())
			.pipe(htmlhint.failReporter());

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('[L9:C1] Tag must be paired, missing: [ </h1> ], start tag match failed [ <h1> ]');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });

  it('should throw an error (from one file) when using more than one file', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/morethan16/*.html')
			.pipe(htmlhint())
			.pipe(htmlhint.failReporter());

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('[L9:C1] Tag must be paired, missing: [ </h1> ], start tag match failed [ <h1> ]');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });

  it('should not show file errors if suppress option is explicitly set', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/invalid.html')
			.pipe(htmlhint())
			.pipe(htmlhint.failReporter({
  suppress: true
}));

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('HTMLHint failed.');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });
});

describe('htmlhint.failAfterError', () => {
  it('should throw an error when using on an invalid file', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/invalid.html')
			.pipe(htmlhint())
			.pipe(htmlhint.failAfterError());

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('[L9:C1] Tag must be paired, missing: [ </h1> ], start tag match failed [ <h1> ]');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });

  it('should throw an error (from all files) when using more than one file', done => {
    let error = false;
    const stream = vfs.src(['test/fixtures/morethan16/test1.html', 'test/fixtures/morethan16/test2.html'])
			.pipe(htmlhint())
			.pipe(htmlhint.failAfterError());

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('HTMLHint failed. 4 errors overall:');
      stripAnsi(err.message).should.containEql(path.normalize('morethan16/test1.html'));
      stripAnsi(err.message).should.containEql(path.normalize('morethan16/test2.html'));
      stripAnsi(err.message).should.containEql('[L9:C1] Tag must be paired, missing: [ </h1> ], start tag match failed [ <h1> ]');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });

  it('should not show file errors if suppress option is explicitly set', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/invalid.html')
			.pipe(htmlhint())
			.pipe(htmlhint.failAfterError({
  suppress: true
}));

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('HTMLHint failed. 1 error overall.');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });
});

describe('customRules with htmlhintrc', () => {
  it('should throw an error when some-tag is not the first element', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/test-custom-rule/invalid-custom-rule-2.html')
			.pipe(htmlhint('test/fixtures/test-custom-rule/htmlhintrc.json', customRules))
			.pipe(htmlhint.failAfterError());

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('[L1:C1] The tag <some-tag> must be present as first element.');
      stripAnsi(err.message).should.containEql('[L5:C2] Tag must be paired, missing: [ </h1> ]');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });

  it('should throw an error when some-tag is defined more than once', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/test-custom-rule/invalid-custom-rule.html')
			.pipe(htmlhint('test/fixtures/test-custom-rule/htmlhintrc.json', customRules))
			.pipe(htmlhint.failAfterError());

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('[L4:C3] The tag <some-tag> must be present only once.');
      stripAnsi(err.message).should.containEql('[L6:C3] Tag must be paired, missing: [ </h1> ]');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });
});

describe('customRules', () => {
  it('should throw an error when some-tag is not the first element', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/test-custom-rule/invalid-custom-rule-2.html')
			.pipe(htmlhint(customRules))
			.pipe(htmlhint.failAfterError());

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('[L1:C1] The tag <some-tag> must be present as first element.');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });

  it('should throw an error when some-tag is defined more than once', done => {
    let error = false;
    const stream = vfs.src('test/fixtures/test-custom-rule/invalid-custom-rule.html')
			.pipe(htmlhint('test/htmlhintrc.json', customRules))
			.pipe(htmlhint.failAfterError());

    stream.on('error', err => {
      error = true;
      stripAnsi(err.message).should.containEql('[L4:C3] The tag <some-tag> must be present only once.');
      err.name.should.equal('Error');
      done();
    });

    stream.once('end', () => {
			/* eslint no-unused-expressions: 0 */
      error.should.be.true;
      done();
    });
  });
});
