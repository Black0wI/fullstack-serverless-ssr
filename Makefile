# ============================================
# TECH PORTAL — Makefile
# ============================================

.PHONY: setup dev build lint format type-check deploy clean help test

# ── Variables ──
ENV ?= production
AWS_REGION ?= eu-west-3

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
