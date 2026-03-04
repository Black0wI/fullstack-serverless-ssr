# CLAUDE.md — Project Context for Claude Code / Claude Opus 4.6
# This file provides Claude with project-specific knowledge when working on this codebase.

## Project Overview

**Tech Portal** is a modern Next.js 15 application deployed as a **static export** on AWS CloudFront via Terraform IaC. It serves as a production-ready boilerplate for building performant, globally-distributed web applications.

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | Next.js 15 (App Router, static export)  |
| Language       | TypeScript 5 (strict mode)              |
| Styling        | Vanilla CSS (custom properties, no Tailwind) |
| Hosting        | AWS CloudFront + S3 (OAC)               |
| IaC            | Terraform (~> 5.0 AWS provider)         |
| CI/CD          | GitHub Actions (deploy, preview, CI, auto-PR, release) |
| Edge Functions | CloudFront Functions (JS 2.0 runtime)   |
| Unit Tests     | Vitest + Testing Library                |
| E2E Tests      | Playwright                              |
| Performance    | Lighthouse CI                           |
| PWA            | Service Worker + manifest.json          |
| Analytics      | Cloudflare Web Analytics (optional)     |
| DNS            | Cloudflare (auto CNAME update)          |

## Project Structure

```
tech-portal/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx     # Root layout (metadata, PWA, analytics)
│   │   ├── page.tsx       # Landing page
│   │   └── globals.css    # Full design system
│   ├── components/        # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ServiceWorkerRegistration.tsx  # PWA SW loader
│   └── __tests__/         # Vitest unit tests
│       ├── setup.ts
│       └── components/
│           ├── Header.test.tsx
│           └── Footer.test.tsx
├── public/                # Static assets
│   ├── favicon.svg
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   ├── offline.html       # Offline fallback
│   └── icons/             # PWA icons (192, 512)
├── e2e/                   # Playwright E2E tests
│   └── landing.spec.ts
├── infra/                 # Terraform IaC
│   ├── main.tf            # S3 + CloudFront + OAC
│   ├── variables.tf       # Configurable inputs
│   ├── outputs.tf         # CDN URL, bucket name
│   ├── backend.tf         # Remote state (commented)
│   └── cloudfront-functions/
│       ├── url-rewrite.js       # URL rewriting for static export
│       └── security-headers.js  # CSP, HSTS, security headers
├── .github/workflows/     # GitHub Actions CI/CD
│   ├── deploy.yml         # Build → Terraform → S3 → CloudFront → Cloudflare DNS
│   ├── ci.yml             # Lint + Type-check + Build + E2E + Lighthouse + SBOM
│   ├── preview.yml        # PR: Terraform Plan comment
│   ├── auto-pr.yml        # ai-agent → main auto-PR
│   └── release.yml        # Auto GitHub Release on tag
├── .devcontainer/         # VS Code Dev Container
│   └── devcontainer.json
├── docs/
│   ├── specs/             # Functional specifications
│   └── architecture/decisions/  # ADR
├── tools/                 # Python scripts
│   ├── _template/tool.py
│   └── requirements.txt
├── .agents/workflows/     # Antigravity workflows
│   ├── deploy.md
│   ├── dev.md
│   └── push.md
├── CLAUDE.md              # This file
├── DEV-WORKFLOW.md        # Full onboarding guide
├── Makefile               # Dev automation
├── next.config.ts         # Static export + bundle analyzer
├── vitest.config.ts       # Unit test config
├── playwright.config.ts   # E2E test config
├── next-sitemap.config.js # Sitemap + robots.txt generator
├── .lighthouserc.json     # Performance budget
└── package.json           # Scripts + deps + lint-staged
```

## Git Workflow

- **`main`** — production (protected, requires approved PR)
- **`ai-agent`** — AI working branch (`make push` → auto-PR to main)
- **`feature/*`** / **`hotfix/*`** / **`refactor/*`** — human branches

All AI code must be reviewed by a human before reaching main.

## Commands

```bash
# Development
npm run dev          # Dev server (Turbopack, port 4000)
npm run build        # Static export → out/ (auto-generates sitemap + robots.txt)
npm run lint         # ESLint
npm run type-check   # TypeScript strict check
npm run format       # Prettier format

# Testing
npm test             # Vitest unit tests
npm run test:watch   # Vitest watch mode
npm run test:coverage # Vitest with v8 coverage

# Analysis & Release
npm run analyze      # Bundle size visualization
npm run changelog    # Generate CHANGELOG.md from commits

# Makefile shortcuts
make setup           # Install deps + copy .env
make dev             # Dev server
make check           # Lint + type-check + format + build
make push            # Push ai-agent → auto-PR to main
make force-deploy    # ⚠️ Emergency direct push to main
make deploy          # Full Terraform deploy
```

## Coding Conventions

### TypeScript
- **Strict mode** enabled — no `any`, no implicit returns
- Use `interface` for object shapes, `type` for unions/intersections
- Prefer `const` over `let`, never use `var`
- Use path aliases: `@/components/Header` not `../../components/Header`

### CSS
- **No utility classes** (no Tailwind) — use CSS custom properties
- All design tokens are in `globals.css` under `:root`
- BEM-inspired naming: `.block__element--modifier`
- Use `var(--token)` for all colors, spacing, typography, shadows

### Components
- One component per file in `src/components/`
- Export named functions (not default exports)
- Props typed with explicit interfaces
- Server Components by default (add `"use client"` only when needed)

### Testing
- Unit tests in `src/__tests__/` mirroring the source structure
- Use `@testing-library/react` for component tests
- E2E tests in `e2e/` using Playwright

### File Naming
- Components: `PascalCase.tsx`
- Tests: `ComponentName.test.tsx`
- Pages: `page.tsx` (App Router convention)
- CSS: `globals.css` (single design system file)

## Infrastructure

### Static Export
- `next.config.ts` uses `output: 'export'` with `trailingSlash: true`
- Bundle analyzer available via `ANALYZE=true` env var
- Built output goes to `out/` with auto-generated `sitemap.xml` and `robots.txt`

### CloudFront Functions
- `url-rewrite.js` — URL resolution: `/about` → `/about/index.html` (viewer-request)
- `security-headers.js` — CSP, HSTS, X-Frame-Options, Permissions-Policy (viewer-response)

### Deployment Flow
1. Push to `main` triggers `.github/workflows/deploy.yml`
2. Next.js builds static export (+ sitemap + robots.txt)
3. Terraform applies infrastructure changes
4. `aws s3 sync` uploads to S3 with smart cache headers
5. CloudFront cache is invalidated
6. Cloudflare CNAME is auto-updated (if configured)

## Design System

The design system lives in `src/app/globals.css` and provides:
- **Color palette**: Dark theme with indigo/purple accent gradients
- **Typography**: Inter (body), Outfit (headings), JetBrains Mono (code)
- **Spacing scale**: 4px base (`--space-1` through `--space-32`)
- **Components**: `.glass` (glassmorphism), `.btn` (buttons), `.badge` (labels)
- **Animations**: `fadeInUp`, `float`, `shimmer`, `gradientShift`

## Important Notes

- This is a **static site** — no server-side API routes
- Images must use `unoptimized: true` in Next.js config
- CloudFront uses OAC (not OAI) for S3 access — the bucket is fully private
- Terraform state is local by default; enable S3 backend in `infra/backend.tf`
- PWA service worker only activates in production
- Cloudflare analytics is optional (requires `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`)
