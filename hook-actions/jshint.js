"use strict";

var Bluebird = require("bluebird");
var path = require("path");
var base = require(path.join(__dirname, "..", "pre-commit-base"));
var jshint = require("jshint").JSHINT;
var config = base.getConfig(".jshintrc");

module.exports = function(data) {
	return new Bluebird(function(resolve, reject) {
		if (!jshint(data.src, config || {}, config.globals || {})) {
			jshint.errors.forEach(function(e) {
				if (!e || !e.evidence) {
					return;
				}
				base.writeError("JSHINT", data.filename, e.line, e.reason);
			});
			reject();
		} else {
			resolve(data);
		}
	});
};
