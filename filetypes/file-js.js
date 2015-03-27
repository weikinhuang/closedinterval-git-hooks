"use strict";

var Bluebird = require("bluebird");
var eslint = require("../plugins/eslint");
var jshint = require("../plugins/jshint");
var jscs = require("../plugins/jscs");

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
