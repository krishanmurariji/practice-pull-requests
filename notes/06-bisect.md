# Finding a bug with bisect

`git bisect start`, then mark a bad commit and a good one.
Git checks out the middle commit each time; you answer `good` or `bad`.
A bug in 1,000 commits is found in about 10 steps. Finish with `git bisect reset`.
