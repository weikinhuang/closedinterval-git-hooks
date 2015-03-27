"use strict";

var Bluebird = require("bluebird");
var base = require("../pre-commit-base");
var less = require("less");

function attemptRender(filename, src, resolve, reject, globals) {
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
				attemptRender(filename, src, resolve, reject, globals);
				return;
			}
			base.writeError("LESS", filename, e.line, e.message);
			reject();
			return;
		}
		resolve({
			filename : filename,
			src : css.css || css
		});
	});
}

module.exports = function(data) {
	return new Bluebird(function(resolve, reject) {
		attemptRender(data.filename, data.src, resolve, reject);
	});
};
