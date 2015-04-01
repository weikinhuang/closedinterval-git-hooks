"use strict";

const Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	jscsChecker = require("jscs/lib/checker");

const config = base.getConfig(".jscsrc");

module.exports = function(data, reporter) {
	return new Bluebird(function(resolve, reject) {
		var checker = new jscsChecker(),
			errorList,
			errors;

		checker.registerDefaultRules();

		// html files have trailing whitespace chars
		if ((/\.html$/).test(data.filename)) {
			config.disallowMultipleLineBreaks = null;
		}
		checker.configure(config);
		errors = checker.checkString(data.src, data.filename);
		errorList = errors.getErrorList();
		if (errorList.length > 0) {
			errorList.forEach(function(e) {
				reporter("JSCS", data.filename, e.line, e.message);
			});
			reject();
		} else {
			resolve();
		}
	});
};
