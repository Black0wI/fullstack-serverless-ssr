---
description: Start the local development environment
---

# Dev Local

Start the Next.js development server with Turbopack.

## Steps

// turbo

1. Install dependencies (if needed):

```bash
npm install
```

// turbo 2. Start the development server:

```bash
npm run dev
```

The server starts at `http://localhost:4040`.

## Quality Checks

// turbo 3. Run linting:

```bash
npm run lint
```

// turbo 4. Check types:

```bash
npm run type-check
```

// turbo 5. Check formatting:

```bash
npm run format:check
```

## Test Build

// turbo 6. Test the SSR build:

```bash
npm run build && echo "✅ Build OK"
```
