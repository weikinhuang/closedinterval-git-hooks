"use strict";

const Bluebird = require("bluebird"),
	childProcess = require("child_process");

/**
 * Run a file based hook script through bash
 * @param {String} file
 * @returns {Function}
 */
module.exports = function fileHookRunner(file) {
	/**
	 * Run file hook
	 * @param {Array} cliArgs
	 * @returns {Promise}
	 */
	return function fileHookRunnerAction(cliArgs) {
		return new Bluebird(function(resolve, reject) {
			var child = childProcess.spawn(
				"sh",
				[
					file
				].concat(cliArgs),
				{
					cwd : process.cwd(),
					env : process.env,
					stdio : "inherit"
				}
			);
			child.on("close", function(code) {
				if (code === 0) {
					resolve(code);
					return;
				}
				reject(new Error("hook: '" + file + "' failed with code '" + code + "'."));
			});
		});
	};
};
