"use strict";

var Bluebird = require("bluebird"),
	chalk = require("chalk"),
	childProcess = require("child_process"),
	exec = require("../exec"),
	fs = require("fs"),
	path = require("path"),
	preCommitBase = require("../pre-commit/pre-commit-base");

var chalkCtx = new chalk.constructor({ enabled : true });

var counter = 0,
	filesLength = 0,
	fullOutput = "",
	hasError = false,
	lineLength = 65,
	lineSpacing = (new Array(lineLength + 1)).join(" ");

/**
 * Write a character to the screen indicating lint status
 * @param {String} indicator
 */
function printCounter(indicator) {
	counter++;
	process.stdout.write(indicator);
	if (counter === filesLength || counter % lineLength === 0) {
		process.stdout.write(lineSpacing.slice(-1 * ((lineLength - counter) % lineLength)) + " ");
		process.stdout.write(String("   " + counter).slice(-3) + " / " + String("   " + filesLength).slice(-3));
		process.stdout.write("\n");
	}
}

/**
 * pre-commit hook for checking for linting errors
 * @returns {Promise}
 */
module.exports = function preCommit(/* argv */) {
	if (!preCommitBase.fileExists(".precommitrc")) {
		return Bluebird.resolve(true);
	}
	return exec("git rev-parse --verify HEAD")
		.then(function() {
			return "HEAD";
		})
		.catch(function() {
			// Initial commit: diff against an empty tree object
			return "4b825dc642cb6eb9a060e54bf8d69288fbee4904";
		})
		.then(function(rev) {
			return exec("git diff-index --cached --full-index " + rev);
		})
		.spread(function(stdout) {
			return stdout.replace(/\r/, "")
				.trim()
				.split(/\n/)
				.map(function(ln) {
					var parts = ln.split(/\t/);
					var gitInfo = parts[0].split(" ");
					return {
						oldMode : gitInfo[0].replace(/^:/, ""),
						newMode : gitInfo[1],
						oldSha : gitInfo[2],
						newSha : gitInfo[3],
						status : gitInfo[4],
						filename : parts[1]
					};
				});
		})
		.then(function(files) {
			filesLength = files.length;
			return files;
		})
		.each(function(file) {
			// do not check deleted files
			if (file.status === "D") {
				printCounter("D");
				return;
			}
			// do not check symlinks
			if (file.newMode === "120000") {
				printCounter("L");
				return;
			}
			// skipped files
			if (preCommitBase.isIgnored(file.filename)) {
				printCounter("S");
				return;
			}
			return exec("git cat-file -p " + file.newSha)
				.spread(function(stdout) {
					return fs.writeFileSync(".git/pre-commit-tmpfile", stdout);
				})
				.then(function() {
					return new Bluebird(function(resolve) {
						var child = childProcess.spawn(
							process.execPath,
							[
								path.join(__dirname, "../pre-commit", "pre-commit-check.js"),
								file.filename,
								".git/pre-commit-tmpfile"
							],
							{
								cwd : process.cwd(),
								env : process.env
							}
						);

						child.stdout.on("data", function(data) {
							fullOutput += data.toString("utf8");
						});

						child.stderr.on("data", function(data) {
							process.stderr.write(data.toString("utf8"));
						});

						child.on("close", function(code) {
							if (code !== 0) {
								hasError = true;
								printCounter(chalkCtx.red.bold("E"));
							} else {
								printCounter(".");
							}
							resolve();
						});
					});
				});
		})
		.then(function() {
			fs.unlinkSync(".git/pre-commit-tmpfile");
			if (fullOutput) {
				console.log(fullOutput);
			}
			if (hasError) {
				throw new Error("pre-commit hook failed.");
			}
		});
};
