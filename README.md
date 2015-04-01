# closedinterval-git-hooks
Git hooks manager and **pre-commit** linter for projects

## Installation

It's advised to install the **closedinterval-git-hooks** module as a `devDependencies`
in your `package.json` as you only need this for development purposes. To install the
module simply run:

```bash
npm install --save-dev closedinterval-git-hooks
```

To install it as `devDependency`. When this module is installed it will override
the existing `pre-commit`, `post-checkout`, and `post-merge` file in your `.git/hooks`
folder. Existing hooks will be backed up as `*.bak` file in the same folder.

## Configuration

These set of hooks will run common actions in the steps for `pre-commit`, `post-checkout`,
and `post-merge`. Additional actions can be defined when these internal hooks run inside
`closedinterval-git-hooks`.

Additional actions can be set up if a `.git-hooks` folder exists in the repository root.
The `.git-hooks` folder is set up in the following format:

```
--- REPO ROOT
    --- .git/
    --- .git-hooks/
        --- pre-commit/
        --- post-checkout/
        --- post-merge/
        --- pre-commit-plugins/
            --- filetypes/
                --- file-php.js
                --- file-java.js
                --- etc.
            --- plugins/
                --- php-lint.js
                --- phpcs.js
                --- etc.
            --- pre-commit-modifier.js
```

### Configuring `pre-commit`

All files within the `.git-hooks/pre-commit/` directory will be run automatically. If any
script fails, the following scripts will not be run and the commit will not be successful.

#### Setting linting rules

A `.precommitrc` is required for the `pre-commit` linter to run. It is a json formatted file
in the following format. The following are the available rules built into this package.

```json
{
  "rules": {
    "css": ["less", "csslint"],
    "less": ["less", "csslint"],
    "html": ["eslint", "jscs", "jshint"],
    "js": ["eslint", "jscs", "jshint"]
  }
}

```

Files can be skipped from being checked with a `.precommitignore` file. This file follows the
same pattern as a `.gitignore` file, but without the starting slash `/`, and follows the
`minimatch` pattern matcher. Example to ignore the `node_modules` directory.

```
bower_components/**
node_modules/**
```

Additional file type checks can be setup by putting a js file in
`.git-hooks/pre-commit-plugins/filetypes/file-EXTENSION.js` that exports a function that returns
a `Promise` and takes the parameters `function (data, validators, reporter)`.

```javascript
// Example
module.exports = function check(data, validators, reporter) {
    // data => { filename, src } // src and file to validate
    // validators => .precommitrc => rules.EXT = [] // rules found in .precommitrc
    // reporter => function(checktype, filename, line, message) // to write grouped error messages

    var filename = data.filename,
        src = data.src;

    return new Promise(function(resolve, reject) {
        if(lint(src)) {
           resolve();
        } else {
           reject();
        }
    });
};
```

Additional hooks can be attached to existing checked file types (`css`, `html`, `js`, and `less`)
by putting files inside `.git-hooks/pre-commit-plugins/plugins/CHECK.js`. Each check is then loaded
by including the validator in `.precommitrc`. The check files follows the following format which
takes in `function(data, reporter)` and returns a `Promise`:


```javascript
// Example
module.exports = function validator(data, reporter) {
    // data => { filename, src } // src and file to validate
    // reporter => function(checktype, filename, line, message) // to write grouped error messages

    var filename = data.filename,
        src = data.src;

    return new Promise(function(resolve, reject) {
        if(jscsOrSomething(src)) {
           resolve();
        } else {
           reject();
        }
    });
};
```

### Configuring `post-checkout`

All files within the `.git-hooks/post-checkout/` directory will be run automatically. If any
script fails, the following scripts will not be run.

The default behavior:
 - Run `npm install` when the `package.json` file has changed.
 - Run `bower install` when the `bower.json` file has changed.

### Configuring `post-merge`

All files within the `.git-hooks/post-merge/` directory will be run automatically. If any
script fails, the following scripts will not be run.

The default behavior:
 - Run `npm install` when the `package.json` file has changed.
 - Run `bower install` when the `bower.json` file has changed.

## License

MIT
