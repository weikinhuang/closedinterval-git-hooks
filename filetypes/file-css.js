"use strict";

var Bluebird = require("bluebird");
var csslint = require("../plugins/csslint");

module.exports = function check(data, validators) {
	var validations = [];
	if (~validators.indexOf("csslint")) {
		validations.push(csslint(data));
	}
	return Bluebird.all(validations);
};
