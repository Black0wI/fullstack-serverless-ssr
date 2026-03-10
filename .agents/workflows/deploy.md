---
description: Déployer l'application en production
---

# Deploy Production

Déploie l'application Next.js SSR sur AWS via SST (Lambda + CloudFront + S3).

## Prérequis

- AWS CLI configuré (`aws sts get-caller-identity` doit fonctionner)
- Variables d'environnement configurées (`.env` ou export shell) :
  - `DOMAIN_NAME` — le domaine cible
  - `CLOUDFLARE_API_TOKEN` — token API Cloudflare
  - `CLOUDFLARE_DEFAULT_ACCOUNT_ID` — ID du compte Cloudflare

## Étapes

// turbo 1. Installer les dépendances :

```bash
npm install
```

// turbo 2. Déployer avec SST :

```bash
npx sst deploy --stage production
```

3. Vérifier le déploiement :

```bash
echo "✅ Vérifier l'URL affichée dans les outputs SST"
```

## Raccourci

Tout-en-un via le Makefile :

```bash
make deploy
```

## Autres commandes utiles

```bash
make sst-diff     # Prévisualiser les changements infra
make sst-remove   # Supprimer l'infrastructure SST
make sst-dev      # Mode dev SST (live Lambda)
```
