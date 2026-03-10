# CNC TECH Admin MVP

Internal admin app for managing coffee product drafts, brand rules, generated marketing copy, and generated output version history.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase data layer with a local file-backed fallback for seeded MVP verification

## Project Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-api-key
# Optional
# OPENAI_MODEL=gpt-4o-mini
# OPENAI_TIMEOUT_MS=30000
# OPENAI_BASE_URL=https://api.openai.com/v1
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Environment Variables

The app currently reads these variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` optional, defaults to `gpt-4o-mini`
- `OPENAI_TIMEOUT_MS` optional, defaults to `30000`
- `OPENAI_BASE_URL` optional, defaults to `https://api.openai.com/v1`

Behavior:

- If both Supabase values are present, the app uses Supabase.
- If either Supabase value is missing, the app falls back to a local file-backed seed store at `.local-dev-store.json`.
- If `OPENAI_API_KEY` is present, `/api/generate` uses the real OpenAI provider by default.
- If `OPENAI_API_KEY` is missing, `/api/generate` falls back to the built-in placeholder provider so the seeded MVP flow still works.

The local fallback store includes:

- one seeded product with id `seed-apollo-blend`
- one default global brand rules record

For a clean seeded verification run, delete `.local-dev-store.json` before starting the app.

## Supabase Setup

The app expects the following database objects:

- `brand_rules`
- `products`
- `generated_outputs`
- `latest_generated_outputs` view

Use the Phase 2 schema described in [sql.md](/C:/dev/cnc_detail/sql.md) and the PRD. The generated TypeScript bindings in [database.types.ts](/C:/dev/cnc_detail/src/lib/supabase/database.types.ts) reflect the current expected shape.

Minimum setup flow:

1. Create a Supabase project.
2. Apply the schema for the tables and view listed above.
3. Seed at least:
   - one `brand_rules` row
   - one `products` row if you do not want to rely on the local fallback
4. Put the project URL and anon key into `.env.local`.

## Run Instructions

Development:

```bash
npm run dev
```

Production build check:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Local seeded smoke path without Supabase:

1. Remove `.local-dev-store.json` if it exists.
2. Run `npm run dev` or `npm run start`.
3. Verify this flow:
   - dashboard loads the seeded product
   - open `/products/seed-apollo-blend`
   - open the generation workspace
   - generate a draft
   - save a version
   - reload `/products/seed-apollo-blend/results`

## Current Architecture

- `src/app/*`
  - route-level page and API entry points only
- `src/components/shared/*`
  - reusable presentation helpers for page headers, state panels, and loading skeletons
- `src/features/*`
  - feature-specific UI, schemas, API clients, repositories, services, and types
- `src/features/generation/*`
  - generation context building, provider registry, provider interface, OpenAI provider, and placeholder fallback provider
- `src/lib/supabase/*`
  - Supabase client and generated database typings
- `src/lib/local-dev/*`
  - local file-backed fallback store used when Supabase env vars are absent

## MVP Limitations

- No auth
- No Gemini provider yet
- Generated version delete/rollback is not implemented
- Compare view is summary-based, not a rich side-by-side diff
- Local fallback store is for development verification, not a production datastore
- The UI does not yet expose provider selection; the server chooses OpenAI when configured, otherwise placeholder

## Generation Provider Notes

Current generation flow:

1. UI calls `POST /api/generate`
2. API validates input with `src/features/generation/generation.schema.ts`
3. Service resolves a provider from `src/features/generation/generation-registry.ts`
4. Provider returns a `GenerationResult`

Recommended implementation boundary:

- keep prompt/context assembly in `generation-context.ts`
- keep provider lookup in `generation-registry.ts`
- keep network calls and model-specific parsing inside each provider class
- keep `/api/generate` as a thin validation + service entry point

Current provider behavior:

- `openai-generation-provider.ts` handles prompt building, remote API calls, timeout handling, rate-limit handling, and JSON response parsing
- `placeholder-generator.ts` remains available as a fallback provider
- `generation-config.ts` defines the server-side provider config boundary

## Verification Commands

These commands should remain green after refactors:

```bash
npm run lint
npm run build
```
