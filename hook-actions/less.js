"use strict";

var q = require("q");
var path = require("path");
var base = require(path.join(__dirname, "..", "pre-commit-base"));
var less = require("less");

function attemptRender(filename, src, defer, globals) {
	globals = globals || {};
	less.render(src, {
		// Specify search paths for @import directives
		paths : [
			"public/static/less"
		],
		// Specify a filename, for better error messages
		filename : filename,
		modifyVars : globals,
		compress : false
	}, function(e, css) {
		if (e) {
			if ((/^variable @(.+?) is undefined$/).test(e.message)) {
				// ignore undef variable
				globals[(/^variable @(.+?) is undefined$/).exec(e.message)[1]] = "1";
				attemptRender(filename, src, defer, globals);
				return;
			}
			base.writeError("LESS", filename, e.line, e.message);
			defer.reject();
			return;
		}
		defer.resolve({
			filename : filename,
			src : css
		});
	});
}

module.exports = function(data) {
	var defer = q.defer();
	attemptRender(data.filename, data.src, defer);
	return defer.promise;
};
