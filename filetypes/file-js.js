"use strict";

var eslint = require("../plugins/eslint");
var jshint = require("../plugins/jshint");
var jscs = require("../plugins/jscs");

module.exports = function check(data) {
	return jshint(data)
		.then(function(modifiedData) {
			return eslint(modifiedData);
		})
		.then(function(modifiedData) {
			return jscs(modifiedData);
		});
};
