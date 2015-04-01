"use strict";

const Bluebird = require("bluebird"),
	childProcess = require("child_process");

module.exports = Bluebird.promisify(childProcess.exec);
