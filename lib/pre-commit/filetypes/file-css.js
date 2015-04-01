"use strict";

const Bluebird = require("bluebird"),
	csslint = require("../plugins/csslint");

module.exports = function check(data, validators, report) {
	var validations = [];
	if (~validators.indexOf("csslint")) {
		validations.push(csslint(data, report));
	}
	return Bluebird.all(validations);
};
