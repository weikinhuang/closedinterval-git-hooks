"use strict";

var Bluebird = require("bluebird");
var base = require("../pre-commit-base");
var csslint = require("../plugins/csslint");
var eslint = require("../plugins/eslint");
var jshint = require("../plugins/jshint");
var jscs = require("../plugins/jscs");

module.exports = function check(data, validators) {
	var validations = [],
		jsData = {
			filename : data.filename,
			src : base.extractScripts(data.src)
		};

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
