# gulp-cond
> A ternary operator for [Gulp](http://gulpjs.com/).

[![NPM version](https://badge.fury.io/js/gulp-cond.svg)](https://npmjs.org/package/gulp-cond)
[![Build status](https://secure.travis-ci.org/nfroidure/gulp-cond.svg)](https://travis-ci.org/nfroidure/gulp-cond)
[![Dependency Status](https://david-dm.org/nfroidure/gulp-cond.svg)](https://david-dm.org/nfroidure/gulp-cond)
[![devDependency Status](https://david-dm.org/nfroidure/gulp-cond/dev-status.svg)](https://david-dm.org/nfroidure/gulp-cond#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/nfroidure/gulp-cond/badge.svg?branch=master)](https://coveralls.io/r/nfroidure/gulp-cond?branch=master)

## Usage

First, install `gulp-cond` as a development dependency:

```shell
npm install --save-dev gulp-cond
```

Then, use it to conditionnaly pipe plugins in your `gulpfile.js`:

```js
var cond = require('gulp-cond');
var prod = gulp.env.prod;

// Images
gulp.task('build_images', function() {
  gulp.src('assets/images/**/*.svg')
    .pipe(cond(prod,
      gSvgmin(options), // minify SVG images under production
      gWatch().pipe(gLivereload(server))) // use live reload in dev mode
    )
    .pipe(gulp.dest('www/images'))
});
```

Alternatively, you can provide plugin functions instead of streams to
  instanciate streams only when needed :

```js
var cond = require('gulp-cond');
var prod = gulp.env.prod;

// Images
gulp.task('build_images', function() {
  gulp.src('assets/images/**/*.svg')
    .pipe(cond(prod,
      gSvgmin.bind(null, options), // minify SVG images under production
      function () { // use live reload in dev mode
        return gWatch().pipe(gLivereload(server));
      })
    )
    .pipe(gulp.dest('www/images'))
});
```

## API

### cond(condition, expr1, expr2)

#### condition
Type: `Boolean` or `Function`

Required. A value or a function providing a value. If the value is truthy, expr1
 will be used, else, expr2 will be use if provided.

#### expr1
Type: `Stream` or `Function`

Required. A stream or a function providing a stream.

#### expr2
Type: `Stream` or `Function`
Default value: `Stream.PassThrough`

A stream or a function providing a stream.

## Stats

[![NPM](https://nodei.co/npm/gulp-cond.png?downloads=true&stars=true)](https://nodei.co/npm/gulp-iconfont/)
[![NPM](https://nodei.co/npm-dl/gulp-cond.png)](https://nodei.co/npm/gulp-iconfont/)

### Contributing / Issues

You may want to contribute to this project, pull requests are welcome if you
 accept to publish under the MIT licence.

