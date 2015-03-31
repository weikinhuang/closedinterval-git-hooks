"use strict";

const Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	eslint = require("eslint").linter;

const config = base.getConfig(".eslintrc");

module.exports = function(data) {
	return new Bluebird(function(resolve, reject) {
		var hasErrors = false,
			messages;

		// html files have trailing whitespace chars
		if ((/\.html$/).test(data.filename)) {
			config.rules["no-multiple-empty-lines"] = 0;
		}

		messages = eslint.verify(data.src, config, data.filename);

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