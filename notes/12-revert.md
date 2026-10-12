# Undoing safely with revert

`git revert <sha>` creates a new commit that undoes an earlier one.

Unlike `git reset`, it does not rewrite history, so it is safe on shared branches.
