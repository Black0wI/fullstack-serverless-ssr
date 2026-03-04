# ADR-0001 : Static Export sur CloudFront

**Statut** : Accepted
**Date** : 2026-03-03
**Auteur** : @jbm

## Contexte

Le projet nécessite un hébergement web performant, économique et globalement distribué. Les options considérées étaient :

1. **Vercel** — Managed Next.js hosting
2. **AWS Amplify** — Managed static + SSR
3. **S3 + CloudFront** (static export) — Self-managed CDN
4. **ECS / Lambda** (SSR) — Server-side rendering

## Décision

Nous utilisons **Next.js static export (`output: 'export'`)** déployé sur **S3 + CloudFront** avec Terraform IaC.

## Justification

- **Coût** : S3 + CloudFront ≈ 1–3 $/mois vs Vercel Pro à 20 $/mois/membre
- **Contrôle** : Infrastructure-as-Code (Terraform) offre reproductibilité et audit
- **Performance** : Static files + CDN = temps de chargement minimal, 0 cold start
- **Indépendance** : Pas de vendor lock-in (Vercel, Amplify)
- **Sécurité** : OAC (Origin Access Control) — le bucket S3 est entièrement privé

## Conséquences

- ❌ Pas de SSR / API routes / ISR côté serveur
- ❌ Images non-optimisées (pas de Next.js Image Optimization)
- ❌ Middleware Next.js non supporté
- ✅ Zéro cold start, déploiement < 60s
- ✅ Infrastructure versionnée et auditée
- ✅ CloudFront Functions pour la logique edge (URL rewrite, headers)

## Alternatives rejetées

- **Vercel** : Trop cher à l'échelle, vendor lock-in
- **Amplify** : Moins de contrôle IaC, abstraction limitante
- **SSR (Lambda/ECS)** : Complexité inutile pour un site principalement statique
