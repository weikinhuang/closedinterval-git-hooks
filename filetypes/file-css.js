"use strict";

const Bluebird = require("bluebird"),
	csslint = require("../plugins/csslint");

module.exports = function check(data, validators) {
	var validations = [];
	if (~validators.indexOf("csslint")) {
		validations.push(csslint(data));
	}
	return Bluebird.all(validations);
};
