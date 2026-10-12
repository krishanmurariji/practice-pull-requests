# Cherry-picking a commit

`git cherry-pick <sha>` copies one commit onto the current branch.

Good for taking a bug fix to a release branch without merging everything else.
If it conflicts, fix the files, `git add` them and run `git cherry-pick --continue`.
