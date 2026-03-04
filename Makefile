# ============================================
# TECH PORTAL — Makefile
# ============================================

.PHONY: setup dev build lint format type-check deploy clean help push force-deploy test

# ── Variables ──
ENV ?= production
AWS_REGION ?= eu-west-3
BRANCH_AI := ai-agent
BRANCH_PROD := main

# ── Help ──
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ── Setup ──
setup: ## Initialize the project
	@echo "📦 Installing dependencies..."
	npm install
	@echo "📄 Creating .env from example..."
	@test -f .env || cp .env.example .env
	@echo "✅ Setup complete. Run 'make dev' to start."

# ── Development ──
dev: ## Start dev server (Turbopack, port 4000)
	npm run dev

build: ## Build the application
	npm run build

# ── Quality ──
lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint with auto-fix
	npm run lint:fix

format: ## Format code with Prettier
	npm run format

format-check: ## Check code formatting
	npm run format:check

type-check: ## TypeScript type checking
	npm run type-check

test: ## Run unit tests (Vitest)
	npm test

check: lint type-check format-check build ## Run all quality checks

# ── Git Workflow ──
push: ## Push to ai-agent branch (triggers auto-PR to main)
	@CURRENT=$$(git branch --show-current) && \
	if [ "$$CURRENT" != "$(BRANCH_AI)" ]; then \
		echo "⚠️  Vous n'êtes pas sur la branche $(BRANCH_AI) (actuelle: $$CURRENT)" && \
		echo "   Voulez-vous basculer sur $(BRANCH_AI) ? [y/N]" && \
		read -r REPLY && \
		if [ "$$REPLY" = "y" ] || [ "$$REPLY" = "Y" ]; then \
			git checkout $(BRANCH_AI) 2>/dev/null || git checkout -b $(BRANCH_AI) && \
			echo "✅ Basculé sur $(BRANCH_AI)"; \
		else \
			echo "❌ Annulé." && exit 1; \
		fi; \
	fi
	@echo "🔍 Vérification pré-push..."
	@npm run lint --silent && npm run type-check --silent
	@echo "📤 Push sur $(BRANCH_AI)..."
	@git push origin $(BRANCH_AI)
	@echo ""
	@echo "✅ Push effectué. Une PR sera automatiquement créée/mise à jour vers $(BRANCH_PROD)."
	@echo "   → https://github.com/Black0wI/nextjs-static-edge-template/pulls"

force-deploy: ## ⚠️  URGENCE: Push direct sur main (bypass PR)
	@echo ""
	@echo "╔══════════════════════════════════════════════════╗"
	@echo "║  ⚠️   FORCE DEPLOY — BYPASS PR REVIEW           ║"
	@echo "║  Ce push ira DIRECTEMENT en production.          ║"
	@echo "║  À utiliser UNIQUEMENT en cas d'urgence.         ║"
	@echo "╚══════════════════════════════════════════════════╝"
	@echo ""
	@echo "Confirmez le déploiement direct en production [y/N] : " && \
	read -r REPLY && \
	if [ "$$REPLY" != "y" ] && [ "$$REPLY" != "Y" ]; then \
		echo "❌ Annulé." && exit 1; \
	fi
	@echo "🔍 Vérification pré-deploy..."
	@npm run lint --silent && npm run type-check --silent && npm run build --silent
	@CURRENT=$$(git branch --show-current) && \
	if [ "$$CURRENT" != "$(BRANCH_PROD)" ]; then \
		echo "🔀 Merge de $$CURRENT dans $(BRANCH_PROD)..." && \
		git checkout $(BRANCH_PROD) && \
		git merge $$CURRENT --no-edit && \
		git push origin $(BRANCH_PROD) && \
		git checkout $$CURRENT; \
	else \
		git push origin $(BRANCH_PROD); \
	fi
	@echo ""
	@echo "🚀 Force deploy terminé. Le déploiement CI/CD se lance automatiquement."

# ── Infrastructure (SST) ──
deploy: ## Deploy to production with SST
	@echo "🚀 Deploying to $(ENV) with SST..."
	npx sst deploy --stage $(ENV)
	@echo "✅ Deployed to $(ENV)!"

sst-dev: ## Start SST dev mode (live Lambda)
	npx sst dev

sst-diff: ## Preview infrastructure changes
	npx sst diff --stage $(ENV)

sst-remove: ## Remove SST infrastructure
	npx sst remove --stage $(ENV)

# ── Cleanup ──
clean: ## Clean build artifacts
	rm -rf .next/ .sst/ node_modules/.cache .open-next/
	@echo "🧹 Cleaned."
