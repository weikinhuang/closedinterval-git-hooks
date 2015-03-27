"use strict";

var csslint = require("../plugins/csslint");

module.exports = function check(data) {
	return csslint(data);
};
