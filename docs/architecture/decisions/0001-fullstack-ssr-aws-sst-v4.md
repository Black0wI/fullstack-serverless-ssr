# ADR-0001: Full-Stack SSR on AWS via SST v4 (OpenNext)

**Status**: Accepted
**Date**: 2026-03-11
**Author**: @jbm

## Context

The project requires a production-grade hosting platform for a Next.js 16 boilerplate that supports:

- **Server-Side Rendering** (SSR) for SEO and perceived performance
- **Server Actions** for form processing without API routes
- **`use cache`** for granular server-side caching
- **`proxy.ts`** (Next.js 16 network proxy) for rate limiting and auth gating
- **API routes** (health checks, NextAuth callbacks)
- **Internationalization** (next-intl) with server-side locale resolution

### Options Considered

| Option                       | SSR | Serverless | IaC     | Cost | Verdict                                     |
| ---------------------------- | --- | ---------- | ------- | ---- | ------------------------------------------- |
| **Vercel**                   | ✅  | ✅         | ❌      | $$$  | Vendor lock-in, expensive at scale          |
| **AWS Amplify**              | ✅  | ✅         | Partial | $$   | Limited IaC control                         |
| **S3 + CloudFront (static)** | ❌  | ✅         | ✅      | $    | No SSR — incompatible                       |
| **ECS / Fargate**            | ✅  | ❌         | ✅      | $$   | Persistent server, overkill for low traffic |
| **SST v4 + OpenNext**        | ✅  | ✅         | ✅      | $    | ✅ Selected                                 |

## Decision

Use **SST v4 Ion** with the `sst.aws.Nextjs` construct to deploy a **Next.js 16 full-stack SSR** application on AWS (CloudFront + Lambda + S3), with **Cloudflare DNS** auto-managed by SST.

Deploy directly via CLI (`npx sst deploy`) — no CI/CD pipeline required.

## Architecture

```
                         ┌──────────────────────────────────┐
                         │            CloudFront             │
┌─────────────┐          │  ┌────────────┐ ┌──────────────┐ │
│  Cloudflare │─── DNS ──▶  │  S3 Bucket │ │   Lambda     │ │
│  (managed   │          │  │  (static   │ │  (SSR + API  │ │
│   by SST)   │          │  │   assets)  │ │  + Actions)  │ │
└─────────────┘          │  └────────────┘ └──────────────┘ │
                         └──────────────────────────────────┘
```

### Tech Stack

| Layer     | Technology                                         |
| --------- | -------------------------------------------------- |
| Framework | Next.js 16 (App Router, React 19, Turbopack)       |
| Cache     | `cacheComponents` + `use cache` directive          |
| Auth      | Auth.js v5 (NextAuth) — Google OAuth + Credentials |
| i18n      | next-intl v4                                       |
| IaC       | SST v4 Ion (Pulumi under the hood)                 |
| CDN       | CloudFront                                         |
| Compute   | AWS Lambda (via OpenNext)                          |
| Storage   | S3 (static assets)                                 |
| DNS       | Cloudflare (auto-managed by SST)                   |
| Deploy    | CLI direct (`npx sst deploy --stage production`)   |
| Region    | eu-west-3 (Paris)                                  |

### Deploy Guards

SST config includes two runtime guards that prevent accidental deployments:

1. **Name guard** — throws if `APP_NAME` is still the default `"replace-me"`
2. **Domain guard** — throws if `DOMAIN_NAME` environment variable is not set

### Multi-Stage Support

| Stage        | Command                         | Removal Policy     | Protection   |
| ------------ | ------------------------------- | ------------------ | ------------ |
| `production` | `make deploy`                   | Retain             | ✅ Protected |
| `staging`    | `make deploy-staging`           | Remove on teardown | ❌           |
| Custom       | `npx sst deploy --stage <name>` | Remove on teardown | ❌           |

## Consequences

### Positive

- ✅ Full SSR: proxy, API routes, Server Actions, `use cache` all functional
- ✅ Serverless: ~$1–5/month for low-to-moderate traffic, no idle cost
- ✅ Infrastructure as code, versioned in repo (`sst.config.ts`)
- ✅ One-command deploy from any terminal — no CI/CD pipeline required
- ✅ CloudFront CDN serves static assets from the nearest edge location
- ✅ Multi-stage deploys (production, staging, custom)
- ✅ Custom domain with automatic Cloudflare DNS management
- ✅ Typed environment validation catches misconfig at build time

### Trade-offs

- ⚠️ Lambda cold starts possible (mitigated by CloudFront caching and keep-alive)
- ⚠️ In-memory rate limiting does not work across distributed Lambda instances (disabled in production by design; use Redis/DynamoDB for production rate limiting)
- ⚠️ OpenNext is a community adapter — monitor compatibility with Next.js releases

## Alternatives Rejected

- **Static Export (S3 + CloudFront + Terraform)** — Original approach. Abandoned because SSR features (proxy, Server Actions, API routes, i18n server) require a runtime.
- **Vercel** — Excellent DX but vendor lock-in and cost concerns at scale.
- **AWS Amplify** — Limited IaC flexibility compared to SST/Pulumi.
- **ECS / Fargate** — Persistent server overhead unnecessary for a boilerplate with low baseline traffic.
- **GitHub Actions CI/CD** — Removed in favor of direct CLI deployment for simplicity and speed.
