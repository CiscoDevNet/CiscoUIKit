
const bytes = require('pretty-bytes')
const map   = require('map-stream')
const chalk = require('chalk')

module.exports = function(options) {
  options = options || {}

  var paths  = 'path relative'.split(' ')
  var colors = 'black blue cyan gray green red white yellow'.split(' ')

  options.prefix   = options.prefix || 'Using'
  options.path     = paths.indexOf(options.path) != -1 ? options.path : 'cwd'
  options.color    = colors.indexOf(options.color) != -1 ? options.color : 'magenta'
  options.filesize = typeof options.filesize !== 'undefined' ? options.filesize : false

  return map(function(file, cb) {

    var f = file.path.replace(file.cwd, '.')
    if (options.path == 'relative')  { f = file.relative }
    else if (options.path == 'path') { f = file.path }

    if (options.filesize && file.contents) {
      f += (' - ' + bytes(file.contents.length))
    }

    var time = '['+chalk.gray(new Date().toTimeString().slice(0, 8))+']'

    console.log(time, options.prefix, chalk[options.color](f))

    cb(null, file)
  })
}
