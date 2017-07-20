var fs = require('fs');
var os = require('os');
var through2 = require('through2');
var gutil = require('gulp-util');
var stripJsonComments = require('strip-json-comments');
var PluginError = require('gulp-util').PluginError;
var HTMLHint = require('htmlhint').HTMLHint;

var beep = gutil.beep;
var c = gutil.colors;

var formatOutput = function (report, file, options) {
    'use strict';
    if (!report.length) {
        return {
            success: true
        };
    }

    var filePath = (file.path || 'stdin');

    // Handle errors
    var messages = report.filter(function (err) {
        return err;
    }).map(function (err) {
        return {
            file: filePath,
            error: err
        };
    });

    var output = {
        errorCount: messages.length,
        success: false,
        messages: messages,
        options: options
    };

    return output;
};

var htmlhintPlugin = function (options) {
    'use strict';

    var ruleset = {};

    if (!options) {
        options = {};
    }

    // Read Htmlhint options from a specified htmlhintrc file.
    if (typeof options === 'string') {
        // Don't catch readFile errors, let them bubble up
        options = {
            htmlhintrc: './' + options
        };
    }

    // if necessary check for required param(s), e.g. options hash, etc.
    // read config file for htmlhint if available
    if (options.htmlhintrc) {
        try {
            var externalOptions = fs.readFileSync(options.htmlhintrc, 'utf-8');
            options = JSON.parse(stripJsonComments(externalOptions));
        } catch (err) {
            throw new Error('gulp-htmlhint: Cannot parse .htmlhintrc');
        }
    }

    // Build a list of all available rules
    for (var key in HTMLHint.defaultRuleset) {
        if (HTMLHint.defaultRuleset.hasOwnProperty(key)) {
            ruleset[key] = 1;
        }
    }

    // normalize htmlhint options
    // htmllint only checks for rulekey, so remove rule if set to false
    for (var rule in options) {
        if (options[rule]) {
            ruleset[rule] = options[rule];
        } else {
            delete ruleset[rule];
        }
    }

    return through2.obj(function (file, enc, cb) {
        var report = HTMLHint.verify(file.contents.toString(), ruleset);

        // send status down-stream
        file.htmlhint = formatOutput(report, file, options);
        cb(null, file);
    });
};

function getMessagesForFile(file) {
    'use strict';
    return file.htmlhint.messages.map(function (msg) {
        var message = msg.error;
        var evidence = message.evidence;
        var line = message.line;
        var col = message.col;
        var detail;

        if (line) {
            detail = c.yellow('L' + line) + c.red(':') + c.yellow('C' + col);
        } else {
            detail = c.yellow('GENERAL');
        }

        if (col === 0) {
            evidence = c.red('?') + evidence;
        } else if (col > evidence.length) {
            evidence = c.red(evidence + ' ');
        } else {
            evidence = evidence.slice(0, col - 1) + c.red(evidence[col - 1]) + evidence.slice(col);
        }

        return {
            message: c.red('[') + detail + c.red(']') + c.yellow(' ' + message.message) + ' (' + message.rule.id + ')',
            evidence: evidence
        };
    });
}

var defaultReporter = function (file) {
    'use strict';
    var errorCount = file.htmlhint.errorCount;
    var plural = errorCount === 1 ? '' : 's';

    beep();

    gutil.log(c.cyan(errorCount) + ' error' + plural + ' found in ' + c.magenta(file.path));

    getMessagesForFile(file).forEach(function (data) {
        gutil.log(data.message);
        gutil.log(data.evidence);
    });
};

htmlhintPlugin.addRule = function (rule) {
    'use strict';
    return HTMLHint.addRule(rule);
};

htmlhintPlugin.reporter = function (customReporter) {
    'use strict';
    var reporter = defaultReporter;

    if (typeof customReporter === 'function') {
        reporter = customReporter;
    }

    if (typeof customReporter === 'string') {
        if (customReporter === 'fail') {
            return htmlhintPlugin.failReporter();
        }

        reporter = require(customReporter);
    }

    if (typeof reporter === 'undefined') {
        throw new Error('Invalid reporter');
    }

    return through2.obj(function (file, enc, cb) {
        // Only report if HTMLHint ran and errors were found
        if (file.htmlhint && !file.htmlhint.success) {
            reporter(file);
        }

        cb(null, file);
    });
};

htmlhintPlugin.failReporter = function (opts) {
    'use strict';
    opts = opts || {};
    return through2.obj(function (file, enc, cb) {
        // something to report and has errors
        var error;
        if (file.htmlhint && !file.htmlhint.success) {
            if (opts.suppress === true) {
                error = new PluginError('gulp-htmlhint', {
                    message: 'HTMLHint failed.',
                    showStack: false
                });
            } else {
                var errorCount = file.htmlhint.errorCount;
                var plural = errorCount === 1 ? '' : 's';
                var msg = c.cyan(errorCount) + ' error' + plural + ' found in ' + c.magenta(file.path);
                var messages = [msg].concat(getMessagesForFile(file).map(function (m) {
                    return m.message;
                }));

                error = new PluginError('gulp-htmlhint', {
                    message: messages.join(os.EOL),
                    showStack: false
                });
            }
        }
        cb(error, file);
    });
};

module.exports = htmlhintPlugin;
