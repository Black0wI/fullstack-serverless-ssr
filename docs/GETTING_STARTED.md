# Getting Started

This guide walks you through using the Next.js SST Boilerplate to start a new project — from initial setup to production deployment.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [1. Create Your Project](#1-create-your-project)
- [2. Configure Your Project](#2-configure-your-project)
- [3. Local Development](#3-local-development)
- [4. Project Structure](#4-project-structure)
- [5. Building Features](#5-building-features)
- [6. Testing](#6-testing)
- [7. Deploy to AWS](#7-deploy-to-aws)
- [8. Maintenance & Releases](#8-maintenance--releases)
- [9. Common Recipes](#9-common-recipes)

---

## Prerequisites

| Tool        | Version | Check Command   |
| ----------- | ------- | --------------- |
| **Node.js** | ≥ 22    | `node -v`       |
| **npm**     | ≥ 10    | `npm -v`        |
| **AWS CLI** | ≥ 2     | `aws --version` |
| **Git**     | ≥ 2     | `git --version` |

For deployment, you'll also need:

- An **AWS account** with programmatic access configured (`aws sts get-caller-identity`)
- A **Cloudflare account** with a domain and an API token with DNS edit permissions

---

## 1. Create Your Project

### Option A: Clone and rename (recommended)

```bash
git clone https://github.com/Black0wI/fullstack-serverless-ssr.git my-project
cd my-project
rm -rf .git
git init
git add -A && git commit -m "feat: initial project from Next.js SST Boilerplate"
```

### Option B: GitHub "Use this template"

Click **"Use this template"** on the [GitHub repository](https://github.com/Black0wI/fullstack-serverless-ssr) to create a new repo under your account.

---

## 2. Configure Your Project

### Step 1: Install dependencies

```bash
make setup
# This runs npm install, copies .env.example → .env, and .env.local.example → .env.local
```

### Step 2: Rename the project

Update these files with your project name:

| File                        | What to Change                                                                    |
| --------------------------- | --------------------------------------------------------------------------------- |
| `sst.config.ts`             | Change `APP_NAME` from `"replace-me"` to your project name (e.g. `"my-saas-app"`) |
| `package.json`              | Update `name`, `description`, `author`                                            |
| `src/app/layout.tsx`        | Update metadata `title`, `description`                                            |
| `src/components/Header.tsx` | Update the logo text                                                              |
| `src/components/Footer.tsx` | Update company name and email                                                     |
| `public/manifest.json`      | Update `name`, `short_name`, `description`                                        |
| `public/offline.html`       | Update title and heading                                                          |
| `src/lib/seo.ts`            | Update `SITE_NAME`                                                                |

### Step 3: Configure environment variables

Edit `.env` with your values:

```bash
# Required for deployment
DOMAIN_NAME=myapp.example.com
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_DEFAULT_ACCOUNT_ID=your-account-id

# Your public URL (used for SEO, sitemap, OG images)
NEXT_PUBLIC_SITE_URL=https://myapp.example.com
```

### Step 4: Set up Git hooks

```bash
npx husky install
```

This enables:

- **Pre-commit**: lint-staged (auto-formats and lints staged files)
- **Commit-msg**: commitlint (enforces [conventional commits](https://www.conventionalcommits.org/))

### Step 5 (optional): Configure authentication

If you need auth, uncomment and fill in `.env`:

```bash
AUTH_SECRET=your-secret          # Generate with: npx auth secret
AUTH_GOOGLE_ID=your-google-id    # From Google Cloud Console
AUTH_GOOGLE_SECRET=your-secret   # From Google Cloud Console
```

The boilerplate includes a NextAuth v5 stub with Google OAuth. The Credentials provider is a placeholder — replace the `authorize` function in `src/lib/auth.ts` with your own logic.

---

## 3. Local Development

```bash
make dev
# → http://localhost:4040
```

This starts the Next.js dev server with **Turbopack** (fast refresh, fast builds).

### Available routes

| Route         | Description                        |
| ------------- | ---------------------------------- |
| `/`           | Landing page                       |
| `/docs`       | Documentation (renders README.md)  |
| `/examples`   | Server Actions + `use cache` demos |
| `/api/health` | Health check endpoint              |

### Quality checks

```bash
make lint          # ESLint
make type-check    # TypeScript strict mode
make format        # Prettier formatting
npm test           # Vitest unit tests
npm run check      # All of the above + build + E2E
```

---

## 4. Project Structure

```
my-project/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout (metadata, fonts, analytics)
│   │   ├── page.tsx          # Homepage
│   │   ├── globals.css       # Design system (tokens, components, animations)
│   │   ├── error.tsx         # Error boundary
│   │   ├── not-found.tsx     # 404 page
│   │   ├── loading.tsx       # Loading state
│   │   ├── docs/             # /docs page
│   │   ├── examples/         # /examples page (Server Actions, use cache)
│   │   └── api/
│   │       └── health/       # GET /api/health
│   ├── components/           # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ServiceWorkerRegistration.tsx
│   ├── lib/                  # Shared utilities
│   │   ├── env.ts            # Typed environment variables (Zod)
│   │   ├── auth.ts           # NextAuth v5 configuration
│   │   ├── seo.ts            # createMetadata() helper
│   │   └── logger.ts         # Structured logger
│   ├── i18n/                 # Internationalization (next-intl)
│   ├── proxy.ts              # Network boundary (rate limiting, auth guard)
│   └── __tests__/            # Unit tests (mirrors src/ structure)
├── public/                   # Static assets
├── e2e/                      # Playwright E2E tests
├── docs/                     # Specs and ADRs
├── sst.config.ts             # AWS infrastructure (SST v4)
├── next.config.ts            # Next.js configuration
├── Makefile                  # Dev automation commands
└── CHANGELOG.md              # Version history
```

### Key files to know

| File                  | Purpose                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------- |
| `src/lib/env.ts`      | **Start here** — defines all env vars with Zod validation. Add new env vars here first. |
| `src/app/globals.css` | Design system: colors, typography, spacing, components, animations                      |
| `sst.config.ts`       | Infrastructure as code — CloudFront, Lambda, S3, DNS                                    |
| `src/proxy.ts`        | Network boundary — add rate limiting rules, auth guards                                 |
| `next.config.ts`      | Next.js config — security headers, bundle analyzer, i18n                                |

---

## 5. Building Features

### Adding a new page

```bash
# Create the route
mkdir -p src/app/dashboard
```

```tsx
// src/app/dashboard/page.tsx
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Dashboard",
  description: "Your project dashboard",
  path: "/dashboard",
});

export default function DashboardPage() {
  return (
    <main className="container">
      <h1>Dashboard</h1>
    </main>
  );
}
```

### Adding a Server Action

```tsx
// src/app/dashboard/actions.ts
"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
});

export async function createItem(formData: FormData) {
  const parsed = schema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  // ... process data
  return { success: true };
}
```

### Adding an API route

```ts
// src/app/api/items/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ items: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ created: body }, { status: 201 });
}
```

### Adding a new environment variable

1. Add the variable to `src/lib/env.ts` (server or client schema)
2. Add it to `.env.example` and `.env.local.example`
3. Add it to `sst.config.ts` environment section (if needed at runtime)
4. Update AI context files if it's a core variable

### Using the design system

The design system is defined in `src/app/globals.css`. Use CSS custom properties:

```css
/* Use existing tokens */
.my-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  backdrop-filter: blur(var(--glass-blur));
}
```

Available component classes: `.glass`, `.btn`, `.btn--primary`, `.btn--outline`, `.badge`, `.container`.

### Using `use cache`

```tsx
// Any Server Component
async function ExpensiveData() {
  "use cache";
  const data = await fetchExpensiveData();
  return <div>{data}</div>;
}
```

---

## 6. Testing

### Unit tests (Vitest)

```bash
npm test                 # Run once
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

Tests live in `src/__tests__/` and mirror the source structure:

```
src/__tests__/
├── components/
│   ├── Header.test.tsx
│   └── Footer.test.tsx
├── api/
│   └── health.test.ts
└── lib/
    └── seo.test.ts
```

### E2E tests (Playwright)

```bash
npm run test:e2e         # Run E2E tests
npx playwright test --ui # Visual test runner
```

Tests live in `e2e/` and test full user flows.

### Full quality gate

```bash
npm run check
# Runs: lint → type-check → test → build → e2e
```

Run this before every deploy to catch issues early.

---

## 7. Deploy to AWS

### First deploy

```bash
# 1. Verify AWS access
aws sts get-caller-identity

# 2. Ensure sst.config.ts has your APP_NAME and .env has DOMAIN_NAME

# 3. Deploy
make deploy
```

SST will:

1. Build the Next.js app via **OpenNext**
2. Upload static assets to **S3**
3. Create **Lambda functions** for SSR and API routes
4. Configure **CloudFront** distribution
5. Create **Cloudflare DNS** records

### Multi-stage deploys

```bash
make deploy              # → production (protected, retained)
make deploy-staging      # → staging (removable)
```

### Preview infrastructure changes

```bash
make sst-diff            # Show what would change
```

### Live Lambda development

```bash
make sst-dev             # Connects to real AWS resources with hot-reload
```

### Remove infrastructure

```bash
make sst-remove-staging  # Remove staging stack
# Production requires --force (protected by default)
```

---

## 8. Maintenance & Releases

### Versioning

This project follows [SemVer](https://semver.org/):

| Change Type             | Bump          | Example           |
| ----------------------- | ------------- | ----------------- |
| Bug fix, typo, refactor | PATCH `0.0.x` | `1.0.0` → `1.0.1` |
| New feature, page, dep  | MINOR `0.x.0` | `1.0.0` → `1.1.0` |
| Breaking change         | MAJOR `x.0.0` | `1.0.0` → `2.0.0` |

### Commit conventions

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint):

```
feat: add user dashboard
fix: resolve auth redirect loop
docs: update deployment guide
chore: bump dependencies
chore(release): v1.2.0
```

### Creating a release

1. Update `CHANGELOG.md` — rename `[Unreleased]` to `[X.Y.Z] — YYYY-MM-DD`
2. Update `version` in `package.json`
3. Run `make release VERSION=X.Y.Z`

Or use the AI workflow: `/release`

### Dependency updates

[Renovate](https://docs.renovatebot.com/) is pre-configured for automated dependency updates. It groups related packages and creates PRs automatically.

---

## 9. Common Recipes

### Add a database

```bash
npm install @prisma/client prisma
npx prisma init
```

Add `DATABASE_URL` to `src/lib/env.ts`, `.env.example`, and `sst.config.ts` environment.

### Add a new auth provider (GitHub, Discord, etc.)

Edit `src/lib/auth.ts`:

```ts
import GitHub from "next-auth/providers/github";

if (env.isGitHubAuthConfigured) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  );
}
```

### Protect a route

Uncomment the auth guard in `src/proxy.ts`:

```ts
const session = await auth();
if (!session) {
  return NextResponse.redirect(new URL("/api/auth/signin", request.url));
}
```

### Add a cron job / scheduled task

Use SST's `Cron` construct in `sst.config.ts`:

```ts
new sst.aws.Cron("DailyCleanup", {
  schedule: "rate(1 day)",
  function: "src/jobs/cleanup.handler",
});
```

### Switch AWS region

Update both `sst.config.ts` and `Makefile`:

```ts
// sst.config.ts
providers: {
  aws: {
    region: "us-east-1";
  }
}
```

```makefile
# Makefile
AWS_REGION ?= us-east-1
```

### Disable PWA

Set in `.env`:

```
NEXT_PUBLIC_ENABLE_PWA=false
```

### Add Cloudflare Web Analytics

1. Get your token from the [Cloudflare dashboard](https://dash.cloudflare.com/)
2. Set `NEXT_PUBLIC_CF_ANALYTICS_TOKEN=your-token` in `.env`

---

## Need Help?

- **Architecture Decision Records**: [`docs/architecture/decisions/`](docs/architecture/decisions/)
- **Functional Specifications**: [`docs/specs/`](docs/specs/)
- **Health Check**: Visit `/api/health` for runtime diagnostics
- **AI Assistance**: Open the project in an AI-assisted editor — it will automatically read the context file for your tool
