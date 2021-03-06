"use strict";

var Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	jshint = require("jshint").JSHINT;

var config = base.getConfig(".jshintrc");

/**
 * Run the file through jshint for validation
 * @param {{filename: String, src: String}} data
 * @param {Function} reporter
 * @returns {Promise}
 */
module.exports = function jshintCheck(data, reporter) {
	return new Bluebird(function(resolve, reject) {
		if (!jshint(data.src, config || {}, config.globals || {})) {
			jshint.errors.forEach(function(e) {
				if (!e || !e.evidence) {
					return;
				}
				reporter("JSHINT", data.filename, e.line, e.reason);
			});
			reject();
		} else {
			resolve(data);
		}
	});
};
