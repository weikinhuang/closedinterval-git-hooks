var fs = require("fs"), path = require("path"), csslintConfig = require("./csslint.config.js");
// specific options for node cli interface
module.exports = {
	args : process.argv.slice(2),

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
				} else if (stat.isFile() && /\.(css|html)$/.test(file)) {
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

	getWorkingDirectory : function() {
		return process.cwd();
	},

	getFullPath : function(filename) {
		return path.resolve(process.cwd(), filename);
	},

	readFile : function(filename) {
		var cleanedFilename = (filename || "-").replace(/\\/g, "/").replace(/^\.\//, "");
		if (csslintConfig.skippedFiles && csslintConfig.skippedFiles.indexOf(cleanedFilename) !== -1) {
			return "";
		}
		if (csslintConfig.skippedDirectories) {
			var filenameParts = cleanedFilename.split("/").slice(0, -1);
			if (filenameParts.some(function(v, i) {
				return csslintConfig.skippedDirectories.indexOf(filenameParts.slice(0, i + 1).join("/")) !== -1;
			})) {
				return "";
			}
		}
		return this.formatFile(filename, this.loadFile(filename));
	},

	formatFile : function(filename, src) {
		var extension = filename.split(".").pop() || "css";
		if(extension === "css") {
			return src;
		}
		var lines = [], isInScript = false;
		src.replace(/\r/g, "").split("\n").forEach(function(l) {
			// we're at the end of the style tag
			if (l.indexOf("</style") > -1) {
				lines[lines.length] = "";
				isInScript = false;
				return;
			}
			if (isInScript) {
				lines[lines.length] = l;
			} else {
				lines[lines.length] = "";
			}
			if (l.indexOf("<style") > -1) {
				isInScript = true;
			}
		});
		return lines.join("\n");
	},

	loadFile : function(filename) {
		try {
			return fs.readFileSync(filename, "utf-8");
		} catch (ex) {
			return "";
		}
	}
};
