//
// How to use
//
// 0) edit 'filepattern' variable in Config section.
// 1) $ node oremake.js
//

//
// Config
//
var filepattern = "{**/*.cc,**/*.cpp,**/*.h}"

// glob is avaiable with 'npm install glob'
var fs = require('fs')
var Path = require('path');
var spawn = require('child_process').spawn;
var glob = require('glob')

// global
var invoking_make = false;

// notify
function notify(title, msg) {
  spawn(__dirname + '/notify.sh', [ title || 'oremake', msg ]);
}

// invoke make
function invoke_make(file, curr, prev) {
  console.log("# -- invoking make... changed: " + file);

  invoking_make = true;

  mk = spawn('make');

  mk.stdout.on('data', function(data) {
    // console.log() appends newline, so use process.stdout.write() instead.
    process.stdout.write(data);
  });

  mk.stderr.on('data', function(data) {
    process.stderr.write(data);
  });

  mk.on('exit', function (code) {
    console.log('return code:' + code);
    if (code == 0) {
      notify(file, "Compile OK!");
    }
    console.log("# -- make done!");
    invoking_make = false;
  });
}

glob(filepattern, function (er, files) {
  console.log(files);
  console.log("# -- Start watching files... ");

  files.forEach(function(file) {
    fs.watchFile(file,
                 { presistent: true, interval: 1000},
                 function(curr, prev) {
      //console.log('size:' + curr.size + ', mtime:' + curr.mtime)
      //console.log(file);
      if (!invoking_make) {
        invoke_make(file, curr, prev);
      }
    });
  });

});

