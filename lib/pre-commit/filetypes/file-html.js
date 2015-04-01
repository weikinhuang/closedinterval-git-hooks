"use strict";

const Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	csslint = require("../plugins/csslint"),
	eslint = require("../plugins/eslint"),
	jscs = require("../plugins/jscs"),
	jshint = require("../plugins/jshint");

module.exports = function check(data, validators, reporter) {
	var jsData = {
			filename : data.filename,
			src : base.extractScripts(data.src)
		},
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

	return Bluebird.all(validations);
};
