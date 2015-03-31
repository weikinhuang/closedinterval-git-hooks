"use strict";

const Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	jshint = require("jshint").JSHINT;

const config = base.getConfig(".jshintrc");

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
