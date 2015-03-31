"use strict";

var runner;
try {
	runner = require("./lib/" + process.argv[2]);
	runner(process.argv.slice(3))
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
} catch (e) {
	// empty
}
