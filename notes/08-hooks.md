# Git hooks

Hooks are scripts in `.git/hooks` that run at certain moments.

`pre-commit` can run a formatter or linter before every commit.
Hooks are not copied by `git clone`, so share them with a tool or a setup script.
