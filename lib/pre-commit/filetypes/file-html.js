"use strict";

const Bluebird = require("bluebird"),
	base = require("../pre-commit-base"),
	csslint = require("../plugins/csslint"),
	eslint = require("../plugins/eslint"),
	jscs = require("../plugins/jscs"),
	jshint = require("../plugins/jshint");

module.exports = function check(data, validators) {
	var jsData = {
			filename : data.filename,
			src : base.extractScripts(data.src)
		},
		validations = [];

	if (~validators.indexOf("eslint")) {
		validations.push(eslint(jsData));
	}
	if (~validators.indexOf("jshint")) {
		validations.push(jshint(jsData));
	}
	if (~validators.indexOf("jscs")) {
		validations.push(jscs(jsData));
	}
	if (~validators.indexOf("csslint")) {
		validations.push(csslint({
			filename : data.filename,
			src : base.extractStyles(data.src)
		}));
	}

	return Bluebird.all(validations);
};
