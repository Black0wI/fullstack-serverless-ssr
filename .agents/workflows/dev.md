---
description: Démarrer l'environnement de développement local
---

# Dev Local

Lance le serveur de développement Next.js avec Turbopack.

## Étapes

// turbo

1. Installer les dépendances (si nécessaire) :

```bash
npm install
```

// turbo 2. Lancer le serveur de développement :

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:4000`.

## Vérification qualité

// turbo 3. Lancer le lint :

```bash
npm run lint
```

// turbo 4. Vérifier les types :

```bash
npm run type-check
```

// turbo 5. Vérifier le formatage :

```bash
npm run format:check
```

## Build de test

// turbo-all 6. Tester le build statique :

```bash
npm run build && ls out/index.html && echo "✅ Build OK"
```
