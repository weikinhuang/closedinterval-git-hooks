"use strict";

const Bluebird = require("bluebird"),
	eslint = require("../plugins/eslint"),
	jscs = require("../plugins/jscs"),
	jshint = require("../plugins/jshint");

module.exports = function check(data, validators, reporter) {
	var validations = [];

	if (~validators.indexOf("eslint")) {
		validations.push(eslint(data, reporter));
	}
	if (~validators.indexOf("jshint")) {
		validations.push(jshint(data, reporter));
	}
	if (~validators.indexOf("jscs")) {
		validations.push(jscs(data, reporter));
	}

	return Bluebird.all(validations);
};
