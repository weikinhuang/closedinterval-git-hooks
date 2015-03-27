"use strict";

var csslint = require("../plugins/csslint");
var less = require("../plugins/less");

module.exports = function check(data) {
	return less(data)
		.then(function(data) {
			return csslint(data);
		});
};
