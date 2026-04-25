# Local Development

The frontend dev server proxies API requests to the Express server, so both need to be running.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- Git

## Clone and Install

```bash
git clone https://github.com/akifbayram/openbin.git
cd openbin
npm install          # Install frontend dependencies
cd server && npm install  # Install server dependencies
```

## Run Both Servers

Run the API and frontend together with one command from the project root:

```bash
npm run dev:all
```

This starts the Express API at `http://localhost:1453` and the Vite dev server at `http://localhost:5173`. Open `http://localhost:5173` in your browser.

::: info How the proxy works
The Vite dev server proxies all `/api` requests to `http://localhost:1453` automatically. You only ever open `http://localhost:5173` in your browser during development.
:::

### Running the servers individually

If you want logs in separate terminals or need to restart them independently:

**Terminal 1 — API server:**

```bash
npm run dev:server
```

**Terminal 2 — Frontend dev server:**

```bash
npm run dev
```

## Environment Variables

Copy `.env.example` to a new `.env` file in the project root and uncomment the variables you need:

```bash
cp .env.example .env
```

Key variables for local development:

| Variable | Default | Notes |
|----------|---------|-------|
| `DATABASE_PATH` | `./data/openbin.db` | SQLite file path; created automatically on first run |
| `CORS_ORIGIN` | `http://localhost:5173` | Must match the Vite dev server URL |
| `PORT` | `1453` | Express server port |
| `REGISTRATION_MODE` | `open` | `open`, `invite` (require invite code), or `closed` (no sign-ups) |

::: tip
For most local development workflows you do not need a `.env` file at all. The defaults work with the standard Vite + Express setup.
:::

## Type Checking

Run type checks before committing to catch errors across both packages. The combined script runs both:

```bash
npm run check
```

Or run them individually:

```bash
# Frontend
npx tsc --noEmit

# Server
cd server && npx tsc --noEmit
```

::: warning
Always run `npm run check` before submitting changes. The project uses TypeScript strict mode, and type errors will block the production build.
:::

## Tests

The project uses [Vitest](https://vitest.dev/) with happy-dom. Run the full test suite:

```bash
npx vitest run
```

Run a specific test file:

```bash
npx vitest run src/features/bins/__tests__/ItemList.test.tsx
```

Tests mock `apiFetch` from `@/lib/api` and `useAuth` from `@/lib/auth`. No running server or database is needed to execute tests.

## Production Build

Build the frontend for production:

```bash
npx vite build
```

The output lands in `dist/`. In production (and in Docker), Express serves this directory as static files.

## Linting

The project uses [Biome](https://biomejs.dev/) for linting and formatting — not ESLint or Prettier. Run from the project root to cover both `src/` (frontend) and `server/src/` (backend):

```bash
npx biome check .
```

To apply auto-fixes:

```bash
npx biome check --write .
```

::: info
The `biome.json` in the project root contains all lint and format rules for both packages. Running with a narrower path like `src/` skips the server code. Do not add ESLint or Prettier configuration files.
:::

