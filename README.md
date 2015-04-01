# closedinterval-git-hooks
Git hooks manager and **pre-commit** linter for projects

### Installation

It's advised to install the **closedinterval-git-hooks** module as a `devDependencies`
in your `package.json` as you only need this for development purposes. To install the
module simply run:

```bash
npm install --save-dev closedinterval-git-hooks
```

To install it as `devDependency`. When this module is installed it will override
the existing `pre-commit`, `post-checkout`, and `post-merge` file in your `.git/hooks`
folder. Existing hooks will be backed up as `*.bak` file in the same folder.

### Configuration

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

#### Configuring `pre-commit`

All files within the `.git-hooks/pre-commit/` directory will be run automatically. If any
script fails, the following scripts will not be run and the commit will not be successful.

#### Configuring `post-checkout`

All files within the `.git-hooks/post-checkout/` directory will be run automatically. If any
script fails, the following scripts will not be run.

The default behavior:
 - Run `npm install` when the `package.json` file has changed.
 - Run `bower install` when the `bower.json` file has changed.

#### Configuring `post-merge`

All files within the `.git-hooks/post-merge/` directory will be run automatically. If any
script fails, the following scripts will not be run.

The default behavior:
 - Run `npm install` when the `package.json` file has changed.
 - Run `bower install` when the `bower.json` file has changed.
