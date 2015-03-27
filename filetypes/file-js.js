"use strict";

var jshint = require("../plugins/jshint");
var jscs = require("../plugins/jscs");

module.exports = function check(data) {
	return jshint(data)
		.then(function(data) {
			return jscs(data);
		});
};
