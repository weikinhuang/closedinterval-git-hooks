"use strict";

var Bluebird = require("bluebird");
var fs = require("fs");
var minimatch = require("minimatch");
var ignorePatterns = [];
try {
	ignorePatterns = fs.readFileSync(".precommitignore", {
		encoding : "utf-8"
	}).replace(/\r/g, "").split(/\n/).filter(function(v) {
		return !!v;
	});
} catch (e) {
}

module.exports = {
	write : function(data) {
		return process.stdout.write(data);
	},
	writeLine : function(data) {
		return process.stdout.write(data + "\n");
	},
	writeError : function(type, file, line, message) {
		this.writeLine(type + " error: [" + file + ":" + line + "] " + message);
	},
	getConfig : function(file) {
		var config = {};
		try {
			config = JSON.parse(fs.readFileSync(file, {
				encoding : "utf-8"
			}));
		} catch (e) {
		}
		return config;
	},
	isIgnored : function(file) {
		return ignorePatterns.some(function(pattern) {
			return minimatch(file, pattern, {
				nocase : true,
				matchBase : true
			});
		});
	},
	extractScripts : function(src) {
		var lines = [], isInBlock = false;
		src.replace(/\r/g, "").split("\n").forEach(function(l) {
			// we're at the end of the script tag
			if (l.indexOf("</script") > -1) {
				lines[lines.length] = "";
				isInBlock = false;
				return;
			}
			if (isInBlock) {
				lines[lines.length] = l;
			} else {
				lines[lines.length] = "";
			}
			if (l.indexOf("<script") > -1 && (l.indexOf("text/ng-template") === -1 && l.indexOf("text/html") === -1)) {
				isInBlock = true;
			}
		});
		return lines.join("\n").replace(/\{\$(\w+\.)*\w+\}/g, "{}");
	},
	extractStyles : function(src) {
		var lines = [], isInBlock = false;
		src.replace(/\r/g, "").split("\n").forEach(function(l) {
			// we're at the end of the style tag
			if (l.indexOf("</style") > -1) {
				lines[lines.length] = "";
				isInBlock = false;
				return;
			}
			if (isInBlock) {
				lines[lines.length] = l;
			} else {
				lines[lines.length] = "";
			}
			if (l.indexOf("<style") > -1) {
				isInBlock = true;
			}
		});
		return lines.join("\n").replace(/\{\$(\w+\.)*\w+\}/g, "{}");
	},
	read : function() {
		// filename, src
		return Bluebird.resolve({
			filename : process.argv[2],
			src : fs.readFileSync(process.argv[3], {
				encoding : "utf-8"
			})
		});
	},
	done : function(code) {
		setTimeout(function() {
			process.exit(code || 0);
		}, 4);
	}
};
