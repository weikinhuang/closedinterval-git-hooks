"use strict";

const Bluebird = require("bluebird"),
	childProcess = require("child_process");

/**
 * Promisify child_process.exec
 */
module.exports = Bluebird.promisify(childProcess.exec);
