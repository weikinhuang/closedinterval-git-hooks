"use strict";

var q = require("q");
var path = require("path");
var base = require(path.join(__dirname, "..", "pre-commit-base"));
var csslint = require("csslint").CSSLint;
var config = base.getConfig(".csslintrc");

var rules = {};
(config.warnings || []).forEach(function(rule) {
	rules[rule] = 1;
});
(config.errors || []).forEach(function(rule) {
	rules[rule] = 2;
});

module.exports = function(data) {
	var defer = q.defer();
	var result = csslint.verify(data.src, rules);
	var hasError = false;
	if (!result || !result.messages || result.messages.length === 0) {
		defer.resolve(data);
		return defer.promise;
	}

	result.messages.forEach(function(e) {
		if (e.type === "error") {
			hasError = true;
		}
		base.writeError("CSSLINT", data.filename, e.line, e.type + ": " + e.message.replace(/ at line \d+, col \d+\.$/, "."));
	});

	if (hasError) {
		defer.reject();
	} else {
		defer.resolve(data);
	}
	return defer.promise;
};
