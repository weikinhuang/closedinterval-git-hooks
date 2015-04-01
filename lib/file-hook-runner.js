"use strict";

const Bluebird = require("bluebird"),
	childProcess = require("child_process");

module.exports = function fileHookRunner(file) {
	return function(cliArgs) {
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
