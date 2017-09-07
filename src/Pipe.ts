import * as fs from "fs"
import * as os from "os"
import * as chokidar from "chokidar"
import {Promise} from 'es6-promise';

/**
 * A "push" function to run after the source has been updated
 * 
 * 1.1 is still quite simple:
 * 
 * Constrcutor sets up the file watcher, saves the child
 * process object.
 * 
 * The pipe class already provides callbacks for updating
 * the destination's content and whatnot
 * 
 * What we gotta do:
 * 
 * ============== In a daemonized script =============
 * watch the source for changes
 * push to the destination when those changes occur
 * ==================================================
 * 
 * We might need a "daemon.ts" ==> this
 * 
 * Hence, plumber takes care of our plumbing, which is a collection of pipes
 * 
 * Plumbing library can add new files, maybe kill the daemon and start a new one.
 * 
 * Hence, the pipe class here is a collection of methods that the damonized script uses
 * i.e, we keep the daemon simple, and keep TESTABLE code in the "Pipe" library
 * 
 */
class Pipe
{
    public readonly opening: string
    public readonly tailEnd: string

    protected watcher: chokidar.FSWatcher

    public constructor(opening: string, tailEnd: string)
    {
        this.opening = opening
        this.tailEnd = tailEnd
    }

    public startWatch(): void
    {
        this.watcher = chokidar.watch(this.opening, {persistent: true})
            .on('change', this.push)
    }

    public push(): void
    {
        this.readFromSource()
            .catch(/* log something */)
            .then(this.writeToDestination)
            .catch(function() {console.log('Could not update destination file.')})
            .then(this.startWatch);
    }

    public readFromSource(): Promise<{}>
    {
        this.watcher.close()
        return new Promise((resolve, reject) => {
            let buffer = fs.readFileSync(this.opening)
            return (buffer) ? resolve(buffer) : reject()
        });
    }

    public writeToDestination(buffer: Buffer): Promise<{}>
    {
        return new Promise((resolve, reject) => {
            let error = false;
            
            let writeStream = fs.createWriteStream(this.tailEnd);
            writeStream.on('error', (fd) => {error = true});
            writeStream.on('finish', () => {
                console.log(`Destination file may have been updated with (${buffer}) ` + os.EOL + buffer.toString());
            });
            writeStream.write(buffer);
            writeStream.end();

            return (error) ? reject('Could not write to destination file') : resolve();
        });
    }
}

export default Pipe
