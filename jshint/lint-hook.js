//#! /usr/bin/env node

var jshint = require("./lint-hook.lint.js");

function readFromPipe(callback) {
	"use strict";
	var stdin = process.openStdin();
	stdin.setEncoding("utf8");
	var text = "";
	stdin.on("data", function(chunk) {
		text += chunk;
	});
	stdin.on("end", function() {
		callback(text);
	});
}

readFromPipe(function(src) {
	"use strict";
	var filename = process.argv[2];
	jshint.quit(jshint.lint(jshint.readFile(filename, src), filename) === 0 ? 0 : 1);
});
