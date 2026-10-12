# The reflog is a safety net

`git reflog` lists where HEAD has been, even for commits no branch points to.

Lost a commit after a bad reset? Find its sha in the reflog and run `git branch rescue <sha>`.
