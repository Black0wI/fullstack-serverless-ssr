# ADR-0001 : Next.js SSR sur AWS via SST v3

**Statut** : Accepted
**Date** : 2026-03-03 (mis à jour 2026-03-04)
**Auteur** : @jbm

## Contexte

Le projet nécessite un hébergement web performant, sécurisé et globalement distribué, capable de supporter :

- Le **Server-Side Rendering** (SSR) pour le SEO et la performance perçue
- Un **middleware Next.js** pour le contrôle d'accès (authentification Google OAuth via Auth.js)
- L'**internationalisation** (next-intl) avec résolution serveur
- Des **API routes** internes (Auth.js callbacks, endpoints applicatifs)

Les options considérées étaient :

1. **Vercel** — Managed Next.js hosting
2. **AWS Amplify** — Managed static + SSR
3. **S3 + CloudFront** (static export, Terraform) — Self-managed CDN, statique uniquement
4. **SST v3 + Next.js SSR** (CloudFront + Lambda) — Full-stack serverless sur AWS

## Décision

Nous utilisons **SST v3** avec le composant `sst.aws.Nextjs` pour déployer une application **Next.js 16 full SSR** sur AWS (CloudFront + Lambda@Edge), avec **Cloudflare** pour la gestion DNS du domaine personnalisé.

## Justification

- **SSR nécessaire** : Le middleware Next.js (auth gating), les API routes (Auth.js / next-auth), et l'i18n serveur (next-intl) requièrent un environnement d'exécution côté serveur — incompatible avec un static export
- **Coût** : Architecture serverless (Lambda@Edge + CloudFront + S3) ≈ quelques dollars/mois, sans serveur persistant
- **IaC natif** : SST v3 gère l'infrastructure en TypeScript (Pulumi sous le capot), versionnée dans le repo (`sst.config.ts`)
- **DX** : `npx sst dev` pour le développement local avec hot-reload, `npx sst deploy` pour le déploiement — zéro configuration supplémentaire
- **Performance** : CloudFront CDN global + Lambda@Edge = latence minimale, cache des assets statiques
- **Indépendance** : Infrastructure AWS standard, pas de vendor lock-in propriétaire (Vercel, Amplify)

## Architecture déployée

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│  Cloudflare │────▶│  CloudFront │────▶│  Lambda@Edge     │
│  DNS (CNAME)│     │  CDN        │     │  (SSR + API)     │
└─────────────┘     └──────┬──────┘     └──────────────────┘
                           │
                    ┌──────▼──────┐
                    │  S3 Bucket  │
                    │  (assets)   │
                    └─────────────┘
```

**Stack technique :**

| Couche    | Technologie                                |
| --------- | ------------------------------------------ |
| Framework | Next.js 16 (React 19, Turbopack)           |
| Auth      | Auth.js v5 (next-auth, Google OAuth)       |
| i18n      | next-intl v4                               |
| IaC       | SST v3 (Pulumi)                            |
| CDN       | CloudFront                                 |
| Compute   | Lambda@Edge                                |
| Storage   | S3 (assets statiques)                      |
| DNS       | Cloudflare (`onboard-sales.it-akademy.fr`) |
| CI/CD     | GitHub Actions                             |
| Région    | eu-west-3 (Paris)                          |

## Conséquences

- ✅ SSR complet : middleware, API routes, i18n serveur fonctionnels
- ✅ Auth gating via middleware Next.js (Google OAuth)
- ✅ Infrastructure versionnée dans le repo (`sst.config.ts`)
- ✅ Déploiement automatisé via GitHub Actions (push sur `main`)
- ✅ Preview infra (SST diff) sur chaque Pull Request
- ✅ CloudFront CDN global pour les assets statiques
- ⚠️ Cold starts Lambda@Edge possibles (atténués par le cache CloudFront)
- ✅ Images optimisées automatiquement par Next.js (via Lambda)
- ✅ Custom domain : `onboard-sales.it-akademy.fr` via Cloudflare CNAME

## Alternatives rejetées

- **Static Export (S3 + CloudFront + Terraform)** : Incompatible avec les besoins SSR (middleware auth, API routes, i18n serveur). L'option initialement envisagée a été abandonnée lors de l'implémentation.
- **Vercel** : Trop cher à l'échelle, vendor lock-in
- **Amplify** : Moins de contrôle IaC, abstraction limitante
- **ECS / Fargate** : Surcoût opérationnel (serveur persistant) pour un trafic faible
