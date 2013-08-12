/**
 * Encapsulates all of the CLI functionality. The api argument simply
 * provides environment-specific functionality.
 */
var CSSLint = require("../node_modules/csslint/release/csslint-node").CSSLint;
require("./lint.cli-formatter.js");
var cli = require("./lint-hook.cli.js");
var cliInterface = require("./lint-hook.node-opts.js");

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

readFromPipe(function(stdin) {
	// specific instance for the git hook
	cliInterface.loadFile = function(filename) {
		return stdin;
	};
	// don't do any lookups
	cliInterface.isDirectory = function(filename) {
		return false;
	};
	cli(cliInterface);
});
