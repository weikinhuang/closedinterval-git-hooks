"use strict";

var childProcess = require("child_process"),
	fs = require("fs"),
	os = require("os"),
	path = require("path");

var hooks = [
	"pre-commit",
	"post-checkout",
	"post-merge"
];

// only link if not exists
childProcess.exec(
	"git rev-parse --show-toplevel",
	function(err, stdout) {
		var gitPath = (stdout || "").trim(),
			hookPath;
		if (err || !gitPath) {
			console.error("Not a git repository.");
			process.exit(0);
			return;
		}
		// fix cygwin path
		if (os.platform() === "win32" && (/^\/[c-zC-Z]\//).test(gitPath)) {
			gitPath = gitPath.replace(/^\/([c-zC-Z])\//, function(m, drive) {
				return drive.toUpperCase() + ":/";
			});
		}
		gitPath = path.normalize(gitPath);
		hookPath = path.join(gitPath, ".git/hooks");
		hooks.forEach(function(target) {
			fs.stat(path.join(hookPath, target), function(statErr) {
				// backup the old hook
				if (!statErr) {
					// delete previous backup
					try {
						fs.unlinkSync(path.join(hookPath, target + ".bak"));
					} catch (e) {
						// empty
					}
					try {
						fs.renameSync(
							path.join(hookPath, target),
							path.join(hookPath, target + ".bak")
						);
					} catch (e) {
						// empty
					}
				}
				// copy hook to target
				fs.createReadStream(path.join(__dirname, "git-hooks", "hook-master"))
					.pipe(fs.createWriteStream(path.join(hookPath, target)));
			});
		});
	}
);
