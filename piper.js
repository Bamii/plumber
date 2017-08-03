/*
 | ================== Front ====================
 | Standardize interface for creating new pipes.
 | Daemonize newly registered pipe.
 | Maybe, subsquently, check for pipes with similar openings
   already existing, destroy and create new,
   more efficient, all-encompassing pipe.
 | Interface for spawning child processes too.
 | =============================================

 | ================ Pipe ===================
 | FS watcher to note changes in specified pipe openings (parent files)
 | Push content from opening through the pipe (to the specified child files)
*/

// NAME: Plumber(?)


// get ze command line arguments
var args = process.argv;

// determine base command
if (args[2].toLowerCase() !== 'connect') {
    // then we dunno what you're talking about
    console.log('Sorry man, that command was absolutely NOT understood.');
    process.exit(0); // @todo: uhh... the appropriate error code?
}

/*
 | Execute base command using the remaining arguments
*/