"use strict";

var Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	csslint = require("../plugins/csslint");

var additionalChecks = base.loadFileCheckerPlugins();

/**
 * Run css file checkers
 * @param {{filename: String, src: String}} data
 * @param {Array} validators
 * @param {Function} reporter
 * @returns {Promise}
 */
module.exports = function cssFileCheck(data, validators, reporter) {
	var filename = data.filename,
		src = data.src,
		validations = [];

	if (~validators.indexOf("csslint")) {
		validations.push(csslint(data, reporter));
	}
	// load any additional validators
	validators.forEach(function(validator) {
		if (typeof additionalChecks[validator] === "function") {
			validations.push(additionalChecks[validator]({
				filename : filename,
				src : src
			}, reporter));
		}
	});

	return Bluebird.all(validations);
};
