'use strict';

var svgicons2svgfont = require('svgicons2svgfont');
var gutil = require('gulp-util');
var Stream = require('readable-stream');
var path = require('path');
var plexer = require('plexer');
var fileSorter = require('svgicons2svgfont/src/filesorter');
var defaultMetadataProvider = require('svgicons2svgfont/src/metadata');

module.exports = function(options) {
  var filesBuffer = [];
  var metadataProvider;
  var inputStream = new Stream.Transform({ objectMode: true });
  var outputStream = new Stream.PassThrough({ objectMode: true });
  var stream = plexer({ objectMode: true }, inputStream, outputStream);
  var fontStream;

  options = options || {};
  options.ignoreExt = options.ignoreExt || false;
  options.startUnicode = options.startUnicode || 0xEA01;
  options.prependUnicode = !!options.prependUnicode;
  options.fileName = options.fileName || options.fontName;

  if(options.appendUnicode) {
    throw new gutil.PluginError(
      'svgicons2svgfont',
      'The "appendUnicode" option were renamed "prependUnicode".' +
      ' See https://github.com/nfroidure/gulp-svgicons2svgfont/issues/33'
    );
  }

  if(!options.fontName) {
    throw new gutil.PluginError('svgicons2svgfont', 'Missing options.fontName');
  }

  options.log = options.log || function() {
    gutil.log.apply(gutil, ['gulp-svgicons2svgfont:'].concat(
      [].slice.call(arguments, 0).concat()));
  };

  // Emit event containing codepoint mapping
  options.callback = function(glyphs) {
    stream.emit('glyphs', glyphs.map(function(glyph) {
      var finalGlyph = {
        name: glyph.name,
        unicode: glyph.unicode,
      };
      if(glyph.color) {
        finalGlyph.color = glyph.color;
      }
      return finalGlyph;
    }));
  };

  options.error = options.error || function() {
    stream.emit('error', new gutil.PluginError('svgicons2svgfont',
      [].slice.call(arguments, 0).concat()));
  };

  metadataProvider = options.metadataProvider || defaultMetadataProvider({
    startUnicode: options.startUnicode,
    prependUnicode: options.prependUnicode,
  });

  inputStream._transform = function _gulpSVGIcons2SVGFontTransform(file, unused, done) {
    var fontFile = null;
    var buf = null;

    // When null just pass through
    if(file.isNull()) {
      outputStream.write(file); done();
      return;
    }

    // If the ext doesn't match, pass it through
    if((!options.ignoreExt) && '.svg' !== path.extname(file.path)) {
      outputStream.write(file); done();
      return;
    }

    if(0 === filesBuffer.length) {
      // Generating the font
      fontStream = svgicons2svgfont(options);
      fontStream.on('error', function(err) {
        outputStream.emit('error', err);
      });
      // Create the font file
      fontFile = new gutil.File({
        cwd: file.cwd,
        base: file.base,
        path: path.join(file.base, options.fileName) + '.svg',
      });

      // Giving the font back to the stream
      if(file.isBuffer()) {
        buf = new Buffer(''); // use let when going to es6
        fontStream.on('data', function(chunk) {
          buf = Buffer.concat([buf, chunk], buf.length + chunk.length);
        });
        fontStream.on('end', function() {
          fontFile.contents = buf;
          outputStream.push(fontFile);
          outputStream.end();
        });
      } else {
        fontFile.contents = fontStream;
        outputStream.push(fontFile);
        outputStream.end();
      }
    }

    // Otherwise buffer the files
    filesBuffer.push(file);

    done();
  };

  inputStream._flush = function _gulpSVGIcons2SVGFontFlush(done) {
    var bufferLength = filesBuffer.length;

    if(!bufferLength) {
      outputStream.end();
      return done();
    }

    // Sorting files
    filesBuffer = filesBuffer.sort(function(fileA, fileB) {
      return fileSorter(fileA.path, fileB.path);
    });

    // Wrap icons for the underlying lib
    filesBuffer.forEach(function(file) {
      var iconStream;

      if(file.isBuffer()) {
        iconStream = new Stream.PassThrough();
        setImmediate(function() {
          iconStream.write(file.contents);
          iconStream.end();
        });
      } else {
        iconStream = file.contents;
      }
      metadataProvider(file.path, function(err, theMetadata) {
        if(err) {
          fontStream.emit('error', err);
        }
        iconStream.metadata = theMetadata;

        fontStream.write(iconStream);
        if(0 === --bufferLength) {
          fontStream.end();
        }
      });
    });

    done();
  };

  return stream;
};
