//#! /usr/bin/env node
"use strict";

var q = require("q");
var base = require("./pre-commit-base");
var jshint = require("./hook-actions/jshint");
var jscs = require("./hook-actions/jscs");
var less = require("./hook-actions/less");
var csslint = require("./hook-actions/csslint");

base.read().then(function(data) {
	var extension = data.filename.split(".").pop();
	switch (extension) {
		case "js":
			return jshint(data).then(function(data) {
				return jscs(data);
			});
		case "css":
			return csslint(data);
		case "html":
			return q.all([
				jshint({
					filename : data.filename,
					src : base.extractScripts(data.src)
				}).then(function(data) {
					return jscs(data);
				}),
				csslint({
					filename : data.filename,
					src : base.extractStyles(data.src)
				})
			]).then(function() {
				return data;
			});
		case "less":
			return less(data).then(function(data) {
				return csslint(data);
			});
	}
	return q.resolve();
}).then(function() {
	base.done();
}, function() {
	base.done(1);
});
