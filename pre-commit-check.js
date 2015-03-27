//#! /usr/bin/env node
"use strict";

var Bluebird = require("bluebird"),
	path = require("path"),
	base = require("./pre-commit-base");

base.read()
	.then(function(data) {
		if (base.isIgnored(data.filename)) {
			return Bluebird.resolve(true);
		}
		var extension = data.filename.split(".").pop(),
			fileChecker;
		try {
			fileChecker = require(path.join("./filetypes", "file-" + extension));
		} catch (e) {
			// file not found
			return Bluebird.resolve(true);
		}
		return fileChecker(data);
	})
	.then(function() {
		base.done();
	})
	.catch(function() {
		base.done(1);
	});
