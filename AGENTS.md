# AGENTS.md — Project Context for Codex / Codex Opus 4.6

# This file provides Codex with project-specific knowledge when working on this codebase.

## Project Overview

**Fullstack Serverless SSR** is a modern Next.js 16 full-stack application deployed on AWS via **SST v4** (Ion/OpenNext). It supports SSR, API Routes, Server Actions, and static pages — all served globally through CloudFront with Cloudflare DNS integration.

## Tech Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 16 (App Router, SSR + Static)                  |
| Language   | TypeScript 5 (strict mode)                             |
| Styling    | Vanilla CSS (custom properties, no Tailwind)           |
| Hosting    | AWS CloudFront + Lambda + S3 (SST/OpenNext)            |
| IaC        | SST v4 Ion (sst.config.ts)                             |
| Deploy     | CLI direct (`npx sst deploy`)                          |
| DNS        | Cloudflare (managed by SST via `sst.cloudflare.dns()`) |
| Unit Tests | Vitest + Testing Library                               |
| E2E Tests  | Playwright                                             |
| PWA        | Service Worker + manifest.json                         |
| Analytics  | Cloudflare Web Analytics (optional)                    |

## Project Structure

```
fullstack-serverless-ssr/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx     # Root layout (metadata, PWA, analytics)
│   │   ├── page.tsx       # Landing page
│   │   ├── globals.css    # Full design system
│   │   └── api/           # API Routes (server-side)
│   │       └── health/route.ts  # Health check endpoint
│   ├── components/        # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ServiceWorkerRegistration.tsx
│   └── __tests__/         # Vitest unit tests
│       ├── setup.ts
│       └── components/
├── public/                # Static assets
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   ├── offline.html       # Offline fallback
│   └── icons/             # PWA icons
├── e2e/                   # Playwright E2E tests
├── docs/                  # Specs + ADR
├── tools/                 # Python scripts
├── .agents/workflows/     # Antigravity workflows
├── sst.config.ts          # SST v4 infrastructure config
├── next.config.ts         # Next.js config + bundle analyzer
├── vitest.config.ts       # Unit test config
├── next-sitemap.config.js # Sitemap + robots.txt generator
├── Makefile               # Dev automation
└── package.json           # Scripts + deps
```

## Commands

```bash
# Development
npm run dev          # Dev server (Turbopack, port 4040)
npm run build        # Build application
npm run lint         # ESLint
npm run type-check   # TypeScript strict check
npm run format       # Prettier format

# Testing
npm test             # Vitest unit tests
npm run test:watch   # Vitest watch mode
npm run test:coverage # Coverage report

# Analysis
npm run analyze      # Bundle size visualization

# Makefile
make deploy          # SST deploy to production
make sst-dev         # SST dev mode (live Lambda)
make sst-diff        # Preview infrastructure changes
make sst-remove      # Remove SST infrastructure
```

## Infrastructure

### SST v4 Ion (OpenNext)

The infrastructure is defined in `sst.config.ts`:

- `sst.aws.Nextjs("Web")` deploys via OpenNext
- Manages CloudFront distribution, Lambda functions, S3 bucket
- Custom domain via Cloudflare DNS integration (`sst.cloudflare.dns()`)
- Environment variables are passed to Lambda runtime
- Deploy guards prevent accidental conflicts (default app name or missing domain)

### Deployment Flow

1. Configure AWS CLI (`aws sts get-caller-identity`)
2. Set `DOMAIN_NAME`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_DEFAULT_ACCOUNT_ID`
3. Run `npx sst deploy --stage production` (or `make deploy`)
4. SST builds (OpenNext), uploads assets to S3, deploys Lambda functions
5. CloudFront distribution is automatically configured
6. Cloudflare DNS records are automatically managed by SST

### API Routes

- Server-side API routes available at `src/app/api/`
- Example: `GET /api/health` returns status + timestamp
- Can use secrets (env vars) server-side without exposure

## Coding Conventions

### TypeScript

- **Strict mode** — no `any`, no implicit returns
- Use `interface` for object shapes, `type` for unions
- Path aliases: `@/components/Header`
- Server Components by default, `"use client"` only when needed

### CSS

- **No Tailwind** — CSS custom properties (`var(--token)`)
- BEM-inspired naming: `.block__element--modifier`
- Design tokens in `globals.css` under `:root`

### Testing

- Unit tests in `src/__tests__/` mirroring source structure
- E2E tests in `e2e/` using Playwright

## Design System

`src/app/globals.css` provides:

- **Color palette**: Dark theme with indigo/purple accents
- **Typography**: Inter (body), Outfit (headings), JetBrains Mono (code)
- **Spacing**: 4px base (`--space-1` through `--space-32`)
- **Components**: `.glass`, `.btn`, `.badge`
- **Animations**: `fadeInUp`, `float`, `shimmer`, `gradientShift`

## Versioning & Changelog

This project follows [Semantic Versioning](https://semver.org/) (SemVer) and maintains a `CHANGELOG.md` using the [Keep a Changelog](https://keepachangelog.com/) format.

### SemVer Rules

- **MAJOR** (x.0.0) — Breaking changes (API, config schema, infrastructure)
- **MINOR** (0.x.0) — New features, new pages, new dependencies
- **PATCH** (0.0.x) — Bug fixes, typos, doc updates, refactors with no behavior change

### On Every Commit

When committing changes, you **MUST**:

1. **Update `CHANGELOG.md`** — Add entries under an `## [Unreleased]` section at the top, grouped by `### Added`, `### Changed`, `### Fixed`, `### Removed` as applicable
2. **Bump `version` in `package.json`** — When the user explicitly requests a release or when changes warrant a version bump
3. **Tag releases** — When bumping version, create an annotated git tag: `git tag -a vX.Y.Z -m "vX.Y.Z — description"`

### Changelog Entry Format

```markdown
## [Unreleased]

### Added

- **Feature name** — Short description of what was added

### Changed

- **Component name** — What changed and why

### Fixed

- **Bug description** — What was broken and how it was fixed
```

When a version is released, rename `[Unreleased]` to `[X.Y.Z] — YYYY-MM-DD` and add a comparison link at the bottom of the file.

## Important Notes

- SST v4 uses OpenNext to deploy Next.js on AWS (Lambda + CloudFront + S3)
- `sst.config.ts` is excluded from tsconfig — it has its own type system via `.sst/platform/`
- Run `npx sst dev` for live Lambda development
- PWA service worker only activates in production
- Cloudflare analytics requires `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`
- Deploy directly via CLI — no GitHub Actions required

# Agent Instructions

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**

- Basically just SOPs written in Markdown, live in `docs/specs/`
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**

- This is you. Your job: intelligent routing.
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings
- You're the glue between intent and execution. E.g you don't try scraping websites yourself—you read `docs/specs/scrape_website.md` and come up with inputs/outputs and then run `tools/scrape_single_site.py`

**Layer 3: Execution (Doing the work)**

- Deterministic Python scripts in `tools/`
- Environment variables, api tokens, etc are stored in `.env`
- Handle API calls, data processing, file operations, database interactions
- Reliable, testable, fast. Use scripts instead of manual work. Commented well.

**Why this works:** if you do everything yourself, errors compound. 90% accuracy per step = 59% success over 5 steps. The solution is push complexity into deterministic code. That way you just focus on decision-making.

## Operating Principles

Before you start to code the project for the very first time :

- ask the user for the project name and use this name to update the sst.config.ts file in order to create a new cloudfront ditribution when deploying.
- ask for custom domain name and update all necessary files with that name.
- ask for Clouflare related IDs and token.

**1. Check for tools first**
Before writing a script, check `tools/` per your directive. Only create new scripts if none exist.

**2. Self-anneal when things break**

- Read error message and stack trace
- Fix the script and test it again (unless it uses paid tokens/credits/etc—in which case you check w user first)
- Update the directive with what you learned (API limits, timing, edge cases)
- Example: you hit an API rate limit → you then look into API → find a batch endpoint that would fix → rewrite script to accommodate → test → update directive.

**3. Update directives as you learn**
Directives are living documents. When you discover API constraints, better approaches, common errors, or timing expectations—update the directive. But don't create or overwrite directives without asking unless explicitly told to. Directives are your instruction set and must be preserved (and improved upon over time, not extemporaneously used and then discarded).

## Self-annealing loop

Errors are learning opportunities. When something breaks:

1. Fix it
2. Update the tool
3. Test tool, make sure it works
4. Update directive to include new flow
5. System is now stronger

## File Organization

**Deliverables vs Intermediates:**

- **Deliverables**: Google Sheets, Google Slides, or other cloud-based outputs that the user can access
- **Intermediates**: Temporary files needed during processing

**Directory structure:**

- `.tmp/` - All intermediate files (dossiers, scraped data, temp exports). Never commit, always regenerated.
- `tools/` - Python scripts (the deterministic tools)
- `docs/specs/` - SOPs in Markdown (the instruction set)
- `.env` - Environment variables and API keys
- `credentials.json`, `token.json` - Google OAuth credentials (required files, in `.gitignore`)

**Key principle:** Local files are only for processing. Deliverables live in cloud services (Google Sheets, Slides, etc.) where the user can access them. Everything in `.tmp/` can be deleted and regenerated.

## Summary

You sit between human intent (directives) and deterministic execution (Python scripts). Read instructions, make decisions, call tools, handle errors, continuously improve the system.

Be pragmatic. Be reliable. Self-anneal.
