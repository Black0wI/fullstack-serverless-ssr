#!/usr/bin/env python3
"""
[NOM DE L'OUTIL] — Description courte.

Usage:
    python tool.py --help
    python tool.py run --input data.json
    python tool.py run --input data.json --dry-run

Exemples:
    # Mode dry-run (aucune modification)
    python tool.py run --input data.json --dry-run

    # Exécution réelle avec verbosité
    python tool.py run --input data.json --verbose
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
from pathlib import Path
from typing import Any

# ── Configuration ──────────────────────────────────────────────

TOOL_NAME = "template-tool"
TOOL_VERSION = "0.1.0"
TOOL_DESCRIPTION = "Description de l'outil"

# Chemin racine du projet (2 niveaux au-dessus de tools/<outil>/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# ── Logging ────────────────────────────────────────────────────

logger = logging.getLogger(TOOL_NAME)


def setup_logging(verbose: bool = False) -> None:
    """Configure le logging avec format lisible."""
    level = logging.DEBUG if verbose else logging.INFO
    formatter = logging.Formatter(
        fmt="%(asctime)s │ %(levelname)-7s │ %(message)s",
        datefmt="%H:%M:%S",
    )
    handler = logging.StreamHandler(sys.stderr)
    handler.setFormatter(formatter)
    logger.setLevel(level)
    logger.addHandler(handler)


# ── Fonctions Métier ───────────────────────────────────────────


def load_input(path: Path) -> Any:
    """Charge un fichier d'entrée (JSON, CSV, etc.)."""
    logger.info(f"📂 Chargement : {path}")

    if not path.exists():
        logger.error(f"Fichier introuvable : {path}")
        sys.exit(1)

    if path.suffix == ".json":
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    else:
        with open(path, encoding="utf-8") as f:
            return f.read()


def process(data: Any, *, dry_run: bool = False) -> dict[str, Any]:
    """
    Logique principale de l'outil.

    Args:
        data:    Données d'entrée chargées.
        dry_run: Si True, simule sans effets de bord.

    Returns:
        Résumé de l'exécution.
    """
    results = {
        "processed": 0,
        "skipped": 0,
        "errors": 0,
    }

    if dry_run:
        logger.info("🔍 Mode dry-run activé — aucune modification")

    # ── TODO: Implémenter la logique ici ──
    #
    # Exemple :
    # for item in data:
    #     try:
    #         if dry_run:
    #             logger.debug(f"  [DRY] Traitement de {item}")
    #         else:
    #             do_something(item)
    #         results["processed"] += 1
    #     except Exception as e:
    #         logger.warning(f"  ⚠️  Erreur sur {item}: {e}")
    #         results["errors"] += 1

    logger.info(f"✅ Terminé — {results}")
    return results


def write_output(data: Any, path: Path) -> None:
    """Écrit le résultat dans un fichier."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    logger.info(f"💾 Résultat écrit : {path}")


# ── CLI ────────────────────────────────────────────────────────


def build_parser() -> argparse.ArgumentParser:
    """Construit le parser CLI."""
    parser = argparse.ArgumentParser(
        prog=TOOL_NAME,
        description=TOOL_DESCRIPTION,
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--version",
        action="version",
        version=f"%(prog)s {TOOL_VERSION}",
    )

    subparsers = parser.add_subparsers(dest="command", help="Commandes disponibles")

    # ── Commande : run ──
    run_parser = subparsers.add_parser("run", help="Exécuter l'outil")
    run_parser.add_argument(
        "--input", "-i",
        type=Path,
        required=True,
        help="Fichier d'entrée (JSON, CSV, etc.)",
    )
    run_parser.add_argument(
        "--output", "-o",
        type=Path,
        default=None,
        help="Fichier de sortie (optionnel)",
    )
    run_parser.add_argument(
        "--dry-run",
        action="store_true",
        default=False,
        help="Simuler sans effectuer de modifications",
    )
    run_parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        default=False,
        help="Activer les logs détaillés",
    )

    return parser


def main() -> None:
    """Point d'entrée principal."""
    parser = build_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    setup_logging(verbose=args.verbose)

    logger.info(f"🚀 {TOOL_NAME} v{TOOL_VERSION}")
    logger.info(f"📁 Projet : {PROJECT_ROOT}")

    if args.command == "run":
        data = load_input(args.input)
        results = process(data, dry_run=args.dry_run)

        if args.output:
            write_output(results, args.output)


if __name__ == "__main__":
    main()
