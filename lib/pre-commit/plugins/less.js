"use strict";

const Bluebird = require("bluebird"),
	less = require("less");

function attemptRender(reporter, filename, src, resolve, reject, globals) {
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
				attemptRender(reporter, filename, src, resolve, reject, globals);
				return;
			}
			reporter("LESS", filename, e.line, e.message);
			reject();
			return;
		}
		resolve({
			filename : filename,
			src : css.css || css
		});
	});
}

module.exports = function(data, reporter) {
	return new Bluebird(function(resolve, reject) {
		attemptRender(reporter, data.filename, data.src, resolve, reject);
	});
};
