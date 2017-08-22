# plumber

Plumber helps to make sure two given files always have the same content.

## Installation
Plumber runs on Node.js. Please [install Node](https://nodejs.org/en/download/) if you haven't already.

Then, in your terminal:
```bash
npm install the-plumber -g
```

## Usage
```
$ plumber connect [source-file] [destination-file]
```

Plumber then creates a "pipe" (*nix daemon that runs indefinitely) between the two files, making sure subsequent changes to the `source-file` are reflected in the `destination-file`.

Since the pipe runs indefinitely in the background, you need to stop it when you no longer want changes piped down to the destination file.

```bash
$ kill -9 [pipe-pid]
```
The `pipe-id` is returned on creating the pipe. Please see the example below.

## Example
Say we're writing an open-source WordPress plugin for [Cyclos](https://cyclos.org), and we want to continuously test this plugin with our local WordPress instance while developing it, but our folder for open source projects differs from where the plugin is actually installed.

We can create a pipe connecting the plugin  file from our version-controlled, open-source folder to our local WordPress plugins' directory like so: 
```bash
$ plumber connect /home/opeadeyomoye/open-source/cyclos/wp-cyclos.php $WWW_ROOT/wordpress/wp-content/plugins/wp-cyclos.php
```
Plumber returns something like:

```
=======================================================
====================== Plumber ========================
=======================================================


A new pipe has been created!
Further changes to "/home/opeadeyomoye/open-source/cyclos/wp-cyclos.php" will now be piped to "/var/www/html/wordpress/wp-content/plugins/wp-cyclos.php".


This process is running in the background with the PID: 15420.
To stop it, try:


$ kill -9 15420


Thank you for using Plumber!
```

## Credits
* Plumber uses [daemon.node](https://github.com/indexzero/daemon.node) by [indexzero](https://github.com/indexzero) and co.
* Also uses [chokidar](https://github.com/paulmillr/chokidar) by [paulmillr](https://github.com/paulmillr) and co.

## Contributing
Open an issue or create a PR if you:
* found a bug,
* made some improvements,
* really wanted to do a thumbs-down but can't 'cause GitHub hasn't added the button yet,
* need to teach some of these young developers the real history of Javascript.

## License
The MIT License (MIT). See [LICENSE](https://github.com/opeadeyomoye/plumber/blob/master/LICENSE) file for more details.