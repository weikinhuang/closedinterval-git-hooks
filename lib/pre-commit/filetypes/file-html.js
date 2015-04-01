"use strict";

const Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	csslint = require("../plugins/csslint"),
	eslint = require("../plugins/eslint"),
	jscs = require("../plugins/jscs"),
	jshint = require("../plugins/jshint");

var additionalChecks = base.loadFileCheckerPlugins();

/**
 * Run html file checkers
 * @param {{filename: String, src: String}} data
 * @param {Array} validators
 * @param {Function} reporter
 * @returns {Promise}
 */
module.exports = function htmlFileCheck(data, validators, reporter) {
	var filename = data.filename,
		jsData = {
			filename : data.filename,
			src : base.extractScripts(data.src)
		},
		src = data.src,
		validations = [];

	if (~validators.indexOf("eslint")) {
		validations.push(eslint(jsData, reporter));
	}
	if (~validators.indexOf("jshint")) {
		validations.push(jshint(jsData, reporter));
	}
	if (~validators.indexOf("jscs")) {
		validations.push(jscs(jsData, reporter));
	}
	if (~validators.indexOf("csslint")) {
		validations.push(csslint({
			filename : data.filename,
			src : base.extractStyles(data.src)
		}, reporter));
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
