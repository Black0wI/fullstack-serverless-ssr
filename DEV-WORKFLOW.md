# DEV_WORKFLOW.md — Guide de développement & Infrastructure

> Guide complet pour l'onboarding des développeurs sur le projet **Tech Portal**.
> Dernière mise à jour : Mars 2026.

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture infrastructure](#2-architecture-infrastructure)
3. [Prérequis](#3-prérequis)
4. [Installation locale](#4-installation-locale)
5. [Cycle de développement](#5-cycle-de-développement)
6. [Structure du projet](#6-structure-du-projet)
7. [Design system & conventions CSS](#7-design-system--conventions-css)
8. [Infrastructure as Code (Terraform)](#8-infrastructure-as-code-terraform)
9. [CI/CD Pipeline](#9-cicd-pipeline)
10. [Sécurité & RGPD](#10-sécurité--rgpd)
11. [Outils tiers (Python)](#11-outils-tiers-python)
12. [Spécifications fonctionnelles](#12-spécifications-fonctionnelles)
13. [Architecture Decision Records (ADR)](#13-architecture-decision-records-adr)
14. [Intégration IA](#14-intégration-ia)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Vue d'ensemble

Tech Portal est une application **Next.js 15** (App Router, TypeScript) exportée en site statique et distribuée mondialement via **AWS CloudFront**. L'infrastructure est gérée en **Terraform**, le CI/CD par **GitHub Actions**.

**Principe clé** : le site est un export statique (`output: 'export'`). Il n'y a **aucun serveur**, aucune API route, aucun SSR. Le contenu est servi directement depuis un CDN.

### Pourquoi ce choix ?

| Critère        | Bénéfice                                        |
| -------------- | ----------------------------------------------- |
| Performance    | 0 cold start, fichiers servis depuis des edge locations mondiales |
| Coût           | ~1-3 $/mois (S3 + CloudFront) vs 20+ $/mois sur Vercel |
| Sécurité       | Bucket S3 privé, accès OAC uniquement, CSP stricte |
| RGPD           | Données hébergées en `eu-west-3` (Paris, France) |
| Contrôle       | Infrastructure versionnée (Terraform), pas de vendor lock-in |

---

## 2. Architecture infrastructure

```
                        ┌─────────────────────────────┐
                        │       GitHub Repository      │
                        │    (main branch = prod)       │
                        └──────────┬──────────────────┘
                                   │ push to main
                        ┌──────────▼──────────────────┐
                        │     GitHub Actions CI/CD     │
                        │                              │
                        │  ┌─────────────────────────┐ │
                        │  │ 1. npm ci + build        │ │
                        │  │ 2. terraform apply       │ │
                        │  │ 3. aws s3 sync           │ │
                        │  │ 4. cloudfront invalidate │ │
                        │  └─────────────────────────┘ │
                        └──────────┬──────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
    ┌─────────▼─────────┐ ┌───────▼────────┐  ┌────────▼────────┐
    │   S3 Bucket        │ │  CloudFront    │  │  CloudFront     │
    │   (eu-west-3)      │ │  Distribution  │  │  Functions      │
    │                    │ │                │  │                 │
    │  ● Privé (OAC)    │ │  ● HTTPS forcé │  │  ● url-rewrite  │
    │  ● Versionné      │ │  ● Compression │  │  ● security-    │
    │  ● Chiffré AES256 │ │  ● Cache smart │  │    headers      │
    └────────────────────┘ └───────┬────────┘  └─────────────────┘
                                   │
                          ┌────────▼────────┐
                          │   Utilisateurs   │
                          │  (Edge mondial)  │
                          └─────────────────┘
```

### Composants AWS

| Service | Rôle | Région |
|---------|------|--------|
| **S3** | Stockage des fichiers statiques | `eu-west-3` (Paris) |
| **CloudFront** | CDN mondial, cache edge | Global (config `eu-west-3`) |
| **CloudFront Functions** | URL rewriting + Headers sécurité | Edge locations |
| **ACM** | Certificat SSL (custom domain) | `us-east-1` ⚠️ requis par CloudFront |
| **OAC** | Contrôle d'accès S3 → CloudFront | `eu-west-3` |

> ⚠️ **Pourquoi `us-east-1` pour ACM ?** C'est une contrainte imposée par AWS : les certificats SSL associés à CloudFront doivent être créés en `us-east-1`, même si le bucket S3 est en `eu-west-3`. Cela ne compromet pas la conformité RGPD car seul le certificat (métadonnée) est stocké là, pas les données utilisateurs.

### Flux d'une requête utilisateur

```
Utilisateur → CloudFront Edge → [url-rewrite.js] → S3 (eu-west-3) → Réponse
                                                                         ↓
                                                              [security-headers.js]
                                                                         ↓
                                                              Réponse + CSP + HSTS
```

1. L'utilisateur accède à `https://portal.example.com/about`
2. CloudFront intercepte la requête à l'edge location la plus proche
3. La **CloudFront Function `url-rewrite`** transforme `/about` → `/about/index.html`
4. CloudFront sert le fichier depuis le cache ou le récupère sur S3
5. La **CloudFront Function `security-headers`** ajoute les en-têtes de sécurité (CSP, HSTS, X-Frame-Options)
6. La réponse est envoyée à l'utilisateur

---

## 3. Prérequis

### Obligatoire

| Outil | Version | Installation |
|-------|---------|-------------|
| Node.js | ≥ 22 | `brew install node` ou [nvm](https://github.com/nvm-sh/nvm) |
| npm | ≥ 10 | Inclus avec Node.js |
| Git | ≥ 2.30 | `brew install git` |

### Pour l'infrastructure (optionnel en local)

| Outil | Version | Installation |
|-------|---------|-------------|
| Terraform | ≥ 1.5 | `brew install terraform` |
| AWS CLI | ≥ 2 | `brew install awscli` |

### Pour les outils Python (optionnel)

| Outil | Version | Installation |
|-------|---------|-------------|
| Python | ≥ 3.11 | `brew install python@3.11` |

---

## 4. Installation locale

```bash
# 1. Cloner le repository
git clone https://github.com/itakademy/tech-portal.git
cd tech-portal

# 2. Setup complet (installe les deps + copie .env)
make setup

# 3. Lancer le serveur de dev
make dev
# → http://localhost:4000
```

### Commandes disponibles

```bash
make help           # Affiche toutes les commandes
make dev            # Serveur de dev (Turbopack, port 4000)
make build          # Build statique → out/
make check          # Lint + type-check + format + build
make push           # Push ai-agent + auto-PR vers main
make force-deploy   # ⚠️ URGENCE: push direct sur main (bypass PR)
make deploy         # Build + Terraform + S3 sync + CloudFront invalidation
make clean          # Nettoyer les artefacts de build
```

---

## 5. Cycle de développement

### Stratégie de branches

```
  main (production, protégée)
    │
    ├── ai-agent          ← Branche de travail IA (auto-PR vers main)
    │
    ├── feature/*         ← Nouvelles fonctionnalités (PR vers main)
    │
    ├── hotfix/*          ← Corrections urgentes (PR vers main)
    │
    └── refactor/*        ← Refontes techniques (PR vers main)
```

| Branche | Rôle | Déclencheur de déploiement |
|---------|------|----------------------------|
| `main` | **Production** — branche protégée, requiert une PR approuvée | Push → deploy automatique |
| `ai-agent` | **Branche IA** — travail de l'agent Claude | Push → auto-PR vers `main` |
| `feature/*` | Nouvelles features (développeurs humains) | PR manuelle vers `main` |
| `hotfix/*` | Fix critique en urgence | PR manuelle vers `main` |
| `refactor/*` | Refactoring technique | PR manuelle vers `main` |

### Workflow IA (branche `ai-agent`)

> **Principe fondamental** : tout code produit par l'IA doit être reviewé par un humain avant d'atteindre la production.

```
   Agent IA (Claude)
      │
      │  make push
      │  (lint + type-check + push)
      ▼
   ai-agent branch
      │
      │  auto-pr.yml (automatique)
      ▼
   Pull Request → main
      │
      ├── CI (automatique)
      │   ├── Lint + Type-check + Format
      │   ├── Build statique
      │   ├── Playwright E2E
      │   ├── Lighthouse CI (score ≥ 90)
      │   └── SBOM
      │
      ├── Preview (automatique)
      │   └── Terraform Plan (commentaire PR)
      │
      ├── 👤 REVIEW HUMAINE OBLIGATOIRE
      │   └── Le développeur approuve ou demande des changements
      │
      ▼
   Merge dans main (par un humain)
      │
      └── Deploy (automatique)
          ├── Build + Terraform Apply
          ├── S3 Sync (cache intelligent)
          └── CloudFront Invalidation
```

### Workflow développeur humain

#### 1. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-feature
```

#### 2. Développer

```bash
make dev  # Serveur avec hot-reload sur http://localhost:4000
```

- Le hot-reload Turbopack rafraîchit le navigateur instantanément
- Les pre-commit hooks (Husky) formatent et lint chaque commit

#### 3. Committer

```bash
git add -A
git commit -m "feat: description de la feature"
```

Le hook `pre-commit` exécute automatiquement ESLint + Prettier.

#### 4. Pousser et créer une PR

```bash
git push origin feature/ma-nouvelle-feature
# Ouvrir une PR vers main sur GitHub
```

#### 5. Review + Merge → Déploiement auto

Après review et merge dans `main`, le déploiement est automatique.

### Commandes Git du Makefile

#### `make push` — Push IA sécurisé

```bash
make push
```

1. Vérifie que vous êtes sur `ai-agent` (propose de basculer sinon)
2. Exécute lint + type-check en pré-vérification
3. Push sur `ai-agent`
4. Le workflow `auto-pr.yml` crée/met à jour une PR vers `main`
5. La CI s'exécute sur la PR
6. Un humain doit approuver avant le merge

#### `make force-deploy` — Déploiement d'urgence ⚠️

```bash
make force-deploy
```

1. Affiche un avertissement visuel
2. Demande une confirmation explicite (`y`)
3. Exécute lint + type-check + build complet
4. Merge la branche courante dans `main` et push
5. Le déploiement CI/CD se lance automatiquement

> ⚠️ **À utiliser UNIQUEMENT en cas d'urgence** (site down, faille de sécurité). Toute utilisation doit être documentée.

### Protection de la branche `main`

Pour activer la protection (recommandé) :

1. Aller dans **Settings → Branches → Branch protection rules**
2. Ajouter une règle pour `main` :
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1 minimum)
   - ✅ Require status checks to pass (sélectionner `Quality Checks`, `E2E Tests`, `Lighthouse CI`)
   - ✅ Require branches to be up to date
   - ✅ Do not allow bypassing the above settings

### Conventions de commit

Format : `type: description courte`

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Formatage (pas de changement de logique) |
| `refactor` | Restructuration du code |
| `perf` | Amélioration de performance |
| `test` | Ajout ou modification de tests |
| `chore` | Maintenance (deps, config) |
| `infra` | Changement d'infrastructure (Terraform) |

---

## 6. Structure du projet

```
tech-portal/
│
├── src/                          # ── CODE SOURCE ──
│   ├── app/                      # Pages (App Router)
│   │   ├── layout.tsx            # Layout racine (metadata, fonts)
│   │   ├── page.tsx              # Page d'accueil
│   │   └── globals.css           # Design system complet
│   └── components/               # Composants réutilisables
│       ├── Header.tsx
│       └── Footer.tsx
│
├── public/                       # ── ASSETS STATIQUES ──
│   └── favicon.svg
│
├── e2e/                          # ── TESTS E2E ──
│   └── landing.spec.ts           # Tests Playwright
│
├── infra/                        # ── INFRASTRUCTURE ──
│   ├── main.tf                   # Ressources AWS
│   ├── variables.tf              # Variables configurables
│   ├── outputs.tf                # Sorties (URL, IDs)
│   ├── backend.tf                # State remote (commenté)
│   └── cloudfront-functions/     # Code edge
│       ├── url-rewrite.js
│       └── security-headers.js
│
├── .github/                      # ── CI/CD ──
│   ├── workflows/
│   │   ├── ci.yml                # Qualité + E2E + Lighthouse
│   │   ├── deploy.yml            # Déploiement production
│   │   └── preview.yml           # Terraform plan sur PR
│   ├── dependabot.yml            # Mises à jour auto
│   └── copilot-instructions.md   # Contexte GitHub Copilot
│
├── docs/                         # ── DOCUMENTATION ──
│   ├── specs/                    # Spécifications fonctionnelles
│   │   └── _TEMPLATE.md
│   └── architecture/decisions/   # ADR (Architecture Decision Records)
│       └── 0001-static-export-cloudfront.md
│
├── tools/                        # ── OUTILS TIERS ──
│   ├── _template/tool.py         # Template Python
│   └── requirements.txt
│
├── .agents/workflows/            # ── WORKFLOWS IA ──
│   ├── deploy.md
│   └── dev.md
│
├── CLAUDE.md                     # Contexte pour Claude Code
├── .claude/settings.json         # Permissions Claude
├── .cursorrules                  # Contexte pour Cursor AI
├── DEV_WORKFLOW.md               # CE FICHIER
├── Makefile                      # Automatisation
├── package.json                  # Deps + scripts + lint-staged
├── next.config.ts                # Config Next.js (static export)
├── tsconfig.json                 # TypeScript strict
├── playwright.config.ts          # Config E2E
├── .lighthouserc.json            # Budget de performance
├── .prettierrc                   # Formatage
├── eslint.config.mjs             # Linting
├── .env.example                  # Variables d'env template
├── .gitignore
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
└── README.md
```

### Où ajouter du code ?

| Tu veux... | Fichier / dossier |
|------------|-------------------|
| Ajouter une page | `src/app/ma-page/page.tsx` |
| Créer un composant | `src/components/MonComposant.tsx` |
| Modifier les styles | `src/app/globals.css` (tokens) ou CSS module |
| Ajouter un test E2E | `e2e/mon-test.spec.ts` |
| Modifier l'infra AWS | `infra/main.tf` |
| Rédiger une spec | `docs/specs/SPEC-XXX-titre.md` |
| Créer un outil Python | `tools/mon-outil/tool.py` |
| Documenter une décision | `docs/architecture/decisions/XXXX-titre.md` |

---

## 7. Design system & conventions CSS

### Philosophie

- **Pas de Tailwind** — on utilise des custom properties CSS (`var(--token)`)
- **Un seul fichier** de design system : `src/app/globals.css`
- **Nommage BEM** : `.block__element--modifier`

### Tokens disponibles

```css
/* Couleurs */
var(--color-bg-primary)       /* Fond principal (#0a0a0f) */
var(--color-accent)           /* Accent indigo (#6366f1) */
var(--color-text-primary)     /* Texte principal (#f0f0f5) */
var(--color-text-secondary)   /* Texte secondaire (#a0a0b4) */

/* Espacement (base 4px) */
var(--space-1) → var(--space-32)   /* 0.25rem → 8rem */

/* Typographie */
var(--font-sans)      /* Inter */
var(--font-display)   /* Outfit (titres) */
var(--font-mono)      /* JetBrains Mono (code) */
var(--text-sm) → var(--text-7xl)

/* Effets */
var(--radius-sm) → var(--radius-full)
var(--shadow-sm) → var(--shadow-xl)
var(--shadow-glow)    /* Halo indigo */
```

### Composants CSS prêts à l'emploi

```html
<!-- Glassmorphism -->
<div class="glass">Contenu avec fond flou</div>

<!-- Boutons -->
<button class="btn btn--primary btn--lg">Action</button>
<button class="btn btn--ghost">Secondaire</button>

<!-- Badge -->
<span class="badge"><span class="badge__dot"></span> Label</span>

<!-- Animations -->
<div class="animate-fade-in-up animate-delay-2">Contenu animé</div>
```

### Conventions TypeScript / React

| Règle | Exemple |
|-------|---------|
| Exports nommés (pas de `default`) | `export function Header() {}` |
| Props typées | `interface HeaderProps { title: string }` |
| Path aliases | `import { Header } from "@/components/Header"` |
| Server Components par défaut | Ajouter `"use client"` uniquement si nécessaire |
| `const` > `let`, jamais `var` | `const items = []` |
| TypeScript strict, pas de `any` | Utiliser `unknown` si nécessaire |

---

## 8. Infrastructure as Code (Terraform)

### Fichiers

| Fichier | Contenu |
|---------|---------|
| `main.tf` | Toutes les ressources AWS (S3, CloudFront, OAC, Functions) |
| `variables.tf` | Inputs configurables avec valeurs par défaut |
| `outputs.tf` | Valeurs de sortie (URL CloudFront, nom du bucket) |
| `backend.tf` | State remote S3 (commenté, à activer manuellement) |

### Premier déploiement

```bash
# 1. Configurer les variables
cp infra/terraform.tfvars.example infra/terraform.tfvars
# Éditer terraform.tfvars avec tes valeurs

# 2. Initialiser Terraform
cd infra && terraform init

# 3. Prévisualiser
terraform plan

# 4. Appliquer
terraform apply
```

### Ajouter un domaine custom

1. Créer un certificat ACM dans `us-east-1` (console AWS ou CLI)
2. Renseigner dans `terraform.tfvars` :
   ```hcl
   domain_name         = "portal.example.com"
   acm_certificate_arn = "arn:aws:acm:us-east-1:ACCOUNT:certificate/ID"
   ```
3. `terraform apply`
4. Créer un CNAME DNS pointant vers le domaine CloudFront

### State Terraform

Par défaut, le state est **local** (fichier `terraform.tfstate`). Pour le travail en équipe, activer le backend S3 :

1. Créer le bucket S3 + table DynamoDB pour le locking
2. Décommenter le bloc dans `infra/backend.tf`
3. `terraform init -migrate-state`

---

## 9. CI/CD Pipeline

### Vue d'ensemble

```
            Push to main                    Pull Request
                │                                │
        ┌───────▼───────┐              ┌─────────▼─────────┐
        │   deploy.yml   │              │     ci.yml         │
        │                │              │                    │
        │  Build         │              │  quality ──┐       │
        │  Terraform     │              │  (lint,    ├─▶ e2e │
        │  S3 Sync       │              │   types,   │       │
        │  CF Invalidate │              │   build,   ├─▶ lh  │
        │  Cloudflare DNS│              │   SBOM)    │       │
        └────────────────┘              └────────────┘       │
                                                             │
                                        ┌────────────────────┘
                                        │   preview.yml
                                        │   (Terraform Plan
                                        │    en commentaire PR)
                                        └────────────────────
```

### Secrets et variables GitHub nécessaires

| Type | Nom | Description |
|------|-----|-------------|
| **Secret** | `AWS_ROLE_ARN` | ARN du rôle IAM pour l'authentification OIDC |
| **Secret** | `CLOUDFLARE_API_TOKEN` | Token API Cloudflare (scope DNS Edit) |
| **Secret** | `CLOUDFLARE_ZONE_ID` | ID de la zone Cloudflare |
| **Variable** | `CLOUDFLARE_RECORD_NAME` | Nom du CNAME (ex: `portal.example.com`) |

> **Note** : l'étape Cloudflare est **conditionnelle** — elle ne s'exécute que si `CLOUDFLARE_API_TOKEN` est configuré. Sans ce secret, le déploiement fonctionne normalement sans mise à jour DNS.

#### Créer le token Cloudflare

1. [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) → **Create Token**
2. Template : **Edit zone DNS**
3. Permissions : `Zone > DNS > Edit`
4. Zone Resources : sélectionner la zone cible
5. Copier le token dans les secrets GitHub

### Cache intelligent (S3 Sync)

Le déploiement utilise deux passes de synchronisation :

| Type de fichier | Cache-Control | Raison |
|-----------------|---------------|--------|
| `_next/static/*`, CSS, JS, images | `max-age=31536000, immutable` | Contenu hashé, ne change jamais |
| `*.html`, `*.json` | `max-age=0, must-revalidate` | Contenu dynamique, toujours frais |

---

## 10. Sécurité & RGPD

### RGPD

- **Région AWS** : `eu-west-3` (Paris, France) — toutes les données restent en Europe
- **Aucun cookie** déposé par défaut
- **Aucune donnée personnelle** collectée (site statique)
- Le certificat ACM en `us-east-1` est une métadonnée technique, pas une donnée utilisateur

### Headers de sécurité

Appliqués automatiquement par la CloudFront Function `security-headers.js` :

| Header | Valeur | Protection |
|--------|--------|------------|
| `Content-Security-Policy` | Restrictive (self + fonts Google) | XSS, injection |
| `Strict-Transport-Security` | 2 ans, includeSubDomains, preload | Downgrade HTTPS |
| `X-Frame-Options` | DENY | Clickjacking |
| `X-Content-Type-Options` | nosniff | MIME sniffing |
| `Permissions-Policy` | Caméra, micro, géoloc désactivés | Accès API sensibles |
| `Referrer-Policy` | strict-origin-when-cross-origin | Fuite d'URL |

### Bonnes pratiques

- **Jamais de secrets dans le code** — utiliser `.env` (git-ignoré) ou GitHub Secrets
- **OIDC** pour l'auth AWS CI/CD — pas de clés longue durée
- **Dependabot** surveille les vulnérabilités des dépendances automatiquement
- **SBOM** généré à chaque build CI pour audit de la supply chain

---

## 11. Outils tiers (Python)

Pour créer un script Python (migration de données, seed, scraping, etc.) :

```bash
# Créer depuis le template
cp -r tools/_template tools/mon-outil

# Setup Python (première fois)
cd tools
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Utiliser
cd mon-outil
python tool.py --help
python tool.py run --input data.json --dry-run
```

Le template inclut : CLI argparse, logging formaté, mode dry-run, résolution du PROJECT_ROOT.

---

## 12. Spécifications fonctionnelles

Avant de développer une feature, rédiger une spec :

```bash
cp docs/specs/_TEMPLATE.md docs/specs/SPEC-001-ma-feature.md
```

La spec contient : contexte, user stories, design technique, UI/UX, plan d'implémentation, tests, risques.

---

## 13. Architecture Decision Records (ADR)

Pour documenter une décision architecturale importante :

```bash
# Créer un nouvel ADR
touch docs/architecture/decisions/XXXX-titre-court.md
```

Voir l'ADR existant : [`0001-static-export-cloudfront.md`](docs/architecture/decisions/0001-static-export-cloudfront.md)

---

## 14. Intégration IA

Le projet est configuré pour fonctionner avec les assistants IA de coding :

| Fichier | Assistant | Contenu |
|---------|-----------|---------|
| `CLAUDE.md` | Claude Code / Opus 4.6 | Contexte complet du projet |
| `.claude/settings.json` | Claude Code | Commandes autorisées/interdites |
| `.github/copilot-instructions.md` | GitHub Copilot | Conventions et contraintes |
| `.cursorrules` | Cursor AI | Règles de coding |
| `.agents/workflows/` | Antigravity | Workflows `/deploy` et `/dev` |

---

## 15. Troubleshooting

### Le build échoue

```bash
# Nettoyer le cache
make clean
npm install
make build
```

### Les types TS ne sont pas reconnus

```bash
# Régénérer les types Next.js
rm -f next-env.d.ts
npm run build
```

### Terraform refuse de s'initialiser

```bash
cd infra
rm -rf .terraform .terraform.lock.hcl
terraform init
```

### Le pre-commit hook bloque mon commit

```bash
# Voir les erreurs
npx lint-staged --verbose

# En dernier recours (à éviter)
git commit --no-verify -m "wip: bypass hooks"
```

### CloudFront sert du contenu périmé

```bash
# Forcer l'invalidation
DIST_ID=$(cd infra && terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

---

*Pour toute question, ouvrir une issue sur GitHub ou contacter l'équipe.*
