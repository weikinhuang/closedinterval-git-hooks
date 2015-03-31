"use strict";

const Bluebird = require("bluebird"),
	chalk = require("chalk"),
	childProcess = require("child_process"),
	fs = require("fs"),
	path = require("path");

const chalkCtx = new chalk.constructor({ enabled : true });
const exec = Bluebird.promisify(childProcess.exec);

var counter = 0,
	filesLength = 0,
	fullOutput = "",
	hasError = false,
	lineLength = 65,
	lineSpacing = (new Array(lineLength + 1)).join(" ");

function printCounter(indicator) {
	counter++;
	process.stdout.write(indicator);
	if (counter === filesLength || counter % lineLength === 0) {
		process.stdout.write(lineSpacing.slice(-1 * ((lineLength - counter) % lineLength)) + " ");
		process.stdout.write(String("   " + counter).slice(-3) + " / " + String("   " + filesLength).slice(-3));
		process.stdout.write("\n");
	}
}

exec("git rev-parse --verify HEAD")
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
		return exec("git cat-file -p " + file.newSha + " > .git/pre-commit-tmpfile")
			.then(function() {
				return new Bluebird(function(resolve) {
					var child = childProcess.spawn(
							process.execPath,
							[
								path.join(__dirname, "..", "pre-commit-check.js"),
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

					child.stderr.on("data", console.error.bind(console));

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
		setTimeout(function() {
			process.exit(hasError ? 1 : 0);
		}, 15);
	});
