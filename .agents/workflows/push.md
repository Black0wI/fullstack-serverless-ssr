---
description: Push changes to the remote repository with changelog and versioning
---

# Push

Push changes to the remote repository after quality checks and changelog update.

## Prerequisites

- Changes committed or staged
- On the working branch

## Steps

1. **Update CHANGELOG.md** — Before committing, ensure `CHANGELOG.md` has entries for the current changes under `## [Unreleased]`, grouped by `### Added`, `### Changed`, `### Fixed`, `### Removed` as applicable.

2. **Determine version bump** — If changes warrant a version bump:
   - **PATCH** (bug fixes, docs, refactors) → `0.0.x`
   - **MINOR** (new features, pages, deps) → `0.x.0`
   - **MAJOR** (breaking changes) → `x.0.0`
   - If bumping, update `version` in `package.json` and rename `[Unreleased]` to `[X.Y.Z] — YYYY-MM-DD` in CHANGELOG.md.

// turbo 3. Run quality checks:

```bash
npm run lint && npm run type-check && npm test
```

4. Stage and commit all changes (include changelog and version bump in the commit).

// turbo 5. Push the changes:

```bash
git push origin HEAD
```

6. If a version was bumped, tag and push the tag:

```bash
git tag -a vX.Y.Z -m "vX.Y.Z — description"
git push origin --tags
```
