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
| CI/CD          | GitHub Actions (deploy, preview, CI)    |
| Edge Functions | CloudFront Functions (JS 2.0 runtime)   |

## Project Structure

```
tech-portal/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx     # Root layout (metadata, fonts, Header/Footer)
│   │   ├── page.tsx       # Landing page
│   │   └── globals.css    # Full design system
│   └── components/        # Reusable UI components
│       ├── Header.tsx
│       └── Footer.tsx
├── public/                # Static assets (favicon, images)
├── infra/                 # Terraform IaC
│   ├── main.tf            # S3 + CloudFront + OAC
│   ├── variables.tf       # Configurable inputs
│   ├── outputs.tf         # CDN URL, bucket name
│   ├── backend.tf         # Remote state (commented)
│   └── cloudfront-functions/
│       └── url-rewrite.js # URL rewriting for static export
├── .github/workflows/     # GitHub Actions CI/CD
│   ├── deploy.yml         # Build → Apply → S3 Sync → Invalidate
│   ├── preview.yml        # PR: Terraform Plan comment
│   └── ci.yml             # PR: Lint + Type-check + Build
├── CLAUDE.md              # This file
├── Makefile               # Dev automation shortcuts
└── package.json           # Scripts: dev, build, lint, type-check, format
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
- Animations use named `@keyframes` with CSS custom timing functions

### Components
- One component per file in `src/components/`
- Export named functions (not default exports)
- Props typed with explicit interfaces
- Server Components by default (add `"use client"` only when needed)

### File Naming
- Components: `PascalCase.tsx`
- Pages: `page.tsx` (App Router convention)
- CSS: `globals.css` (single design system file)

## Commands

```bash
npm run dev          # Start dev server (Turbopack, port 4000)
npm run build        # Static export → out/
npm run lint         # ESLint
npm run type-check   # TypeScript strict check
npm run format       # Prettier format
make setup           # Full project setup
make deploy          # Terraform apply + S3 sync
```

## Infrastructure

### Static Export
- `next.config.ts` uses `output: 'export'` with `trailingSlash: true`
- Built output goes to `out/` directory
- All routes become `/<route>/index.html`

### CloudFront Function
- `url-rewrite.js` handles URL resolution: `/about` → `/about/index.html`
- Runs on `viewer-request` event at edge locations

### Deployment Flow
1. Push to `main` triggers `.github/workflows/deploy.yml`
2. Next.js builds static export
3. Terraform applies infrastructure changes
4. `aws s3 sync` uploads to S3 with smart cache headers
5. CloudFront cache is invalidated

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
