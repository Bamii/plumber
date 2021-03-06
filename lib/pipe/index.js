const fs = require('fs');
const watcher = require('chokidar');
const os = require('os');

/*
 | Get file paths
*/
var opening = process.argv[2];
var tailEnd = process.argv[3];

console.log(process.argv);

/*
 | Shall we?
*/
var fileWatcher;
watchFile(opening);

/*
 | Start watch, register callbacks.
*/
function watchFile(opening) {
    fileWatcher = watcher.watch(opening, {persistent: true})
        .on('change', onFileChange)
        .on('ready', function () {console.log(`${opening} is now being watched for changes.`)});
}


function onFileChange(path) {
    console.log(`${path} has been edited.`);

    readFromFile(path)
    .catch(function() {console.log('Could not read from file.')})
    .then(function (buffer) { return writeToFile(buffer, tailEnd) })
    .catch(function() {console.log('Could not update destination file.')})
    .then(watchFile(path));
}


function readFromFile(file) {
    fileWatcher.close()
    return new Promise(function (resolve, reject) {
        let buffer = fs.readFileSync(file);
        return (buffer) ? resolve(buffer) : reject();
    });
}


function writeToFile(buffer, file) {
    return new Promise(function (resolve, reject) {
        var error = false;
        
        var writeStream = fs.createWriteStream(file);
        writeStream.on('error', (fd) => {error = true});
        writeStream.on('finish', () => {
            console.log(`Destination file may have been updated with (${buffer.length}) ` + os.EOL + buffer.toString());
        });
        writeStream.write(buffer);
        writeStream.end();

        return (error) ? reject('Could not write to destination file') : resolve();
    });
}
