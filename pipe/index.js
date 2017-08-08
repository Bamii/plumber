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

/*
 | Watch for file changes, push 'em through the pipe
*/
file.on('change', function (path) {
    console.log(`${path} has been edited`);
    
    push(opening, tailEnd, function(err) {
        if (!err) {
            return console.log('Destination file has been updated');
        }
        console.error('Could not update tail end of the pipe.');
    });
});

/**
 * Tries to push contents of one file to another.
 * 
 * @param string source 
 * @param string destination 
 * @param function callback
 * 
 * @return boolean
 */
function push(source, destination, callback) {
    console.log([source, destination]);

    fs.readFile(source, function(err, buffer) {
        if (err) {
            return callback(err)
        }
        fs.writeFile(destination, buffer, function(err) {
            if (err) {
                return callback(err);
            }
        });
    });
    callback(false); // no errors
}

function callerFunction() {

}

function watcherFunction() {
    // starts the watch, non-persistently
    let updateSuccessful = false;
    let file = watcher.watch(opening, {persistent: false});

    file.on('ready', path => { console.log(`${path} is now being watched for changes`) })
        .on('change',path => {
            console.log(`${path} has been edited`);
            if (!pushSync(opening, tailEnd)) {
                console.log('Could not update tail end of the pipe.');
            } else {
                console.log('Destination file has been updated');
                restarterFunction();
            }
        });
    
    return updateSuccessful;
}

function restarterFunction() {
    // calls the caller to start the watch if a condition is met
}

function pushSync(source, destination) {
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
