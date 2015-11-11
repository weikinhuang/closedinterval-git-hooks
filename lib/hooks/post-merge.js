"use strict";

var exec = require("../exec"),
	postCheckoutMerge = require("../post-checkout-merge");

/**
 * post-merge hook
 * @returns {Promise}
 */
module.exports = function postMerge(/* argv */) {
	return exec("git diff --name-only 'HEAD@{1}' HEAD")
		.then(function(res) {
			return res[0].replace(/\r/, "")
				.trim()
				.split(/\n/);
		})
		.each(function(file) {
			return postCheckoutMerge(file);
		});
};
