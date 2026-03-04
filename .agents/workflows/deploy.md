---
description: Déployer l'application en production
---

# Deploy Production

Déploie le build statique sur S3 + CloudFront avec invalidation du cache.

## Prérequis

- AWS CLI configuré (`aws sts get-caller-identity` doit fonctionner)
- Terraform initialisé (`cd infra && terraform init`)
- Variables Terraform configurées (`infra/terraform.tfvars`)

## Étapes

1. Builder l'application :

```bash
npm run build
```

2. Vérifier le build :

```bash
ls out/index.html
```

// turbo 3. Appliquer l'infrastructure Terraform :

```bash
cd infra && terraform apply
```

4. Récupérer les outputs :

```bash
cd infra && terraform output
```

// turbo 5. Sync sur S3 (assets immutables) :

```bash
BUCKET=$(cd infra && terraform output -raw s3_bucket_name) && aws s3 sync out/ s3://$BUCKET --delete --cache-control "public, max-age=31536000, immutable" --exclude "*.html" --exclude "*.json"
```

// turbo 6. Sync sur S3 (HTML, must-revalidate) :

```bash
BUCKET=$(cd infra && terraform output -raw s3_bucket_name) && aws s3 sync out/ s3://$BUCKET --delete --cache-control "public, max-age=0, must-revalidate" --include "*.html" --include "*.json" --exclude "_next/*"
```

// turbo 7. Invalider le cache CloudFront :

```bash
DIST_ID=$(cd infra && terraform output -raw cloudfront_distribution_id) && aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

8. Vérifier le déploiement :

```bash
URL=$(cd infra && terraform output -raw cloudfront_url) && echo "✅ Déployé sur $URL"
```

## Raccourci

Tout-en-un via le Makefile :

```bash
make deploy
```
