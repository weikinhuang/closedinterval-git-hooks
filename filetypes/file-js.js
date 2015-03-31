"use strict";

const Bluebird = require("bluebird"),
	eslint = require("../plugins/eslint"),
	jscs = require("../plugins/jscs"),
	jshint = require("../plugins/jshint");

module.exports = function check(data, validators) {
	var validations = [];

	if (~validators.indexOf("eslint")) {
		validations.push(eslint(data));
	}
	if (~validators.indexOf("jshint")) {
		validations.push(jshint(data));
	}
	if (~validators.indexOf("jscs")) {
		validations.push(jscs(data));
	}

	return Bluebird.all(validations);
};
