'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var postcss = require('postcss');
var pxtorem = require('postcss-pxtorem');

var PLUGIN_NAME = 'gulp-pxtorem';

module.exports = function (options, postcssOptions) {

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        try {
            file.contents = new Buffer(postcss(pxtorem(options)).process(file.contents.toString(), postcssOptions).css);
        } catch (err) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
        }

        this.push(file);
        cb();
    });
};
