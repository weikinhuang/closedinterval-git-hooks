"use strict";

var q = require("q");
var path = require("path");
var base = require(path.join(__dirname, "..", "pre-commit-base"));
var jshint = require("jshint").JSHINT, config = {};
var fs = require("fs");
try {
	config.options = JSON.parse(fs.readFileSync(".jshintrc", {
		encoding : "utf-8"
	}));
} catch (e) {
}

module.exports = function(data) {
	var defer = q.defer();
	if (!jshint(data.src, config.options || {})) {
		jshint.errors.forEach(function(e) {
			if (!e || !e.evidence) {
				return;
			}
			base.writeError("JSHINT", data.filename, e.line, e.reason);
		});
		defer.reject();
	} else {
		defer.resolve(data);
	}
	return defer.promise;
};
