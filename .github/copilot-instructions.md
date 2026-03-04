# GitHub Copilot Instructions — Tech Portal

## Project Overview

Next.js 15 static site (App Router, TypeScript strict) deployed on AWS CloudFront via Terraform.

## Key Constraints

- **Static export only** (`output: 'export'`) — NO API routes, NO SSR, NO middleware
- **Vanilla CSS** with custom properties — NO Tailwind, NO CSS-in-JS
- **Server Components** by default — add `"use client"` only when necessary
- **Named exports** for all components (not default)
- Images must use `unoptimized: true`

## Naming Conventions

- Components: `PascalCase.tsx` in `src/components/`
- Pages: `page.tsx` (App Router)
- CSS: BEM naming `.block__element--modifier`
- All design tokens: `var(--token-name)` from `globals.css`

## Path Aliases

- `@/*` → `./src/*`

## Commands

- `npm run dev` — Dev server on port 4000
- `npm run build` — Static export to `out/`
- `npm run lint` — ESLint
- `npm run type-check` — TypeScript strict check
- `make deploy` — Full deploy pipeline
