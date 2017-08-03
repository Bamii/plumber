const fs = require('fs');
const watcher = require('chokidar');

/*
 | Get file paths
*/
var opening = process.argv[2];
var tailEnd = process.argv[3];

console.log(process.argv);

/*
 | Make sure the files exist
*/
if (!fs.existsSync(opening)) {
    console.log('Source file does not exist! Exiting...');
    process.exit(0); // @todo: appropriate exit code
}

if (!fs.existsSync(tailEnd)) {
    console.log('Destination file does not exist! Exiting...');
    process.exit(0); // @todo: appropriate exit code
}


var file = watcher.watch(opening, {persistent: true});

if (file) {
    console.log(`${opening} is now being watched for changes.`);
}

file.on('change', function (path) {
    console.log(`${path} has been edited`);
    
    if (!push(opening, tailEnd)) {
        console.log('Could not update tail end of the pipe.');
    } else {
        console.log('Destination file has been updated');
    }
});

/**
 * Tries to push contents of one file to another.
 * 
 * @param string source 
 * @param string destination 
 * 
 * @return boolean
 */
function push(source, destination) {
    console.log([source, destination]);
    let srcStream = fs.readFileSync(source, {encoding: 'utf-8'});

    if (!srcStream) {
        console.log(srcStream);
        return false;
    }

    fs.writeFileSync(destination, srcStream, {encoding: 'utf-8'});
    delete srcStream;
    return true;
}
