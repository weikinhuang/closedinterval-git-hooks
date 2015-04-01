"use strict";

const Bluebird = require("bluebird"),
	fs = require("fs"),
	fileHookRunner = require("./lib/file-hook-runner"),
	path = require("path");

var cliArgs = process.argv.slice(3),
	promises = [];

// check the built in runner
try {
	promises.push(require("./lib/hooks/" + process.argv[2]));
} catch (e) {
	// empty
}
// next try to load any built into the repo
try {
	fs.readdirSync(path.join(process.cwd(), ".git-hooks", process.argv[2]))
		.forEach(function(file) {
			promises.push(
				fileHookRunner(
					path.join(process.cwd(), ".git-hooks", process.argv[2], file)
				)
			);
		});
} catch (e) {
	// empty
}

Bluebird.reduce(promises, function(memo, fn) {
	return fn(cliArgs);
}, 0)
	.then(function() {
		setTimeout(function() {
			process.exit(0);
		}, 15);
	})
	.catch(function() {
		setTimeout(function() {
			process.exit(1);
		}, 15);
	});
