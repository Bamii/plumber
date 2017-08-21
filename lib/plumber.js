const daemon = require('daemon');
const fs = require('fs');
var os_eol = require('os').EOL;

console.log("=======================================================");
console.log("====================== Plumber ========================");
console.log("=======================================================");
console.log(os_eol);

var args = process.argv;

if (args[2].toLowerCase() !== 'connect') {
    // then we dunno what you're talking about
    console.log('Sorry, that command was NOT understood.');
    console.log(os_eol);

    console.log('Please see the README.md file packaged with the source code, or https://github.com/opeadeyomoye/plumber/blob/master/README.md for usage instructions.');
    process.exit(1);
}

// see if both ends of the pipe can be connected
var opening = process.argv[3];
var tailEnd = process.argv[4];

if (!fs.existsSync(opening)) {
    console.log('Source file does not exist! Exiting...');
    process.exit(1);
}

if (!fs.existsSync(tailEnd)) {
    console.log('Destination file does not exist! Exiting...');
    process.exit(1);
}

// start the daemon
cp = daemon.daemon(__dirname + '/pipe/index.js', [opening, tailEnd], {cwd: process.cwd()});

if (!cp.exitCode && !cp.killed) {
  console.log('A new pipe has been created!');
  console.log(`Further changes to "${opening}" will now be piped to "${tailEnd}".`);
  console.log(os_eol);

  console.log(`This process is running in the background with the PID: ${cp.pid}.`);
  console.log('To stop it, try:');
  console.log(os_eol);

  console.log(`$ kill -9 ${cp.pid}`);
  console.log(os_eol);

  console.log('Thank you for using Plumber!');
  process.exit(0);
}

console.log('The pipe could not be created.');
console.log('The process was killed, or exited prematurely.');
console.log(os_eol);
