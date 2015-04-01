"use strict";

var Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	eslint = require("eslint").linter;

var config = base.getConfig(".eslintrc");

/**
 * Run the file through eslint for validation
 * @param {{filename: String, src: String}} data
 * @param {Function} reporter
 * @returns {Promise}
 */
module.exports = function eslintCheck(data, reporter) {
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
			reporter("ESLINT", data.filename, e.line, e.ruleId + " - " + e.message);
		});

		if (hasErrors) {
			reject();
		} else {
			resolve(data);
		}
	});
};
