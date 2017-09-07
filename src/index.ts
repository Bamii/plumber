import Pipe from "./Pipe"
import * as fs from "fs"


class Plumber
{
    /**
     * Create a new pipe between two files.
     * 
     * Checks to see if both files exist before attempting to create a pipe.
     * This method does NOT, however, try to resolve the file path
     * before looking for the file.
     *
     * @param string source 
     * @param string destination 
     *
     * @return Pipe|boolean False if any of the two files doesn't exist
     */
    public static connect(source: string, destination: string): Pipe | boolean
    {
        if (!fs.existsSync(source) || !fs.existsSync(destination)) {
            return false;
        }
        return new Pipe(source, destination)
    }
}

export default Plumber
