"use strict";

var Bluebird = require("bluebird");
var csslint = require("../plugins/csslint");
var less = require("../plugins/less");

module.exports = function check(data, validators) {
	var validations = [],
		lessChecker;
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
