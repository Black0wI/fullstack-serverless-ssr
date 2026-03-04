# Tech Portal — Next.js Full-Stack on AWS

[![CI](https://github.com/itakademy/tech-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/itakademy/tech-portal/actions/workflows/ci.yml)
[![Deploy](https://github.com/itakademy/tech-portal/actions/workflows/deploy.yml/badge.svg)](https://github.com/itakademy/tech-portal/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 🚀 Production-ready Next.js 15 full-stack boilerplate deployed on AWS with SST v3 (OpenNext), GitHub Actions CI/CD, full test suite, PWA support, and Claude AI integration.

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────┐
│  GitHub Push │────▶│  GitHub Actions   │────▶│  SST Deploy │
│  (main)      │     │  Build + SST      │     │  (OpenNext) │
└──────────────┘     └──────────────────┘     └──────┬──────┘
                                                      │
                      ┌───────────────┐       ┌───────▼───────┐
                      │  Lambda@Edge  │◀──────│  CloudFront    │
                      │  (SSR/API)    │       │  (Edge CDN)    │
                      └───────┬───────┘       └───────┬───────┘
                              │                       │
                      ┌───────▼───────┐       ┌───────▼───────┐
                      │  S3 Bucket    │       │   End Users    │
                      │  (assets)     │       │  (Global Edge) │
                      └───────────────┘       └───────────────┘
```

## Quick Start

```bash
# Clone and setup
git clone https://github.com/itakademy/tech-portal.git
cd tech-portal
make setup

# Start development
make dev
# → http://localhost:4000
```

## Stack

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| Framework   | Next.js 15 (App Router, SSR + Static) |
| Language    | TypeScript 5 (strict mode)            |
| Styling     | Vanilla CSS (custom properties)       |
| Hosting     | AWS CloudFront + Lambda + S3          |
| IaC         | SST v3 (OpenNext)                     |
| CI/CD       | GitHub Actions                        |
| Unit Tests  | Vitest + Testing Library              |
| E2E Tests   | Playwright                            |
| Performance | Lighthouse CI (score ≥ 90)            |
| AI          | Claude Opus 4.6 (CLAUDE.md)           |

## Features

- ⚡ **Full-Stack** — SSR, API Routes, Server Actions, ISR
- 🌐 **Global Edge** — CloudFront CDN via OpenNext
- 🔒 **Security** — CSP, HSTS, security headers
- 📱 **PWA** — Installable, offline-first with service worker
- 🧪 **Full Test Suite** — Vitest (unit) + Playwright (E2E) + Lighthouse (perf)
- 📊 **Bundle Analyzer** — `npm run analyze` to visualize JS size
- 🗺️ **SEO** — Auto-generated `sitemap.xml` + `robots.txt`
- 📋 **Changelog** — Auto-generated from conventional commits
- 🤖 **AI-Ready** — Claude, Copilot, and Cursor integrations
- 🐳 **Dev Container** — One-click onboarding via VS Code
- 🔄 **Auto Releases** — GitHub Releases on `git tag v*`
- 🌐 **Cloudflare DNS** — Auto CNAME update on deploy

## Commands

```bash
make dev          # Dev server (Turbopack, port 4000)
make build        # Build the application
make deploy       # Deploy to production with SST
make check        # Lint + type-check + format + build
make push         # Push ai-agent → auto-PR to main
make force-deploy # ⚠️ Emergency: direct push to main
make sst-dev      # SST dev mode (live Lambda)
make help         # Show all commands

npm test          # Unit tests (Vitest)
npm run analyze   # Bundle size analysis
npm run changelog # Generate CHANGELOG.md
```

## Git Workflow

```
main (production, protected)
  ├── ai-agent      ← AI branch (auto-PR to main)
  ├── feature/*     ← Human features
  ├── hotfix/*      ← Urgent fixes
  └── refactor/*    ← Technical refactoring
```

All AI code goes through `make push` → auto-PR → **mandatory human review** → merge → auto-deploy.

## Infrastructure Setup

### Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js >= 22

### First Deployment

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your values

# 2. Deploy
make deploy
```

### GitHub Secrets

| Type         | Name                     | Description                          |
| ------------ | ------------------------ | ------------------------------------ |
| **Secret**   | `AWS_ROLE_ARN`           | IAM role ARN for OIDC authentication |
| **Secret**   | `CLOUDFLARE_API_TOKEN`   | Cloudflare API token (DNS Edit)      |
| **Secret**   | `CLOUDFLARE_ZONE_ID`     | Cloudflare zone ID                   |
| **Variable** | `CLOUDFLARE_RECORD_NAME` | CNAME record name                    |

### Custom Domain

Uncomment the `domain` property in `sst.config.ts`:

```ts
new sst.aws.Nextjs("Web", {
  domain: "portal.example.com",
});
```

## AI Integration

| File                              | Assistant              | Purpose                              |
| --------------------------------- | ---------------------- | ------------------------------------ |
| `CLAUDE.md`                       | Claude Code / Opus 4.6 | Project context and conventions      |
| `.claude/settings.json`           | Claude Code            | Allowed/denied commands              |
| `.github/copilot-instructions.md` | GitHub Copilot         | Coding conventions                   |
| `.cursorrules`                    | Cursor AI              | Coding rules                         |
| `.agents/workflows/`              | Antigravity            | `/deploy`, `/dev`, `/push` workflows |

## Documentation

- **[DEV-WORKFLOW.md](DEV-WORKFLOW.md)** — Complete onboarding guide & infrastructure docs
- **[docs/specs/](docs/specs/)** — Functional specifications (templates)
- **[docs/architecture/decisions/](docs/architecture/decisions/)** — Architecture Decision Records

## License

MIT — [Jean-Baptiste MONIN](LICENSE)
