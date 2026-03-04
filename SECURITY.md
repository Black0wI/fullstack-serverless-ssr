# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public GitHub issue.**

Instead, send details to: **security@orizon.sx**

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix & Disclosure**: Coordinated with reporter

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest  | ✅        |

## Security Best Practices

- Never commit secrets or credentials
- Use `.env` for local secrets (git-ignored)
- Use GitHub Secrets for CI/CD credentials
- AWS credentials use OIDC (no long-lived keys)
- S3 bucket is private (OAC-only access)
- CloudFront enforces HTTPS (TLSv1.2+)
