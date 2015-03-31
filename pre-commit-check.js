//#! /usr/bin/env node
"use strict";

var Bluebird = require("bluebird"),
	base = require("./pre-commit-base");

var precommitConfig = base.getConfig(".precommitrc");

base.read()
	.then(function(data) {
		var extension = data.filename.split(".").pop(),
			fileChecker,
			validators = [];
		if (base.isIgnored(data.filename)) {
			return Bluebird.resolve(true);
		}
		try {
			fileChecker = require("./filetypes/file-" + extension);
		} catch (e) {
			// file not found
			return Bluebird.resolve(true);
		}
		if (precommitConfig.rules &&
			precommitConfig.rules[extension] &&
			Array.isArray(precommitConfig.rules[extension])
		) {
			validators = precommitConfig.rules[extension];
		}
		return fileChecker(data, validators);
	})
	.then(function() {
		base.flushMessages();
		base.done();
	})
	.catch(function() {
		base.flushMessages();
		base.done(1);
	});
