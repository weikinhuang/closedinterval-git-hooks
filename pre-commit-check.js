//#! /usr/bin/env node
"use strict";

var Bluebird = require("bluebird");
var base = require("./pre-commit-base");
var jshint = require("./hook-actions/jshint");
var jscs = require("./hook-actions/jscs");
var less = require("./hook-actions/less");
var csslint = require("./hook-actions/csslint");

base.read()
	.then(function(data) {
		if (base.isIgnored(data.filename)) {
			return Bluebird.resolve(true);
		}
		var extension = data.filename.split(".").pop();
		switch (extension) {
			case "js":
				return jshint(data)
					.then(function(data) {
						return jscs(data);
					});
			case "css":
				return csslint(data);
			case "html":
				return Bluebird.all([
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
		return Bluebird.resolve(true);
	})
	.then(function() {
		base.done();
	})
	.catch(function() {
		base.done(1);
	});
