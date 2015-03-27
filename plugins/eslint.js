"use strict";

var Bluebird = require("bluebird");
var base = require("../pre-commit-base");
var eslint = require("eslint").linter;
var config = base.getConfig(".eslintrc");

module.exports = function(data) {
	return new Bluebird(function(resolve, reject) {
		var messages = eslint.verify(data.src, config, data.filename),
			hasErrors = false;

		// no errors!
		if (messages.length === 0) {
			return resolve(data);
		}

		messages.forEach(function(e) {
			if (e.severity !== 2) {
				return;
			}
			hasErrors = true;
			base.writeError("ESLINT", data.filename, e.line, e.ruleId + " - " + e.message);
		});

		if (hasErrors) {
			reject();
		} else {
			resolve(data);
		}
	});
};
