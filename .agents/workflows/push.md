---
description: Pousser les changements sur le dépôt
---

# Push

Pousse les changements sur le dépôt distant après vérification qualité.

## Prérequis

- Code committé
- Sur la branche de travail

## Étapes

// turbo 1. Lancer les vérifications de qualité :

```bash
npm run lint && npm run type-check
```

// turbo 2. Pousser les changements :

```bash
git push origin HEAD
```
