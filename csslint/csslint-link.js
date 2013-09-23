/**
 * Link to the npm csslint
 */
try {
	module.exports = require("csslint");
} catch(e) {
	module.exports = require("../../node_modules/csslint/release/csslint-node");
}