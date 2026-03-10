# CNC TECH Admin MVP Session Handoff

Last updated: 2026-03-10
Current status: Phase 9 provider integration in progress
Next default target: Phase 9 - generated-version actions and richer compare UI

## 1. Project Summary

This repository is an internal admin MVP for managing coffee product data, brand rules, generated marketing copy, and saved generated-output versions.

Current implementation includes:
- Phase 1 app scaffolding
- Phase 2 Supabase typing and data/data-layer scaffolding
- Phase 3 product CRUD UI and route handlers
- Phase 4 brand rules settings persistence
- Phase 5 placeholder generation pipeline and `/api/generate`
- Phase 6 generated results workspace with editing, export, and save flow
- Phase 7 generated output versioning UI flow
- Phase 8 seeded Apollo Blend end-to-end fallback path
- final refactor pass for maintainability, state handling, and setup docs
- Phase 9 partial: OpenAI provider integration, provider config boundary, and generate API default-provider wiring

Still not implemented:
- no auth
- no Gemini integration
- no generated-output delete or rollback endpoint
- no rich side-by-side diff UI

## 2. What Was Completed In The Current Phase Slice

Goals:
- connect a real generation provider without collapsing the existing fallback path
- formalize server-side provider configuration
- keep `/api/generate` thin while improving provider-specific error handling

Completed work:
- added `openai-generation-provider.ts` using server-side `fetch`
- added `generation-config.ts` as the provider env/config boundary
- added `generation.errors.ts` for status-aware provider failures
- expanded generation provider types and request schema to support `openai` and `placeholder`
- updated the provider registry to:
  - register OpenAI
  - keep placeholder fallback
  - select OpenAI by default when `OPENAI_API_KEY` is configured
- updated `generation.service.ts` so metadata includes the resolved provider and model
- updated the generated results workspace to:
  - call `/api/generate` without hardcoding `placeholder`
  - display the resolved provider in the draft source area
  - explain when placeholder fallback is used
- updated `README.md` with OpenAI env vars and fallback behavior

## 3. Verification Performed

The following commands are the required verification target for this phase slice:

```bash
npm run lint
npm run build
```

Runtime notes:
- if `OPENAI_API_KEY` is missing, generation falls back to the placeholder provider
- if `OPENAI_API_KEY` is present, `/api/generate` uses OpenAI by default

## 4. Current Architecture

Route layer:
- `src/app/*`
- pages and API routes stay thin; they call services and render feature UI

Shared UI:
- `src/components/shared/*`
- page headers, state panels, placeholder panels, and loading skeletons

Feature modules:
- `src/features/products/*`
- `src/features/brand-rules/*`
- `src/features/outputs/*`
- `src/features/generation/*`

Data access:
- repositories handle Supabase queries
- services choose between Supabase and the local fallback store

Generation flow:
- `generation-context.ts` builds provider-ready input context
- `generation-config.ts` owns server-side provider env parsing
- `generation.errors.ts` owns provider failure typing and HTTP status mapping
- `generation-registry.ts` resolves the active provider
- provider classes implement `GenerationProvider`
- `/api/generate` validates input and delegates to the generation service

Local fallback:
- `src/lib/local-dev/local-dev-store.ts`
- file-backed seed store used when Supabase env vars are absent

## 5. Important Files

Current phase additions:
- `src/features/generation/openai-generation-provider.ts`
- `src/features/generation/generation-config.ts`
- `src/features/generation/generation.errors.ts`

Key feature files:
- `src/features/generation/generation-registry.ts`
- `src/features/generation/generation.schema.ts`
- `src/features/generation/generation.service.ts`
- `src/features/outputs/generated-results-workspace.tsx`
- `src/features/outputs/generated-results-workspace.utils.ts`
- `src/app/api/generate/route.ts`
- `README.md`

## 6. Architecture Decisions Already Made

- keep Supabase logic out of page components
- keep database access in repository/service layers
- keep generated-output version creation in the outputs service/data layer
- keep generation provider lookup in a registry rather than page/route code
- keep server-side provider config parsing out of client components and route handlers
- keep OpenAI-specific prompt and response parsing inside the provider class
- keep restore behavior as draft hydration only; saving still creates a new version
- use the local file-backed fallback store only when Supabase env vars are absent

## 7. Recommended Next Step

Default next step:
- implement generated-output delete and rollback actions behind the existing version history flow

Recommended remaining Phase 9 deliverables:
- add generated-output delete/rollback endpoints and service methods
- connect version action buttons in the results workspace
- improve compare into a richer diff UI
- optionally add Gemini after the OpenAI path is stable
- decide whether the local fallback store remains dev-only or should become a more formal fixture or mocked test path

## 8. Practical Notes For The Next Session

- read this file before making changes
- if Supabase env vars are missing, the app uses `.local-dev-store.json`
- if `OPENAI_API_KEY` is missing, generation uses the placeholder provider
- if `OPENAI_API_KEY` is present, generation defaults to OpenAI
- for a clean seeded local verification, delete `.local-dev-store.json` before running
- seeded fallback product id: `seed-apollo-blend`
- generated-output saves are append-only; existing saved versions are never mutated

## 9. Files Created Or Changed In The Current Phase Slice

Created:
- `src/features/generation/generation-config.ts`
- `src/features/generation/generation.errors.ts`
- `src/features/generation/openai-generation-provider.ts`

Updated:
- `README.md`
- `docs/SESSION_HANDOFF.md`
- `src/app/api/generate/route.ts`
- `src/app/page.tsx`
- `src/app/products/[id]/results/page.tsx`
- `src/features/generation/generation-registry.ts`
- `src/features/generation/generation.schema.ts`
- `src/features/generation/generation.service.ts`
- `src/features/generation/generation.types.ts`
- `src/features/generation/placeholder-generator.ts`
- `src/features/outputs/generated-outputs.api.ts`
- `src/features/outputs/generated-results-workspace.tsx`
- `src/features/outputs/generated-results-workspace.utils.ts`

## 10. Resume Prompt Suggestion

If a future session needs a starting instruction, use this:

```text
Read AGENTS.md and docs/SESSION_HANDOFF.md first, then continue with the next requested phase only.
```
