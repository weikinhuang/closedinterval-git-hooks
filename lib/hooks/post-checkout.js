"use strict";

var Bluebird = require("bluebird"),
	exec = require("../exec"),
	postCheckoutMerge = require("../post-checkout-merge");

/**
 * post-checkout hook
 * @param {Array} argv
 * @returns {Promise}
 */
module.exports = function postCheckout(argv) {
	// argv[2] 1 = branch, 2 = file
	if (argv[2] !== "1") {
		return Bluebird.resolve(true);
	}
	return exec("git diff --name-only " + argv[0] + " " + argv[1])
		.then(function(res) {
			return res[0].replace(/\r/, "")
				.trim()
				.split(/\n/);
		})
		.each(function(file) {
			return postCheckoutMerge(file);
		});
};
