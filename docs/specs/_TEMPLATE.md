# [SPEC-XXX] Titre de la Spécification

> **Statut** : `draft` | `review` | `approved` | `in-progress` | `done`
> **Priorité** : `critical` | `high` | `medium` | `low`
> **Auteur** : @nom
> **Date** : YYYY-MM-DD
> **Itération** : Sprint X / Phase Y

---

## Contexte

Décrivez le contexte métier et technique qui motive cette spécification. Quel problème résout-on ? Pourquoi maintenant ?

## Objectifs

- [ ] Objectif 1
- [ ] Objectif 2
- [ ] Objectif 3

## Non-objectifs (hors périmètre)

- Ce qui ne sera **pas** traité dans cette itération
- Limitations acceptées volontairement

---

## User Stories

### US-1 : [Titre]

**En tant que** [rôle], **je veux** [action], **afin de** [bénéfice].

**Critères d'acceptation :**

- [ ] Critère 1
- [ ] Critère 2

### US-2 : [Titre]

**En tant que** [rôle], **je veux** [action], **afin de** [bénéfice].

**Critères d'acceptation :**

- [ ] Critère 1
- [ ] Critère 2

---

## Design Technique

### Architecture

Décrivez les composants impliqués et leurs interactions.

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│          │────▶│          │────▶│          │
└──────────┘     └──────────┘     └──────────┘
```

### Nouveau(x) Composant(s)

| Fichier                      | Type      | Responsabilité |
| ---------------------------- | --------- | -------------- |
| `src/components/Example.tsx` | Component | Description    |
| `src/app/example/page.tsx`   | Page      | Description    |

### Modèle de Données

```typescript
interface Example {
  id: string;
  // ...
}
```

### API / Routes

| Méthode | Route          | Description        |
| ------- | -------------- | ------------------ |
| `GET`   | `/api/example` | Liste des éléments |
| `POST`  | `/api/example` | Création           |

---

## UI / UX

### Maquettes

> Insérer des liens vers des maquettes, wireframes, ou captures :
> `![maquette](file:///chemin/vers/maquette.png)`

### États d'interface

| État       | Comportement       |
| ---------- | ------------------ |
| Chargement | Skeleton / spinner |
| Vide       | Message + CTA      |
| Erreur     | Toast / bannière   |
| Succès     | Confirmation       |

---

## Plan d'Implémentation

### Phase 1 — Fondation

- [ ] Tâche 1
- [ ] Tâche 2

### Phase 2 — Intégration

- [ ] Tâche 3
- [ ] Tâche 4

### Phase 3 — Polish

- [ ] Tâche 5

---

## Tests & Validation

### Tests Automatisés

- [ ] Unit tests pour la logique métier
- [ ] Tests de composants (rendering, interactions)

### Vérification Manuelle

- [ ] Responsive (mobile, tablet, desktop)
- [ ] Dark theme
- [ ] Accessibilité (clavier, screen reader)
- [ ] Performance (Lighthouse > 90)

---

## Risques & Dépendances

| Risque   | Impact | Mitigation |
| -------- | ------ | ---------- |
| Risque 1 | `high` | Plan B     |

| Dépendance   | Statut                  |
| ------------ | ----------------------- |
| Dépendance 1 | ✅ Prêt / ⏳ En attente |

---

## Notes & Références

- [Lien vers documentation](https://example.com)
- Décisions prises lors de la discussion du YYYY-MM-DD
