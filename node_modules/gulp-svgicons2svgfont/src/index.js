'use strict';

const SVGIcon2SVGFontStream = require('svgicons2svgfont');
const gutil = require('gulp-util');
const Stream = require('readable-stream');
const path = require('path');
const plexer = require('plexer');
const fileSorter = require('svgicons2svgfont/src/filesorter');
const defaultMetadataProvider = require('svgicons2svgfont/src/metadata');

module.exports = (options) => {
  let filesBuffer = [];
  let metadataProvider;
  const inputStream = new Stream.Transform({ objectMode: true });
  const outputStream = new Stream.PassThrough({ objectMode: true });
  const stream = plexer({ objectMode: true }, inputStream, outputStream);
  let fontStream;

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
    gutil.log(...['gulp-svgicons2svgfont:'].concat(
      [].slice.call(arguments, 0).concat()));
  };

  // Emit event containing codepoint mapping
  options.callback = function(glyphs) {
    stream.emit('glyphs', glyphs.map((glyph) => {
      const finalGlyph = {
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
    let fontFile = null;
    let buf = null;

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
      fontStream = new SVGIcon2SVGFontStream(options);
      fontStream.on('error', (err) => {
        outputStream.emit('error', err);
      });
      // Create the font file
      fontFile = new gutil.File({
        cwd: file.cwd,
        base: file.base,
        path: `${path.join(file.base, options.fileName)}.svg`,
      });

      // Giving the font back to the stream
      if(file.isBuffer()) {
        buf = Buffer.from(''); // use let when going to es6
        fontStream.on('data', (chunk) => {
          buf = Buffer.concat([buf, chunk], buf.length + chunk.length);
        });
        fontStream.on('end', () => {
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
    let bufferLength = filesBuffer.length;

    if(!bufferLength) {
      outputStream.end();
      done();
      return;
    }

    // Sorting files
    filesBuffer = filesBuffer.sort((fileA, fileB) => fileSorter(fileA.path, fileB.path));

    // Wrap icons for the underlying lib
    filesBuffer.forEach((file) => {
      let iconStream;

      if(file.isBuffer()) {
        iconStream = new Stream.PassThrough();
        setImmediate(() => {
          iconStream.write(file.contents);
          iconStream.end();
        });
      } else {
        iconStream = file.contents;
      }
      metadataProvider(file.path, (err, theMetadata) => {
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
