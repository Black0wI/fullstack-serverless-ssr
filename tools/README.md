# Outils & Scripts

Ce dossier contient les outils tiers (Python, Bash, etc.) développés en support du projet.

## Structure

```
tools/
├── _template/           ← Template pour créer un nouvel outil
│   └── tool.py
├── README.md            ← Ce fichier
├── requirements.txt     ← Dépendances Python partagées
└── mon-outil/           ← Un outil (créé depuis le template)
    ├── README.md
    ├── tool.py
    └── requirements.txt (optionnel, si deps spécifiques)
```

## Quickstart

```bash
# Setup Python (une seule fois)
cd tools
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Créer un nouvel outil
cp -r _template mon-outil
# Éditer mon-outil/tool.py
```

## Convention de nommage

- Dossier : `kebab-case` (ex: `data-migrator`, `seed-db`, `generate-sitemap`)
- Script principal : `tool.py` (ou nom descriptif)
- Toujours inclure un `--help` via `argparse`

## Index des Outils

| Outil | Description | Langage |
|-------|-------------|---------|
| `_template` | Template de départ | Python |
