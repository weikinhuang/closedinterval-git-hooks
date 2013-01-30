//#! /usr/bin/env node

var jshint = require("./lint-hook.lint.js");

var files = [];
if (process.argv[2]) {
	// see if it's a directory or a file
	if (jshint.isDirectory(process.argv[2])) {
		files = files.concat(jshint.getFiles(process.argv[2]));
	} else {
		files.push(process.argv[2]);
	}
}

// if we didn't pass in any files then just get all the files
if (files.length === 0) {
	files = files.concat(jshint.getFiles("."));
}

/**
 * Given an Array of filenames, print wrapping output and process them.
 *
 * @param files {Array} filenames list
 * @return {Number} exit code
 */
function processFiles(files) {
	var errroCount = 0;
	if (!files.length) {
		jshint.print("jshint: No files specified.");
		return 1;
	} else {
		files.forEach(function(filename) {
			errroCount += jshint.lint(jshint.readFile(filename), filename);
		});
	}
	return errroCount > 0 ? 1 : 0;
}

jshint.quit(processFiles(files));
