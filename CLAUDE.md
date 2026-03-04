# CLAUDE.md — Project Context for Claude Code / Claude Opus 4.6

# This file provides Claude with project-specific knowledge when working on this codebase.

## Project Overview

**Tech Portal** is a modern Next.js 15 full-stack application deployed on AWS via **SST v3** (OpenNext). It supports SSR, API Routes, Server Actions, and static pages — all served globally through CloudFront.

## Tech Stack

| Layer       | Technology                                             |
| ----------- | ------------------------------------------------------ |
| Framework   | Next.js 15 (App Router, SSR + Static)                  |
| Language    | TypeScript 5 (strict mode)                             |
| Styling     | Vanilla CSS (custom properties, no Tailwind)           |
| Hosting     | AWS CloudFront + Lambda + S3 (SST/OpenNext)            |
| IaC         | SST v3 (sst.config.ts)                                 |
| CI/CD       | GitHub Actions (deploy, preview, CI, auto-PR, release) |
| Unit Tests  | Vitest + Testing Library                               |
| E2E Tests   | Playwright                                             |
| Performance | Lighthouse CI                                          |
| PWA         | Service Worker + manifest.json                         |
| Analytics   | Cloudflare Web Analytics (optional)                    |
| DNS         | Cloudflare (auto CNAME update)                         |

## Project Structure

```
tech-portal/
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
├── .github/workflows/     # GitHub Actions CI/CD
│   ├── deploy.yml         # SST deploy + Cloudflare DNS
│   ├── ci.yml             # Lint + Type-check + Build + E2E + Lighthouse
│   ├── preview.yml        # SST diff on PR
│   ├── auto-pr.yml        # ai-agent → main auto-PR
│   └── release.yml        # Auto GitHub Release on tag
├── .devcontainer/         # VS Code Dev Container
├── docs/                  # Specs + ADR
├── tools/                 # Python scripts
├── .agents/workflows/     # Antigravity workflows
├── sst.config.ts          # SST v3 infrastructure config
├── next.config.ts         # Next.js config + bundle analyzer
├── vitest.config.ts       # Unit test config
├── next-sitemap.config.js # Sitemap + robots.txt generator
├── Makefile               # Dev automation
└── package.json           # Scripts + deps
```

## Git Workflow

- **`main`** — production (protected, requires approved PR)
- **`ai-agent`** — AI working branch (`make push` → auto-PR to main)
- **`feature/*`** / **`hotfix/*`** / **`refactor/*`** — human branches

## Commands

```bash
# Development
npm run dev          # Dev server (Turbopack, port 4000)
npm run build        # Build application
npm run lint         # ESLint
npm run type-check   # TypeScript strict check
npm run format       # Prettier format

# Testing
npm test             # Vitest unit tests
npm run test:watch   # Vitest watch mode
npm run test:coverage # Coverage report

# Analysis & Release
npm run analyze      # Bundle size visualization
npm run changelog    # Generate CHANGELOG.md

# Makefile
make deploy          # SST deploy to production
make sst-dev         # SST dev mode (live Lambda)
make sst-diff        # Preview infrastructure changes
make push            # Push ai-agent → auto-PR
make force-deploy    # ⚠️ Emergency direct push
```

## Infrastructure

### SST v3 (OpenNext)

The infrastructure is defined in `sst.config.ts`:

- `sst.aws.Nextjs("Web")` deploys via OpenNext
- Manages CloudFront distribution, Lambda@Edge functions, S3 bucket
- Custom domain support via `domain` property
- Resource linking (S3, DynamoDB, etc.) via `link` property

### Deployment Flow

1. Push to `main` triggers `.github/workflows/deploy.yml`
2. `npx sst deploy --stage production` deploys via OpenNext
3. SST builds, uploads assets to S3, deploys Lambda functions
4. CloudFront distribution is automatically configured
5. Cloudflare CNAME is auto-updated (if configured)

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

## Important Notes

- SST v3 uses OpenNext to deploy Next.js on AWS (Lambda + CloudFront + S3)
- `sst.config.ts` is excluded from tsconfig — it has its own type system via `.sst/platform/`
- Run `npx sst dev` for live Lambda development
- PWA service worker only activates in production
- Cloudflare analytics requires `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`
