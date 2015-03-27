"use strict";

var Bluebird = require("bluebird");
var base = require("../pre-commit-base");
var csslint = require("../plugins/csslint");
var jshint = require("../plugins/jshint");
var jscs = require("../plugins/jscs");

module.exports = function check(data) {
	return Bluebird.all([
		jshint({
			filename : data.filename,
			src : base.extractScripts(data.src)
		})
			.then(function(data) {
				return jscs(data);
			}),
		csslint({
			filename : data.filename,
			src : base.extractStyles(data.src)
		})
	])
		.then(function() {
			return data;
		});
};
