import Pipe from "./Pipe"

var opening: string = process.argv[2]
var tailEnd: string = process.argv[3];

var pipe = new Pipe(opening, tailEnd)

pipe.startWatch()
