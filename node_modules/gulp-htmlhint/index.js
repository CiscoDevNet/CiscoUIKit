const fs = require('fs');
const os = require('os');
const beep = require('beeper');
const c = require('ansi-colors');
const flog = require('fancy-log');
const through2 = require('through2');
const PluginError = require('plugin-error');
const stripJsonComments = require('strip-json-comments');
const HTMLHint = require('htmlhint').HTMLHint;

const formatOutput = function (report, file, options) {
  'use strict';
  if (report.length === 0) {
    return {
      success: true
    };
  }

  const filePath = (file.path || 'stdin');

  // Handle errors
  const messages = report.filter(err => {
    return err;
  }).map(err => {
    return {
      file: filePath,
      error: err
    };
  });

  const output = {
    errorCount: messages.length,
    success: false,
    messages,
    options
  };

  return output;
};

const htmlhintPlugin = function (options, customRules) {
  'use strict';

  const ruleset = {};

  if (!customRules && options && Array.isArray(options) && options.length > 0) {
    customRules = options;
    options = {};
  }

  if (!options) {
    options = {};
  }

  // Read Htmlhint options from a specified htmlhintrc file.
  if (typeof options === 'string') {
    // Don't catch readFile errors, let them bubble up
    options = {
      htmlhintrc: './' + options
    };

    // If necessary check for required param(s), e.g. options hash, etc.
    // read config file for htmlhint if available
    if (options.htmlhintrc) {
      try {
        const externalOptions = fs.readFileSync(options.htmlhintrc, 'utf-8');
        options = JSON.parse(stripJsonComments(externalOptions));
      } catch (err) {
        throw new Error('gulp-htmlhint: Cannot parse .htmlhintrc');
      }
    }
  }

  if (Object.keys(options).length > 0) {
    // Build a list of all available rules
    for (const key in HTMLHint.defaultRuleset) {
      if (HTMLHint.defaultRuleset.hasOwnProperty(key)) { // eslint-disable-line no-prototype-builtins
        ruleset[key] = 1;
      }
    }

    // Normalize htmlhint options
    // htmlhint only checks for rulekey, so remove rule if set to false
    for (const rule in options) {
      if (options[rule]) {
        ruleset[rule] = options[rule];
      } else {
        delete ruleset[rule];
      }
    }
  }

  // Add the defined custom rules
  // This will not require adding the costume rule id to the .htmlhintrc file
  if (customRules !== null && Array.isArray(customRules) && customRules.length > 0) {
    const has = Object.prototype.hasOwnProperty;
    for (const rule of customRules) {
      if (typeof rule === 'object') {
        HTMLHint.addRule(rule);
        if (has.call(rule, 'id')) {
          ruleset[rule.id] = true;
        }
      }
    }
  }

  return through2.obj((file, enc, cb) => {
    const report = HTMLHint.verify(file.contents.toString(), ruleset);

  // Send status down-stream
    file.htmlhint = formatOutput(report, file, options);
    cb(null, file);
  });
};

function getMessagesForFile(file) {
  'use strict';
  return file.htmlhint.messages.map(msg => {
    const message = msg.error;
    let evidence = message.evidence;
    const line = message.line;
    const col = message.col;
    let detail;

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
      evidence
    };
  });
}

const defaultReporter = function (file) {
  'use strict';
  const errorCount = file.htmlhint.errorCount;
  const plural = errorCount === 1 ? '' : 's';

  beep();

  flog(c.cyan(errorCount) + ' error' + plural + ' found in ' + c.magenta(file.path));

  getMessagesForFile(file).forEach(data => {
    flog(data.message);
    flog(data.evidence);
  });
};

htmlhintPlugin.addRule = function (rule) {
  'use strict';
  return HTMLHint.addRule(rule);
};

htmlhintPlugin.reporter = function (customReporter, options) {
  'use strict';
  let reporter = defaultReporter;

  if (typeof customReporter === 'function') {
    reporter = customReporter;
  }

  if (typeof customReporter === 'string') {
    if (customReporter === 'fail' || customReporter === 'failOn') {
      return htmlhintPlugin.failOnError();
    } else if (customReporter === 'failAfter') {
      return htmlhintPlugin.failAfterError();
    }

    reporter = require(customReporter);
  }

  if (typeof reporter === 'undefined') {
    throw new TypeError('Invalid reporter');
  }

  return through2.obj((file, enc, cb) => {
    // Only report if HTMLHint ran and errors were found
    if (file.htmlhint && !file.htmlhint.success) {
      reporter(file, file.htmlhint.messages, options);
    }

    cb(null, file);
  });
};

htmlhintPlugin.failOnError = function (opts) {
  'use strict';
  opts = opts || {};
  return through2.obj((file, enc, cb) => {
    // Something to report and has errors
    let error;
    if (file.htmlhint && !file.htmlhint.success) {
      if (opts.suppress === true) {
        error = new PluginError('gulp-htmlhint', {
          message: 'HTMLHint failed.',
          showStack: false
        });
      } else {
        const errorCount = file.htmlhint.errorCount;
        const plural = errorCount === 1 ? '' : 's';
        const msg = c.cyan(errorCount) + ' error' + plural + ' found in ' + c.magenta(file.path);
        const messages = [msg].concat(getMessagesForFile(file).map(m => {
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

htmlhintPlugin.failAfterError = function (opts) {
  'use strict';
  opts = opts || {};
  let globalErrorCount = 0;
  let globalErrorMessage = '';
  return through2.obj(check, summarize);

  function check(file, enc, cb) {
    if (file.htmlhint && !file.htmlhint.success) {
      if (opts.suppress === true) {
        globalErrorCount += file.htmlhint.errorCount;
      } else {
        globalErrorCount += file.htmlhint.errorCount;
        const plural = file.htmlhint.errorCount === 1 ? '' : 's';
        const msg = c.cyan(file.htmlhint.errorCount) + ' error' + plural + ' found in ' + c.magenta(file.path);
        const messages = [msg].concat(getMessagesForFile(file).map(m => {
          return m.message;
        }));

        globalErrorMessage += messages.join(os.EOL) + os.EOL;
      }
    }
    cb(null, file);
  }

  function summarize(cb) {
    if (!globalErrorCount) {
      cb();
      return;
    }

    const plural = globalErrorCount === 1 ? '' : 's';
    const message = globalErrorMessage ?
      c.cyan(globalErrorCount) + ' error' + plural + ' overall:' + os.EOL + globalErrorMessage :
      c.cyan(globalErrorCount) + ' error' + plural + ' overall.';

    const error = new PluginError('gulp-htmlhint', {
      message: 'HTMLHint failed. ' + message,
      showStack: false
    });
    cb(error);
  }
};

// Backward compatibility
htmlhintPlugin.failReporter = htmlhintPlugin.failOnError;

module.exports = htmlhintPlugin;
