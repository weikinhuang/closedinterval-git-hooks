"use strict";

const Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	csslint = require("csslint").CSSLint;

const config = base.getConfig(".csslintrc");

var rules = {};
(config.warnings || []).forEach(function(rule) {
	rules[rule] = 1;
});
(config.errors || []).forEach(function(rule) {
	rules[rule] = 2;
});

module.exports = function(data) {
	return new Bluebird(function(resolve, reject) {
		var hasError = false,
			result = csslint.verify(data.src, rules);

		if (!result || !result.messages || result.messages.length === 0) {
			return resolve(data);
		}

		result.messages.forEach(function(e) {
			if (e.type === "error") {
				hasError = true;
			}
			base.writeError("CSSLINT", data.filename, e.line, e.type + ": " + e.message.replace(/ at line \d+, col \d+\.$/, "."));
		});

		if (hasError) {
			reject();
		} else {
			resolve(data);
		}
	});
};