"use strict";

const Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	eslint = require("../plugins/eslint"),
	jscs = require("../plugins/jscs"),
	jshint = require("../plugins/jshint");

var additionalChecks = base.loadFileCheckerPlugins();

/**
 * Run js file checkers
 * @param {{filename: String, src: String}} data
 * @param {Array} validators
 * @param {Function} reporter
 * @returns {Promise}
 */
module.exports = function jsFileCheck(data, validators, reporter) {
	var filename = data.filename,
		src = data.src,
		validations = [];

	if (~validators.indexOf("eslint")) {
		validations.push(eslint(data, reporter));
	}
	if (~validators.indexOf("jshint")) {
		validations.push(jshint(data, reporter));
	}
	if (~validators.indexOf("jscs")) {
		validations.push(jscs(data, reporter));
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
