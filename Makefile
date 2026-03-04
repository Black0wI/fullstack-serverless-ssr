# ============================================
# TECH PORTAL — Makefile
# ============================================

.PHONY: setup dev build lint format type-check deploy clean help push force-deploy

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

build: ## Build static export
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
	@echo "   → https://github.com/itakademy/tech-portal/pulls"

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

# ── Infrastructure ──
infra-init: ## Initialize Terraform
	cd infra && terraform init

infra-plan: ## Preview infrastructure changes
	cd infra && terraform plan

infra-apply: ## Apply infrastructure changes
	cd infra && terraform apply

deploy: build ## Build and deploy to production (via Terraform)
	@echo "🚀 Deploying to $(ENV)..."
	cd infra && terraform init && terraform apply -auto-approve
	@BUCKET=$$(cd infra && terraform output -raw s3_bucket_name) && \
	DIST_ID=$$(cd infra && terraform output -raw cloudfront_distribution_id) && \
	echo "📤 Syncing to S3..." && \
	aws s3 sync out/ s3://$$BUCKET --delete \
		--cache-control "public, max-age=31536000, immutable" \
		--exclude "*.html" --exclude "*.json" && \
	aws s3 sync out/ s3://$$BUCKET --delete \
		--cache-control "public, max-age=0, must-revalidate" \
		--include "*.html" --include "*.json" --exclude "_next/*" && \
	echo "🔄 Invalidating CloudFront..." && \
	aws cloudfront create-invalidation --distribution-id $$DIST_ID --paths "/*" && \
	echo "✅ Deployed to $(ENV)!"

# ── Cleanup ──
clean: ## Clean build artifacts
	rm -rf out/ .next/ node_modules/.cache
	@echo "🧹 Cleaned."
