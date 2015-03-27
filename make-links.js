"use strict";

const child_process = require("child_process"),
	fs = require("fs"),
	os = require("os"),
	path = require("path"),
	pkg = require("./package.json");

var hookMap = {
	"pre-commit" : "pre-commit",
	"post-checkout" : "post-checkout-merge",
	"post-merge" : "post-checkout-merge"
};

// only link if not exists
child_process.exec(
	"git rev-parse --show-toplevel",
	function(err, stdout) {
		if (err || !stdout.trim()) {
			console.error("Not a git repository.");
			process.exit(1);
			return;
		}
		var gitPath = stdout.trim(),
			hookPath;
		// fix cygwin path
		if (os.platform() === "win32" && (/^\/[c-zC-Z]\//).test(gitPath)) {
			gitPath = gitPath.replace(/^\/([c-zC-Z])\//, function(m, drive) {
				return drive.toUpperCase() + ":/";
			});
		}
		gitPath = path.normalize(gitPath);
		var srcRoot = gitPath === process.cwd()
			? ""
			: path.join("node_modules", pkg.name);
		hookPath = path.join(gitPath, ".git/hooks");
		Object.keys(hookMap).forEach(function(target) {
			var source = hookMap[target];
			fs.stat(path.join(hookPath, target), function(err) {
				// we only care if file doesn't exist
				if (!err) {
					return;
				}
				// make symlink to git hooks
				fs.symlink(
					path.join("../../", srcRoot, "git-hooks", source),
					path.join(hookPath, target),
					function() {
					}
				);
			});
		});
	}
);
