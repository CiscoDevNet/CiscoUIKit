var ChildProcess = require('child_process');
var path = require('path');

var c = ChildProcess.spawn('node', [path.resolve(__dirname,'./bin/htmlhint'),'--format', 'json', path.resolve(__dirname+'/test.html')]);
var stdoutEnd = false;
var processEnd = false;

c.stdout.on('close', function() {
    stdoutEnd = true;
});

c.on('exit', function() {
    processEnd = true;
});

c.stdout.on('data', function(text) {
    console.log(text.toString())
    console.log(stdoutEnd, processEnd)
});
