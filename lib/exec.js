"use strict";

var Bluebird = require("bluebird"),
	childProcess = require("child_process");

/**
 * Promisify child_process.exec
 * @returns {Promise}
 */
module.exports = function() {
	var args = Array.prototype.slice.call(arguments, 0);
	return new Bluebird(function(resolve, reject) {
		args.push(function(err, stdout, stderr) {
			if (err) {
				return reject(err);
			}
			resolve([stdout, stderr]);
		});
		childProcess.exec.apply(childProcess, args);
	});
};
