// cli formatter for git hook
var CSSLint = require("./csslint-node").CSSLint;
CSSLint.addFormatter({
	// format information
	id : "cli-oneline",
	name : "CLI Output",

	/**
	 * Return content to be printed before all file results.
	 *
	 * @return {String} to prepend before all results
	 */
	startFormat : function() {
		return "";
	},

	/**
	 * Return content to be printed after all file results.
	 *
	 * @return {String} to append after all results
	 */
	endFormat : function() {
		return "";
	},

	/**
	 * Given CSS Lint results for a file, return output for this format.
	 *
	 * @param results {Object} with error and warning messages
	 * @param filename {String} relative file path
	 * @param options {Object} (Optional) specifies special handling of output
	 * @return {String} output for results
	 */
	formatResults : function(results, filename, options) {
		var messages = results.messages, output = "";
		options = options || {};
		filename = (filename || "-").replace(/\\/g, "/").replace(/^\.\//, "");

		if (messages.length === 0) {
			return options.quiet ? "" : "\n\ncsslint: No errors in " + filename + ".";
		}

		CSSLint.Util.forEach(messages, function(message, i) {
			if (!message.rollup && message.evidence) {
				output += "CSS Lint " + message.type + ": " + message.message + " in " + filename.replace(/\\/g, "/") + " on line " + message.line + "\n";
			}
		});

		return output;
	}
});
