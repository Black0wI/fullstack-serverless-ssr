---
description: Create a new versioned release
---

# Release

Create a new SemVer release: finalize the changelog, bump the version, tag, and push.

## Prerequisites

- All changes committed and pushed
- `CHANGELOG.md` has entries under `## [Unreleased]`
- All quality checks pass

## Steps

1. **Determine the version bump** based on the changes in `[Unreleased]`:
   - **PATCH** (0.0.x) — Bug fixes, typos, doc updates, refactors with no behavior change
   - **MINOR** (0.x.0) — New features, new pages, new dependencies
   - **MAJOR** (x.0.0) — Breaking changes (API, config schema, infrastructure)

2. **Update `package.json`** — Bump the `version` field to the new version.

3. **Finalize `CHANGELOG.md`**:
   - Rename `## [Unreleased]` to `## [X.Y.Z] — YYYY-MM-DD`
   - Add a new empty `## [Unreleased]` section above it
   - Add a comparison link at the bottom: `[X.Y.Z]: https://github.com/Black0wI/fullstack-serverless-ssr/compare/vPREVIOUS...vX.Y.Z`

// turbo 4. Run the full quality gate:

```bash
npm run lint && npm run type-check && npm test && npm run build
```

5. Commit the release:

```bash
git add -A && git commit -m "release: vX.Y.Z"
```

// turbo 6. Create an annotated git tag:

```bash
git tag -a vX.Y.Z -m "vX.Y.Z — Short release description"
```

// turbo 7. Push the commit and tag:

```bash
git push origin HEAD --tags
```

## Example

For a minor release from v1.0.0 to v1.1.0:

```bash
# After updating package.json and CHANGELOG.md:
npm run lint && npm run type-check && npm test && npm run build
git add -A && git commit -m "release: v1.1.0"
git tag -a v1.1.0 -m "v1.1.0 — Add dark/light theme toggle and OG image"
git push origin HEAD --tags
```

## Shortcut

All-in-one via the Makefile (after updating package.json and CHANGELOG.md):

```bash
make release VERSION=1.1.0
```
