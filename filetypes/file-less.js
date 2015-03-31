"use strict";

const Bluebird = require("bluebird"),
	csslint = require("../plugins/csslint"),
	less = require("../plugins/less");

module.exports = function check(data, validators) {
	var lessChecker,
		validations = [];
	if (~validators.indexOf("less")) {
		lessChecker = less(data);
		if (~validators.indexOf("csslint")) {
			lessChecker = lessChecker.then(function(cssData) {
				return csslint(cssData);
			});
		}
		validations.push(lessChecker);
	}
	return Bluebird.all(validations);
};
