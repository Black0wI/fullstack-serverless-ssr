# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Versioning & Changelog** — SemVer rules and CHANGELOG format added to all 4 AI context files (CLAUDE.md, GEMINI.md, CODEX.md, AGENTS.md)
- **`/push` workflow** — Now includes CHANGELOG update and version bump steps

### Changed

- **ADR-0001** — Replaced outdated static-export-cloudfront ADR with fullstack-ssr-aws-sst-v4 reflecting current architecture
- **AI Integration** — Expanded README section with all 7 context files

## [1.0.0] — 2026-03-11

First stable release of the Next.js SST Boilerplate.

### Added

- **Next.js 16** with App Router, Turbopack, and `cacheComponents` enabled
- **SST v4 Ion** deployment with OpenNext (Lambda + CloudFront + S3)
- **Cloudflare DNS** auto-managed by SST on deploy
- **Typed environment validation** (`lib/env.ts`) with Zod schemas and placeholder sanitization
- **Security headers** — HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **NextAuth v5 stub** — Google OAuth + Credentials (conditional activation via env vars)
- **Server Actions example** — feedback form with Zod validation (`/examples`)
- **`use cache` example** — granular server-side caching demo (`/examples`)
- **SEO utility** (`lib/seo.ts`) — `createMetadata()` with Open Graph, Twitter Cards, canonical URLs
- **Structured logger** (`lib/logger.ts`) — JSON output for CloudWatch, human-readable in dev
- **`/docs` page** — renders README.md using remark AST (no `dangerouslySetInnerHTML`)
- **Error pages** — styled `error.tsx`, `not-found.tsx`, `loading.tsx`
- **PWA support** — service worker, manifest, offline fallback page
- **i18n** — `next-intl` with French locale
- **`proxy.ts`** — Next.js 16 network proxy with best-effort rate limiter (non-production)
- **Health endpoint** (`/api/health`) — version, uptime, memory, configuration checks
- **Unified quality gate** — `npm run check` (lint + type-check + test + build + e2e)
- **Test suite** — Vitest (7 unit tests) + Playwright (e2e ready)
- **Bundle analyzer** — `npm run analyze`
- **Sitemap + robots.txt** — auto-generated via `next-sitemap`
- **DX tooling** — Husky, Commitlint, lint-staged, Renovate, Prettier
- **AI context files** — CLAUDE.md, GEMINI.md, CODEX.md, AGENTS.md, `.cursorrules`
- **Antigravity workflows** — `/deploy`, `/dev`, `/push`
- **Dev Container** — VS Code one-click onboarding
- **Multi-stage deploys** — `make deploy`, `make deploy-staging`
- **Deploy guards** — SST throws if APP_NAME or DOMAIN_NAME is not configured

## [0.4.0] — 2026-03-10

### Added

- Next.js 16 migration from v15 (`middleware.ts` → `proxy.ts`)
- ESLint CLI migration (native flat config, no `FlatCompat`)
- Boilerplate enhancements: error pages, logger, NextAuth stub, Renovate, commitlint
- Security hardening: headers, credential removal, deploy guards
- `/examples` page with Server Actions + `use cache` demos

### Changed

- Project renamed from "Tech Portal" to "Fullstack Serverless SSR" then "Next.js SST Boilerplate"
- Footer converted to client component (cacheComponents compatibility)
- Rate limiter scoped to non-production only
- Docs page rewritten with remark AST (replaced `dangerouslySetInnerHTML`)
- All French comments translated to English

## [0.3.0] — 2026-03-09

### Changed

- Migrated from SST v3 to SST v4 Ion with direct CLI deployment
- Removed GitHub Actions CI/CD (deploy now via `npx sst deploy`)
- Cleaned up dashboard routes and renamed project branding

## [0.2.0] — 2026-03-04

### Added

- `/docs` page rendering README.md as styled HTML
- GitHub Pages deployment workflow (static export)
- ADR-0001 revision for SSR on AWS via SST

### Fixed

- Docs page 500 error with zero-dependency markdown converter
- Internal anchor links using Next.js `Link`
- Footer docs link using Next.js `Link`

## [0.1.0] — 2026-03-03

### Added

- Initial template: Next.js 15 + App Router + TypeScript strict
- Terraform infrastructure for CloudFront + S3
- GitHub Actions CI/CD pipeline
- Vitest unit tests + Playwright e2e setup
- PWA: service worker, manifest, offline page
- Bundle analyzer, sitemap, Cloudflare DNS
- Dev Container for VS Code
- Migration from Terraform to SST v3 (Ion)
- Environment validation, rate limiting, auth, i18n, SEO, error boundary

[1.0.0]: https://github.com/Black0wI/fullstack-serverless-ssr/compare/v0.4.0...v1.0.0
[0.4.0]: https://github.com/Black0wI/fullstack-serverless-ssr/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Black0wI/fullstack-serverless-ssr/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Black0wI/fullstack-serverless-ssr/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Black0wI/fullstack-serverless-ssr/releases/tag/v0.1.0
