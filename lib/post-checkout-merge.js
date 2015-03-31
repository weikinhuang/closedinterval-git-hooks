"use strict";

//const Bluebird = require("bluebird"),
//	chalk = require("chalk"),
//	childProcess = require("child_process");

//const chalkCtx = new chalk.constructor({ enabled : true });

module.exports = function postCheckoutMerge(file) {
	switch (file) {
		case "package.json":
			break;
		case "bower.json":
			break;
		default:
			return;
	}
};
