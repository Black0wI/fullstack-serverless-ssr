# Tech Portal — Static Edge Boilerplate

[![CI](https://github.com/itakademy/tech-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/itakademy/tech-portal/actions/workflows/ci.yml)
[![Deploy](https://github.com/itakademy/tech-portal/actions/workflows/deploy.yml/badge.svg)](https://github.com/itakademy/tech-portal/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 🚀 Production-ready Next.js 15 boilerplate deployed on AWS CloudFront via Terraform IaC, with GitHub Actions CI/CD and Claude AI integration.

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────┐
│  GitHub Push │────▶│  GitHub Actions   │────▶│  S3 Bucket  │
│  (main)      │     │  Build + Terraform│     │  (static)   │
└──────────────┘     └──────────────────┘     └──────┬──────┘
                                                      │ OAC
                                              ┌───────▼───────┐
                                              │  CloudFront    │
                                              │  + Functions   │
                                              │  (Edge CDN)    │
                                              └───────┬───────┘
                                                      │
                                              ┌───────▼───────┐
                                              │   End Users    │
                                              │  (Global Edge) │
                                              └───────────────┘
```

## Quick Start

```bash
# Clone and setup
git clone https://github.com/itakademy/tech-portal.git
cd tech-portal
make setup

# Start development
make dev
# → http://localhost:3000
```

## Stack

| Layer          | Technology                             |
| -------------- | -------------------------------------- |
| Framework      | Next.js 15 (App Router, static export) |
| Language       | TypeScript 5 (strict mode)             |
| Styling        | Vanilla CSS (custom properties)        |
| Hosting        | AWS CloudFront + S3 (OAC)              |
| IaC            | Terraform (AWS Provider ~> 5.0)        |
| CI/CD          | GitHub Actions                         |
| Edge Functions | CloudFront Functions (JS 2.0)          |
| AI             | Claude Opus 4.6 (CLAUDE.md)            |

## Commands

```bash
make dev          # Dev server (Turbopack)
make build        # Static export → out/
make check        # Lint + type-check + format + build
make deploy       # Full deploy (build → terraform → S3 → invalidate)
make help         # Show all commands
```

## Infrastructure Setup

### Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.5
- Node.js >= 22

### First Deployment

```bash
# 1. Configure variables
cp infra/terraform.tfvars.example infra/terraform.tfvars
# Edit terraform.tfvars with your values

# 2. Deploy
make deploy
```

### GitHub Actions Secrets

| Secret          | Description                                  |
| --------------- | -------------------------------------------- |
| `AWS_ROLE_ARN`  | IAM role ARN for OIDC authentication         |

### Custom Domain (Optional)

1. Create an ACM certificate in `us-east-1`
2. Set `domain_name` and `acm_certificate_arn` in `terraform.tfvars`
3. Create Route53 CNAME/A record pointing to CloudFront

## Claude AI Integration

This project includes full Claude Code / Opus 4.6 support:

- **`CLAUDE.md`** — Project context and conventions
- **`.claude/settings.json`** — Allowed/denied commands
- **`.cursorrules`** — Cursor AI compatibility

## License

MIT — [Jean-Baptiste MONIN](LICENSE)
