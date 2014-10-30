//#! /usr/bin/env node
"use strict";

var q = require("q");
var base = require("./pre-commit-base");
var jshint = require("./hook-actions/jshint");
var jscs = require("./hook-actions/jscs");

base.read().then(function(data) {
	var extension = data.filename.split(".").pop();
	switch (extension) {
		case "js":
			return jshint(data).then(function(data) {
				return jscs(data);
			});
		case "css":
			return q.resolve();
		case "html":
			return jshint({
				filename : data.filename,
				src : base.extractScripts(data.src)
			}).then(function(data) {
				return jscs(data);
			});
		case "less":
			return q.resolve();
	}
	return q.resolve();
}).then(function() {
	base.done();
}, function() {
	base.done(1);
});
