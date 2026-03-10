# Fullstack Serverless SSR — Next.js on AWS

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 🚀 Production-ready Next.js 16 full-stack boilerplate deployed on AWS with SST v4 Ion (OpenNext), direct CLI deployment, full test suite, and PWA support.

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Developer   │────▶│  SST CLI Deploy  │────▶│  AWS CloudFront  │
│  (local)     │     │  (OpenNext)      │     │  (Edge CDN)      │
└──────────────┘     └──────────────────┘     └──────┬──────────┘
                                                      │
                       ┌───────────────┐       ┌──────▼──────────┐
                       │  Lambda       │◀──────│  Cloudflare DNS  │
                       │  (SSR/API)    │       │  (managed by SST)│
                       └───────┬───────┘       └─────────────────┘
                               │
                       ┌───────▼───────┐
                       │  S3 Bucket    │
                       │  (assets)     │
                       └───────────────┘
```

## Quick Start

```bash
# Clone and setup
git clone https://github.com/Black0wI/nextjs-static-edge-template.git
cd fullstack-serverless-ssr
make setup

# Start development
make dev
# → http://localhost:4040
```

## Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Framework  | Next.js 16 (App Router, SSR + Static) |
| Language   | TypeScript 5 (strict mode)            |
| Styling    | Vanilla CSS (custom properties)       |
| Hosting    | AWS CloudFront + Lambda + S3          |
| IaC        | SST v4 Ion (OpenNext)                 |
| Deploy     | CLI direct (`npx sst deploy`)         |
| DNS        | Cloudflare (managed by SST)           |
| Unit Tests | Vitest + Testing Library              |
| E2E Tests  | Playwright                            |

## Features

- ⚡ **Full-Stack SSR** — SSR, API Routes, Server Actions, ISR
- 🌐 **Global Edge** — CloudFront CDN via OpenNext
- 🔒 **Security** — CSP, HSTS, security headers
- 📱 **PWA** — Installable, offline-first with service worker
- 🧪 **Test Suite** — Vitest (unit) + Playwright (E2E)
- 📊 **Bundle Analyzer** — `npm run analyze` to visualize JS size
- 🗺️ **SEO** — Auto-generated `sitemap.xml` + `robots.txt`
- 🤖 **AI-Ready** — Claude, Copilot, and Cursor integrations
- 🐳 **Dev Container** — One-click onboarding via VS Code
- 🌐 **Cloudflare DNS** — Auto-managed by SST on deploy

## Commands

```bash
make dev          # Dev server (Turbopack, port 4040)
make build        # Build the application
make deploy       # Deploy to production with SST
make check        # Lint + type-check + format + build
make sst-dev      # SST dev mode (live Lambda)
make sst-diff     # Preview infrastructure changes
make help         # Show all commands

npm test          # Unit tests (Vitest)
npm run analyze   # Bundle size analysis
```

## Infrastructure Setup

### Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js >= 22
- Cloudflare account (for DNS management)

### Environment Variables

| Variable                        | Required   | Description           |
| ------------------------------- | ---------- | --------------------- |
| `AWS_PROFILE`                   | Yes        | AWS CLI profile       |
| `DOMAIN_NAME`                   | Production | Custom domain name    |
| `CLOUDFLARE_API_TOKEN`          | Production | Cloudflare API token  |
| `CLOUDFLARE_DEFAULT_ACCOUNT_ID` | Production | Cloudflare account ID |

### First Deployment

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your values

# 2. Deploy
make deploy
```

SST will automatically:

- Build the Next.js app via OpenNext
- Create Lambda functions for SSR/API
- Configure CloudFront distribution
- Manage Cloudflare DNS records

### Custom Domain

The domain is configured in `sst.config.ts` via the `DOMAIN_NAME` env var:

```ts
new sst.aws.Nextjs("Web", {
  domain: {
    name: process.env.DOMAIN_NAME!,
    dns: sst.cloudflare.dns(),
  },
});
```

## AI Integration

| File                 | Assistant              | Purpose                              |
| -------------------- | ---------------------- | ------------------------------------ |
| `CLAUDE.md`          | Claude Code / Opus 4.6 | Project context and conventions      |
| `.cursorrules`       | Cursor AI              | Coding rules                         |
| `.agents/workflows/` | Antigravity            | `/deploy`, `/dev`, `/push` workflows |

## Documentation

- **[docs/specs/](docs/specs/)** — Functional specifications (templates)
- **[docs/architecture/decisions/](docs/architecture/decisions/)** — Architecture Decision Records

## License

MIT — [Jean-Baptiste MONIN](LICENSE)
