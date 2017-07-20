# gulp-pxtorem [![NPM version](https://badge.fury.io/js/gulp-pxtorem.svg)](http://badge.fury.io/js/gulp-pxtorem)

This is a Gulp plugin for [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem).

### Installation

```shell
npm install gulp-pxtorem --save-dev
```

### Example

```js
var pxtorem = require('gulp-pxtorem');

gulp.task('css', function() {
    gulp.src('css/**/*.css')
        .pipe(pxtorem())
        .pipe(gulp.dest('css'));
});
```

### Options

Pass in two option objects. The first one for [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) options, the second for [postcss](https://github.com/postcss/postcss) options.

```js
var pxtorem = require('gulp-pxtorem');

var pxtoremOptions = {
    replace: false
};

var postcssOptions = {
    map: true  
};

gulp.task('css', function() {
    gulp.src('css/**/*.css')
        .pipe(pxtorem(pxtoremOptions, postcssOptions))
        .pipe(gulp.dest('css'));
});
```
