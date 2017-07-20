# gulp-htmlhint [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> [htmlhint](https://github.com/yaniswang/HTMLHint) wrapper for [gulp](https://github.com/wearefractal/gulp) to validate your HTML


## Usage

First, install `gulp-htmlhint` as a development dependency:

```shell
npm install --save-dev gulp-htmlhint
```

Then, add it to your `gulpfile.js`:

```javascript
var htmlhint = require("gulp-htmlhint");

gulp.src("./src/*.html")
	.pipe(htmlhint())
```



## API

### htmlhint(options)

See all rules here: [https://github.com/yaniswang/HTMLHint/wiki/Rules](https://github.com/yaniswang/HTMLHint/wiki/Rules)

If options is empty, task use standard options.

#### options.htmlhintrc
Type: `String`
Default value: `null`

If this filename is specified, options and globals defined there will be used. Task and target options override the options within the `htmlhintrc` file. The `htmlhintrc` file must be valid JSON and looks something like this:

```json
{
  "tag-pair": true,
}
```

```javascript
var htmlhint = require("gulp-htmlhint");

gulp.src("./src/*.html")
	.pipe(htmlhint('.htmlhintrc'))
```


## Reporters

### Default reporter
```javascript
var htmlhint = require("gulp-htmlhint");

gulp.src("./src/*.html")
	.pipe(htmlhint())
	.pipe(htmlhint.reporter())
```


### Fail reporter

Use this reporter if you want your task to fail in case of a HTMLHint Error.
It also prints a summary of all errors in the first bad file.

```javascript
var htmlhint = require("gulp-htmlhint");

gulp.src("./src/*.html")
	.pipe(htmlhint())
	.pipe(htmlhint.failReporter())
```

Optionally, you can pass the `htmlhint.failReporter` a config object

__Plugin options:__

- *suppress*

  When set to `true`, it does not display file errors on failure.
  Use in conjunction with the default and/or custom reporter(s).
  Prevents duplication of error messages when used along with another reporter.

  ```javascript
  var htmlhint = require("gulp-htmlhint");

  gulp.src("./src/*.html")
	  .pipe(htmlhint())
	  .pipe(htmlhint.reporter("htmlhint-stylish"))
	  .pipe(htmlhint.failReporter({ suppress: true })
  ```

## License

[MIT License](bezoerb.mit-license.org)

[npm-url]: https://npmjs.org/package/gulp-htmlhint
[npm-image]: https://badge.fury.io/js/gulp-htmlhint.svg

[travis-url]: http://travis-ci.org/bezoerb/gulp-htmlhint
[travis-image]: https://secure.travis-ci.org/bezoerb/gulp-htmlhint.svg?branch=master

[depstat-url]: https://david-dm.org/bezoerb/gulp-htmlhint
[depstat-image]: https://david-dm.org/bezoerb/gulp-htmlhint.svg
