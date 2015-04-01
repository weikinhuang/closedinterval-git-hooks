"use strict";

const Bluebird = require("bluebird"),
	chalk = require("chalk"),
	childProcess = require("child_process");

const chalkCtx = new chalk.constructor({ enabled : true });

/**
 * post-checkout and post-merge common actions
 * @param {String} file changed file
 * @returns {Promise|*}
 */
module.exports = function postCheckoutMerge(file) {
	switch (file) {
		case "package.json":
			// update npm
			console.log(chalkCtx.cyan("----- package.json changed updating npm -----"));
			return new Bluebird(function(resolve) {
				var child = childProcess.spawn(
					"sh",
					[
						"-c",
						"npm install --loglevel=error && npm prune"
					],
					{
						cwd : process.cwd(),
						env : process.env,
						stdio : "inherit"
					}
				);
				child.on("close", resolve);
			});
		case "bower.json":
			// update bower
			console.log(chalkCtx.cyan("----- bower.json changed updating bower -----"));
			return new Bluebird(function(resolve) {
				var child = childProcess.spawn(
					"sh",
					[
						"-c",
						"bower install --loglevel=error && bower prune"
					],
					{
						cwd : process.cwd(),
						env : process.env,
						stdio : "inherit"
					}
				);
				child.on("close", resolve);
			});
		default:
			return null;
	}
};
