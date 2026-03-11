# Next.js SST Boilerplate

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Production-ready Next.js 16 boilerplate for AWS with SST v4, OpenNext, direct CLI deployment, typed environment validation, and a working end-to-end quality gate.

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
cd nextjs-static-edge-template
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
- 🔒 **Security Baseline** — HSTS and core security headers out of the box
- 📱 **Optional PWA** — Service worker and offline page can be enabled or disabled with env config
- 🧪 **Test Suite** — Vitest (unit) + Playwright (E2E) + unified `npm run check`
- 📊 **Bundle Analyzer** — `npm run analyze` to visualize JS size
- 🗺️ **SEO** — Auto-generated `sitemap.xml` + `robots.txt`
- 🤖 **AI-Ready** — Local assistant context files are included
- 🌐 **Cloudflare DNS** — Managed by SST when deploy credentials are configured

## Commands

```bash
make dev          # Dev server (Turbopack, port 4040)
make build        # Build the application
make deploy       # Deploy to production with SST
make sst-dev      # SST dev mode (live Lambda)
make sst-diff     # Preview infrastructure changes
make help         # Show all commands

npm test          # Unit tests (Vitest)
npm run test:e2e  # End-to-end tests (Playwright)
npm run check     # Lint + type-check + unit tests + build + E2E
npm run analyze   # Bundle size analysis
```

## Infrastructure Setup

### Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js >= 22
- Cloudflare account (for DNS management)

### Environment Variables

| Variable                         | Required    | Description                              |
| -------------------------------- | ----------- | ---------------------------------------- |
| `AWS_PROFILE`                    | Deploy      | AWS CLI profile                          |
| `NEXT_PUBLIC_SITE_URL`           | Recommended | Public site URL used for SEO and sitemap |
| `NEXT_PUBLIC_ENABLE_PWA`         | Optional    | Enable service worker registration       |
| `DOMAIN_NAME`                    | Deploy      | Custom domain name                       |
| `CLOUDFLARE_API_TOKEN`           | Deploy      | Cloudflare API token                     |
| `CLOUDFLARE_DEFAULT_ACCOUNT_ID`  | Deploy      | Cloudflare account ID                    |
| `AUTH_SECRET`                    | Optional    | Required only if you enable Auth.js      |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Optional    | Cloudflare Web Analytics token           |

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

## Support Boundaries

- **Core production path:** Next.js app, SST deployment, CloudFront/OpenNext runtime, API routes, server actions, build, unit tests, and E2E checks.
- **Optional features:** PWA, Cloudflare analytics, Google auth provider, custom auth flows, and Cloudflare DNS deployment integration.
- **Example-only code:** the Credentials auth provider in [src/lib/auth.ts](/Users/jbm/Documents/GitHub/nextjs-static-edge-template/src/lib/auth.ts) is a stub and must be replaced before using auth in production.
- **Non-goal by default:** distributed rate limiting. The proxy keeps a best-effort in-memory limiter for non-production only; production deployments should use a shared backend such as Redis or DynamoDB if rate limiting is required.

## AI Integration

This boilerplate ships with project context files that let AI coding assistants understand the architecture, conventions, and commands without you having to explain them each time.

| File                    | Assistant                   | Purpose                                           |
| ----------------------- | --------------------------- | ------------------------------------------------- |
| `CLAUDE.md`             | Claude Code / Opus          | Full project context, conventions, and commands   |
| `GEMINI.md`             | Google Gemini / Antigravity | Project overview, structure, and coding standards |
| `CODEX.md`              | OpenAI Codex / ChatGPT      | Architecture summary and development guidelines   |
| `AGENTS.md`             | Generic AI agents           | Agent-agnostic project context                    |
| `.cursorrules`          | Cursor AI                   | Inline coding rules and constraints               |
| `.claude/settings.json` | Claude Code                 | Allowed tool permissions                          |
| `.agents/workflows/`    | Antigravity                 | `/deploy`, `/dev`, `/push` automation workflows   |

> **Tip**: When you open the project in an AI-assisted editor, the assistant automatically reads the relevant context file and understands the stack, file structure, available commands, and coding conventions.

## Documentation

- **[docs/specs/](docs/specs/)** — Functional specifications (templates)
- **[docs/architecture/decisions/](docs/architecture/decisions/)** — Architecture Decision Records

## License

MIT — [Jean-Baptiste MONIN](LICENSE)
