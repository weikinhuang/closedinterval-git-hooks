module.exports = {
	options : {
		latedef : true,
		noempty : true,
		undef : true,
		strict : false,
		node : true,
		browser : true,
		eqnull : true,
		scripturl : true,
		predef : [
			"$", "jQuery", "Classify", "Avalon", "Page", "Highcharts", "Recaptcha", "alert", "SWFUpload"
		]
	},
	skippedFiles : [
		".build/csslint/csslint-node.js",
		".build/jshint/jshint.js",
		"static/javascript/lib/classify.min.js",
		"static/javascript/lib/utils.min.js"
	],
	skippedDirectories : [
		".build/uglify",
		"static/javascript/vendor",
		"tmp"
	]
};
