# CODEX.md — Project Context for OpenAI Codex / ChatGPT

# This file provides Codex with project-specific knowledge when working on this codebase.

## Project Overview

**Fullstack Serverless SSR** is a modern Next.js 15 full-stack application deployed on AWS via **SST v4** (Ion/OpenNext). It supports SSR, API Routes, Server Actions, and static pages — all served globally through CloudFront with Cloudflare DNS integration.

## Tech Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 15 (App Router, SSR + Static)                  |
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

## Important Notes

- SST v4 uses OpenNext to deploy Next.js on AWS (Lambda + CloudFront + S3)
- `sst.config.ts` is excluded from tsconfig — it has its own type system via `.sst/platform/`
- Run `npx sst dev` for live Lambda development
- PWA service worker only activates in production
- Cloudflare analytics requires `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`
- Deploy directly via CLI — no GitHub Actions required
