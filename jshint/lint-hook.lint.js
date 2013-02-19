//#! /usr/bin/env node

var jshint = require("./jshint.js"), config;
try {
	config = require("./jshint.config.js");
} catch (e) {
	config = {};
}
var fs = require("fs");

var processor = {
	print : function(message) {
		fs.writeSync(1, message + "\n");
	},

	quit : function(code) {
		// Workaround for https://github.com/joyent/node/issues/1669
		if ((!process.stdout.flush || !process.stdout.flush()) && (parseFloat(process.versions.node) < 0.5)) {
			process.once("drain", function() {
				process.exit(code || 0);
			});
		} else {
			process.exit(code || 0);
		}
	},

	isDirectory : function(name) {
		try {
			return fs.statSync(name).isDirectory();
		} catch (ex) {
			return false;
		}
	},

	getFiles : function(dir) {
		var files = [];

		try {
			fs.statSync(dir);
		} catch (ex) {
			return [];
		}

		function traverse(dir, stack) {
			stack.push(dir);
			fs.readdirSync(stack.join("/")).forEach(function(file) {
				var path = stack.concat([ file ]).join("/"), stat = fs.statSync(path);

				if (file[0] == ".") {
					return;
				} else if (stat.isFile() && /\.(js|html)$/.test(file)) {
					files.push(path);
				} else if (stat.isDirectory()) {
					traverse(file, stack);
				}
			});
			stack.pop();
		}

		traverse(dir, []);

		return files;
	},

	isSkippedFile : function(filename) {
		filename = (filename || "-").replace(/\\/g, "/").replace(/^\.\//, "");
		if (config.skippedFiles && config.skippedFiles.indexOf(filename) !== -1) {
			return true;
		}
		if (config.skippedDirectories) {
			var filenameParts = filename.split("/").slice(0, -1);
			if (filenameParts.some(function(v, i) {
				return config.skippedDirectories.indexOf(filenameParts.slice(0, i + 1).join("/")) !== -1;
			})) {
				return true;
			}
		}
		return false;
	},

	formatFile : function(filename, src) {
		var extension = filename.split(".").pop() || "js";
		if (extension === "js") {
			return src;
		}
		var lines = [], isInScript = false;
		src.replace(/\r/g, "").split("\n").forEach(function(l) {
			// we're at the end of the script tag
			if (l.indexOf("</script") > -1) {
				lines[lines.length] = "";
				isInScript = false;
				return;
			}
			if (isInScript) {
				lines[lines.length] = l;
			} else {
				lines[lines.length] = "";
			}
			if (l.indexOf("<script") > -1 && (l.indexOf('text/x-template') === -1 && l.indexOf('text/html') === -1)) {
				isInScript = true;
			}
		});
		return lines.join("\n").replace(/\{\$(\w+\.)*\w+\}/g, "{}");
	},

	readFile : function(filename, src) {
		if(processor.isSkippedFile(filename)) {
			return "";
		}
		return processor.formatFile(filename, arguments.length === 1 ? processor.loadFile(filename) : src);
	},

	loadFile : function(filename) {
		try {
			return fs.readFileSync(filename, "utf-8");
		} catch (ex) {
			return "";
		}
	},

	lint : function(src, filename) {
		if (!src.trim()) {
			return 0;
		}
		filename = (filename || "-").replace(/\\/g, "/").replace(/^\.\//, "");
		var formatString = config.format || "JS Lint {{type}}: {{message}} in {{file}} on line {{line}}";
		formatString = formatString.replace(/\{\{file\}\}/g, filename);
		formatString = formatString.replace(/\{\{type\}\}/g, "error");
		if (!jshint(src, config.options || {})) {
			jshint.errors.forEach(function(e) {
				if (!e || !e.evidence) {
					return;
				}
				var msg = formatString.replace(/\{\{message\}\}/g, e.reason);
				msg = msg.replace(/\{\{line\}\}/g, e.line);
				processor.print(msg);
			});
			return jshint.errors.length;
		}
		return 0;
	}
};

module.exports = processor;
