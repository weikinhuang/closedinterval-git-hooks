//#! /usr/bin/env node

var jshint = require("./lint-hook.lint.js");

function readFromPipe(callback) {
	"use strict";
	callback(process.argv[3]);
}

readFromPipe(function(src) {
	"use strict";
	var filename = process.argv[2];
	jshint.quit(jshint.lint(jshint.readFile(filename, src), filename) === 0 ? 0 : 1);
});
