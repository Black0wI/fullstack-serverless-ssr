# ============================================
# NEXT.JS SST BOILERPLATE — Makefile
# ============================================

.PHONY: setup dev build lint format type-check deploy deploy-staging clean help test check release

# ── Variables ──
STAGE ?= production
AWS_REGION ?= eu-west-3
VERSION ?=

# ── Help ──
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ── Setup ──
setup: ## Initialize the project
	@echo "📦 Installing dependencies..."
	npm install
	@echo "📄 Creating .env from example..."
	@test -f .env || cp .env.example .env
	@test -f .env.local || cp .env.local.example .env.local
	@echo "✅ Setup complete. Run 'make dev' to start."

# ── Development ──
dev: ## Start dev server (Turbopack, port 4040)
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

# ── Infrastructure (SST) ──
deploy: ## Deploy to production (STAGE=production)
	@echo "🚀 Deploying to $(STAGE)..."
	npx sst deploy --stage $(STAGE)
	@echo "✅ Deployed to $(STAGE)!"

deploy-staging: ## Deploy to staging
	@echo "🧪 Deploying to staging..."
	npx sst deploy --stage staging
	@echo "✅ Deployed to staging!"

sst-dev: ## Start SST dev mode (live Lambda)
	npx sst dev

sst-diff: ## Preview infrastructure changes
	npx sst diff --stage $(STAGE)

sst-remove: ## Remove SST infrastructure for a stage
	npx sst remove --stage $(STAGE)

sst-remove-staging: ## Remove staging infrastructure
	npx sst remove --stage staging

# ── Cleanup ──
clean: ## Clean build artifacts
	rm -rf .next/ .sst/ node_modules/.cache .open-next/
	@echo "🧹 Cleaned."

# ── Release ──
release: ## Create a release (VERSION=x.y.z required)
	@test -n "$(VERSION)" || (echo "❌ VERSION is required. Usage: make release VERSION=1.1.0" && exit 1)
	@echo "📦 Releasing v$(VERSION)..."
	npm run lint && npm run type-check && npm test && npm run build
	git add -A && git commit -m "release: v$(VERSION)"
	git tag -a v$(VERSION) -m "v$(VERSION)"
	git push origin HEAD --tags
	@echo "✅ Released v$(VERSION)!"
