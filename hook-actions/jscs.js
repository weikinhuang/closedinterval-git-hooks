"use strict";

var q = require("q");
var path = require("path");
var base = require(path.join(__dirname, "..", "pre-commit-base"));
var jscsChecker = require("jscs/lib/checker");
var config = base.getConfig(".jscsrc");

module.exports = function(data) {
	var defer = q.defer();
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
		defer.reject();
	} else {
		defer.resolve();
	}
	return defer.promise;
};
