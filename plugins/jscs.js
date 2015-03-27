"use strict";

var Bluebird = require("bluebird");
var base = require("../pre-commit-base");
var jscsChecker = require("jscs/lib/checker");
var config = base.getConfig(".jscsrc");

module.exports = function(data) {
	return new Bluebird(function(resolve, reject) {
		var checker = new jscsChecker();
		checker.registerDefaultRules();
		// html files have trailing whitespace chars
		if ((/\.html$/).test(data.filename)) {
			config.disallowMultipleLineBreaks = null;
		}
		checker.configure(config);
		var errors = checker.checkString(data.src, data.filename);
		var errorList = errors.getErrorList();
		if (errorList.length > 0) {
			errorList.forEach(function(e) {
				base.writeError("JSCS", data.filename, e.line, e.message);
			});
			reject();
		} else {
			resolve();
		}
	});
};
