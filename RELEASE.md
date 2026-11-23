Summit Siege — Release Management Guide

Project: Summit Siege
Versioning: Semantic Versioning ("MAJOR.MINOR.PATCH")
Example release: "v0.1.0"
Release branch: "release/v0.1"

1. Development on Main

The "main" branch is used for continuous development.

Workflow

1. Create feature or fix branches from "main".
2. Implement changes.
3. Open pull requests targeting "main".
4. Run automated tests and review changes.
5. Merge approved PRs.

Important: Keep "main" in a buildable state.

Do not create a release branch until the planned features for that release are substantially complete.

---

2. Create the Release Branch

Purpose: Separate release stabilization from ongoing development.

2.1 Prepare Main

Ensure the changes planned for the release are merged.

git switch main
git pull --ff-only origin main

2.2 Create the Branch

git switch -c release/v0.1
git push -u origin release/v0.1

2.3 Rules

- One release branch per minor version.
- New feature development continues on "main".
- The release branch is used for stabilization and bug fixes.
- Changes to the release branch should go through PRs.
- Do not routinely merge "main" into the release branch after branching.

---

3. Beta Releases

Example: "v0.1.0-beta.1"

Purpose: Test gameplay, discover bugs, and gather feedback.

3.1 Prepare the Beta

1. Create a working branch from "release/v0.1".
2. Update the project version to "0.1.0-beta.1".
3. Update release notes.
4. Open a PR targeting "release/v0.1".
5. Run automated tests.
6. Review and merge the PR.

3.2 Validate the Build

Before publishing, verify:

- [ ] Game builds successfully.
- [ ] Game starts and exits correctly.
- [ ] Core gameplay works.
- [ ] Assets and levels load correctly.
- [ ] No known blocking crashes.
- [ ] Basic performance checks pass.

3.3 Publish the Beta

Update the local release branch:

git switch release/v0.1
git pull --ff-only origin release/v0.1

Create and push the tag:

git tag -a v0.1.0-beta.1 -m "Beta 1"
git push origin v0.1.0-beta.1

Publishing strategy:

Configure CI/CD to trigger from version tags and:

1. Check out the tagged commit.
2. Build the game.
3. Run automated checks.
4. Package the game.
5. Upload artifacts to the configured distribution platform or private testing channel.
6. Create a pre-release with release notes.

Verify that the published build matches the tagged commit.

3.4 Repeat Betas

When issues are discovered:

1. Create a fix branch from "release/v0.1".
2. Implement and test the fix.
3. Open a PR targeting the release branch.
4. Merge the fix.
5. Synchronize the fix with "main" (Section 6).
6. Publish "v0.1.0-beta.2" if another beta is needed.

---

4. Release Candidate (RC)

Example: "v0.1.0-rc.1"

Purpose: Validate a release that is intended to become the stable version.

4.1 Feature Freeze

Once beta testing is satisfactory:

- Stop accepting new features.
- Accept only important bug fixes.
- Avoid unnecessary refactoring.
- Do not merge "main" into the release branch.

4.2 Prepare the RC

1. Create a working branch from "release/v0.1".
2. Update the version to "0.1.0-rc.1".
3. Update release notes.
4. Open a PR targeting the release branch.
5. Merge after tests and review.

4.3 Validate the RC

Run the complete release test checklist:

- [ ] All critical and high-priority bugs are resolved or explicitly accepted.
- [ ] Core gameplay is tested.
- [ ] Performance meets agreed targets.
- [ ] Release packaging works.
- [ ] Installation and launch are verified on supported platforms.
- [ ] Save compatibility is verified, if applicable.
- [ ] No known release-blocking issues remain.

4.4 Publish the RC

git switch release/v0.1
git pull --ff-only origin release/v0.1

git tag -a v0.1.0-rc.1 -m "Release Candidate 1"
git push origin v0.1.0-rc.1

The CI/CD pipeline builds and publishes the RC to the designated testing channel.

4.5 Handle RC Bugs

If a release-blocking bug is discovered:

1. Create a fix branch from "release/v0.1".
2. Implement and test the fix.
3. Open a PR targeting "release/v0.1".
4. Merge the PR.
5. Synchronize the fix with "main".
6. Publish another RC ("rc.2", "rc.3", etc.).

Proceed to GA only after the release candidate meets the agreed criteria.

---

5. General Availability (GA)

Example: "v0.1.0"

Purpose: Publish the stable release.

5.1 Prepare the Final Version

Once the RC is approved:

1. Create a working branch from "release/v0.1".
2. Update the version to "0.1.0".
3. Finalize release notes.
4. Open a PR targeting "release/v0.1".
5. Review and merge.

5.2 Publish the Release

git switch release/v0.1
git pull --ff-only origin release/v0.1

git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0

CI/CD should:

1. Build from the tagged commit.
2. Run release verification.
3. Package the production artifacts.
4. Publish them to the production distribution channel after approval.
5. Create the stable GitHub release.

5.3 Verify Publication

- [ ] Git tag exists.
- [ ] Production build succeeded.
- [ ] Game package is available.
- [ ] Installation and launch work.
- [ ] Release notes are correct.
- [ ] Published version matches the intended commit.

5.4 Preserve the Release Branch

Keep "release/v0.1" for future patch releases.

Synchronize any outstanding bug fixes with "main" using Section 6.

---

6. Synchronize Fixes with Main

Purpose: Ensure bug fixes introduced during Beta, RC, GA, or Patch are also available in future releases.

6.1 Identify Fix Commits

Identify bug-fix commits in "release/v0.1" that do not exist in "main".

Avoid bringing release-only version metadata or unrelated changes into "main".

6.2 Apply Fixes to Main

Create a synchronization branch from "main":

git switch main
git pull --ff-only origin main
git switch -c sync/v0.1-fixes

Cherry-pick the required fix commits:

git cherry-pick <fix-commit-sha>

Then push the branch:

git push -u origin sync/v0.1-fixes

Open a PR targeting "main".

Review and merge after CI passes.

Important: Cherry-pick only the required fixes. This avoids accidentally introducing outdated release-specific configuration or version changes into "main".

6.3 Synchronization Rules

- Synchronize fixes as soon as practical.
- Do not merge all of "main" into a frozen release branch.
- Keep both branches consistent regarding bug fixes.
- Use PRs to maintain review and CI coverage.

---

7. Patch and Hotfix Releases

Example: "v0.1.1"

Purpose: Correct problems in an already published stable version.

7.1 Create the Fix

Branch from the existing release branch:

git switch release/v0.1
git pull --ff-only origin release/v0.1
git switch -c fix/v0.1.1-critical-bug

Implement and test the fix.

Open a PR targeting "release/v0.1" and merge it.

7.2 Prepare the Patch

1. Create a preparation branch from "release/v0.1".
2. Bump the version to "0.1.1".
3. Update release notes.
4. Open and merge the preparation PR.

7.3 Publish the Patch

git switch release/v0.1
git pull --ff-only origin release/v0.1

git tag -a v0.1.1 -m "Patch Release v0.1.1"
git push origin v0.1.1

The CI/CD pipeline builds, tests, and publishes the patch through the production release process.

7.4 Synchronize with Main

Use Section 6 to bring the bug fix into "main".

Important: A patch release must not unintentionally replace a newer stable release in the distribution channel. Use explicit release channels or platform-specific version controls when maintaining older versions.

---

8. Rollback Procedure

Purpose: Restore a working version if a production release causes serious problems.

8.1 Identify the Previous Stable Release

Example:

- Current release: "v0.1.1"
- Previous stable release: "v0.1.0"

8.2 Restore the Previous Build

1. Stop or pause the affected rollout if supported.
2. Identify the previously verified build artifact.
3. Restore or republish that artifact using the distribution platform's rollback mechanism.
4. Verify that the restored version works.
5. Investigate the failed release.
6. Prepare a new patch release if required.

Important:

- Never delete or overwrite published Git tags.
- Preserve release artifacts for rollback.
- Avoid rebuilding an old version when its verified artifact is available.
- Consider save-game compatibility before rolling back.

---

9. Release Lifecycle Summary

Phase| Example| Main purpose
Development| "main"| Features and fixes
Release branch| "release/v0.1"| Stabilization
Beta| "v0.1.0-beta.1"| Gameplay testing
RC| "v0.1.0-rc.1"| Final verification
GA| "v0.1.0"| Public release
Patch| "v0.1.1"| Production fixes

Overall lifecycle:

"Development → Release Branch → Beta → RC → GA → Patch (if needed)"

At each publishing stage:

"Prepare Version → PR → Test → Merge → Tag → CI/CD → Verify"

For release-specific bug fixes:

"Fix on Release Branch → PR → Merge → Cherry-pick into Main"

10. Project-Specific Release Rules

For Summit Siege:

1. Create the release branch only when the planned feature set is substantially complete.
2. Use PRs and automated validation for changes entering the release branch.
3. Beta releases are used to gather gameplay feedback and discover defects.
4. RC releases focus on stabilization, not new features.
5. Beta and RC iterations are optional; do not create additional releases without a testing need.
6. Keep build artifacts and release notes for every published version.
7. Automate builds, packaging, and publishing wherever practical.
8. Retain release branches for supported patch versions.
9. Keep "main" updated with fixes made during stabilization.
10. Every production release must have a tested recovery or rollback approach.

Note: This runbook assumes Git tags trigger the release pipeline. The engine-specific build commands, distribution platform, and CI/CD workflow must be configured separately. Do not create the same release tag both manually and in automation.
