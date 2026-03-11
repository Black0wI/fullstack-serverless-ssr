---
description: Deploy the application to production
---

# Deploy Production

Deploy the Next.js SSR application to AWS via SST (Lambda + CloudFront + S3).

## Prerequisites

- AWS CLI configured (`aws sts get-caller-identity` must work)
- Environment variables configured (`.env` or shell export):
  - `DOMAIN_NAME` — target domain
  - `CLOUDFLARE_API_TOKEN` — Cloudflare API token
  - `CLOUDFLARE_DEFAULT_ACCOUNT_ID` — Cloudflare account ID

## Steps

// turbo

1. Install dependencies:

```bash
npm install
```

// turbo 2. Deploy with SST:

```bash
npx sst deploy --stage production
```

3. Verify the deployment:

```bash
echo "✅ Check the URL shown in SST outputs"
```

## Shortcut

All-in-one via the Makefile:

```bash
make deploy
```

## Other Useful Commands

```bash
make sst-diff     # Preview infrastructure changes
make sst-remove   # Remove SST infrastructure
make sst-dev      # SST dev mode (live Lambda)
```
