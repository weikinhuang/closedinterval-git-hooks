/**
 * Encapsulates all of the CLI functionality. The api argument simply
 * provides environment-specific functionality.
 */
var CSSLint = require("./csslint-link").CSSLint;
require("./lint.cli-formatter.js");
var cli = require("./lint-hook.cli.js");
var cliInterface = require("./lint-hook.node-opts.js");

cli(cliInterface);
