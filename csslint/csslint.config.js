module.exports = {
	options : {
		format : "cli-oneline",
		ignore : "floats,ids,adjoining-classes,regex-selectors",
		quiet : true
	},
	format : "CSS Lint {{type}}:  [{{file}}:{{line}}] {{message}}",
	skippedFiles : [
	],
	skippedDirectories : [
		"static/css/vendor",
		"tmp"
	]
};
