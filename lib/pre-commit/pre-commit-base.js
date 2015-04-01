"use strict";

var Bluebird = require("bluebird"),
	fs = require("fs"),
	minimatch = require("minimatch"),
	path = require("path"),
	util = require("util");

var ignorePatterns = [],
	messages = {};

try {
	ignorePatterns = fs.readFileSync(".precommitignore", "utf8")
		.replace(/\r/g, "")
		.split(/\n/)
		.filter(function(v) {
			return !!v;
		});
} catch (e) {
	// empty
}

/**
 * Check if a file exists
 * @param {String} file
 * @returns {Boolean}
 */
function fileExists(file) {
	try {
		fs.statSync(file);
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * Write output to the console
 * @param {String} data
 * @returns {*|Number}
 */
function write(data) {
	return process.stdout.write(data);
}

/**
 * Write output line to the console
 * @param {String} data
 * @returns {*|Number}
 */
function writeLine(data) {
	return process.stdout.write(data + "\n");
}

/**
 * Write an error to the errors buffer
 * @param {String} type
 * @param {String} file
 * @param {String} line
 * @param {String} message
 */
function writeError(type, file, line, message) {
	if (!messages[type]) {
		messages[type] = [];
	}
	messages[type].push({
		type : type,
		file : file,
		line : line,
		message : message
	});
}

/**
 * Flush the errors buffer
 */
function flushMessages() {
	Object.keys(messages)
		.forEach(function(type) {
			messages[type].forEach(function(msg) {
				writeLine(msg.type + " error: [" + msg.file + ":" + msg.line + "] " + msg.message);
			});
		});
}

/**
 * Get a JSON based config file
 * @param {String} file
 * @returns {Object}
 */
function getConfig(file) {
	var config = {},
		subConfig;
	try {
		config = JSON.parse(fs.readFileSync(file, "utf8"));
		if (config.extends) {
			subConfig = JSON.parse(fs.readFileSync(config.extends, "utf8"));
			util._extend(subConfig, config);
			delete subConfig.extends;
			config = subConfig;
		}
	} catch (e) {
		// empty
	}
	return config;
}

/**
 * Check if a filename matches an ignore pattern
 * @param {String} file
 * @returns {Boolean}
 */
function isIgnored(file) {
	return ignorePatterns.some(function(pattern) {
		return minimatch(file, pattern, {
			nocase : true,
			matchBase : true
		});
	});
}

/**
 * Replace non script content in a html file with empty lines
 * @param {String} src
 * @returns {String}
 */
function extractScripts(src) {
	var isInBlock = false,
		lines = [];

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
}

/**
 * Replace non css content in a html file with empty lines
 * @param {String} src
 * @returns {String}
 */
function extractStyles(src) {
	var isInBlock = false,
		lines = [];

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
}

/**
 * Get file contents and file name from process.argv
 * @returns {Promise.<{filename: *, src}>|String|*}
 */
function read() {
	// filename, src
	return Bluebird.resolve({
		filename : process.argv[2],
		src : fs.readFileSync(process.argv[3], "utf8")
	});
}

/**
 * Finish script
 * @param {Number} code
 */
function done(code) {
	setTimeout(function() {
		process.exit(code || 0);
	}, 4);
}

/**
 * Load all file type checker plugins
 * @param {String} extension
 * @throws {Error}
 * @returns {Function}
 */
function loadFileTypePlugin(extension) {
	return require(
		path.join(
			process.cwd(),
			".git-hooks/pre-commit-plugins/filetypes/file-" + extension
		)
	);
}

/**
 * Load all file checking plugins
 * @returns {Object}
 */
function loadFileCheckerPlugins() {
	var checkers = {};
	try {
		fs.readdirSync(path.join(process.cwd(), ".git-hooks/pre-commit-plugins/plugins"))
			.forEach(function(file) {
				var check = file.replace(/\.js$/, "");
				if (!(/\.js$/).test(file)) {
					return;
				}
				checkers[check] = require(path.join(process.cwd(), ".git-hooks/pre-commit-plugins/plugins", file));
			});
	} catch (e) {
		// empty
	}
	return checkers;
}

/**
 * Exports
 */
module.exports = {
	fileExists : fileExists,
	write : write,
	writeLine : writeLine,
	writeError : writeError,
	flushMessages : flushMessages,
	getConfig : getConfig,
	isIgnored : isIgnored,
	extractScripts : extractScripts,
	extractStyles : extractStyles,
	read : read,
	done : done,
	loadFileTypePlugin : loadFileTypePlugin,
	loadFileCheckerPlugins : loadFileCheckerPlugins
};
