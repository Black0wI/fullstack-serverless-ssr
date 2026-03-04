---
description: Pousser les changements et créer une PR pour review
---

# Push (ai-agent → auto-PR)

Pousse les changements sur la branche `ai-agent` et déclenche une PR automatique vers `main`.

## Prérequis

- Être sur la branche `ai-agent`
- Code committé

## Étapes

// turbo

1. Vérifier la branche courante :

```bash
git branch --show-current
```

// turbo 2. Lancer les vérifications de qualité :

```bash
npm run lint && npm run type-check
```

// turbo 3. Pousser sur ai-agent :

```bash
git push origin ai-agent
```

4. La PR est automatiquement créée/mise à jour vers `main` par le workflow `auto-pr.yml`.

## Raccourci

Tout-en-un via le Makefile :

```bash
make push
```

## Force Deploy (urgence uniquement)

En cas d'urgence absolue, pour bypasser la PR :

```bash
make force-deploy
```

⚠️ Ceci merge directement dans `main` et déclenche le déploiement. À documenter systématiquement.
