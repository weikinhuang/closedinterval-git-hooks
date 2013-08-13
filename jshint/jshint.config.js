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
			"$",
			"jQuery",
			"Classify",
			"Avalon",
			"Page",
			"Highcharts",
			"Recaptcha",
			"alert",
			"confirm",
			"SWFUpload",
			"Handlebars"
		]
	},
	format : "JS Lint {{type}}:   [{{file}}:{{line}}] {{message}}",
	skippedFiles : [
		".build/csslint/csslint-node.js",
		".build/jshint/jshint.js",
		"public/static/javascript/lib/classify.min.js",
		"public/static/javascript/lib/utils.min.js"
	],
	skippedDirectories : [
		".build/uglify",
		"public/static/javascript/vendor",
		"tmp"
	]
};
