"use strict";

const Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	csslint = require("../plugins/csslint"),
	less = require("../plugins/less");

var additionalChecks = base.loadFileCheckerPlugins();

/**
 * Run less file checkers
 * @param {{filename: String, src: String}} data
 * @param {Array} validators
 * @param {Function} reporter
 * @returns {Promise}
 */
module.exports = function lessFileCheck(data, validators, reporter) {
	var filename = data.filename,
		lessChecker,
		src = data.src,
		validations = [];
	if (~validators.indexOf("less")) {
		lessChecker = less(data, reporter);
		if (~validators.indexOf("csslint")) {
			lessChecker = lessChecker.then(function(cssData) {
				return csslint(cssData, reporter);
			});
		}
		validations.push(lessChecker);
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
