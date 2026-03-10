# CNC TECH Admin MVP Implementation Summary

Last updated: 2026-03-10
Coverage: Phase 1 to Phase 7

## 1. Overall Progress

Completed phases:
- Phase 1: project setup and route scaffolding
- Phase 2: Supabase schema typing and service-layer scaffolding
- Phase 3: product CRUD UI and route handlers
- Phase 4: brand rules settings persistence
- Phase 5: placeholder generation pipeline
- Phase 6: generated results workspace
- Phase 7: generated output versioning UI flow

Not yet completed:
- version compare or rollback workflow
- real LLM provider integration
- auth and RLS rollout
- export workflow beyond current per-tab download

## 2. Phase-by-Phase Summary

### Phase 1
- Created Next.js App Router project structure
- Added TypeScript, Tailwind, shared UI primitives, and route placeholders
- Added initial Supabase helper setup

### Phase 2
- Added typed Supabase `Database` definitions
- Added repository and service layers for:
  - products
  - brand rules
  - generated outputs

### Phase 3
- Implemented dashboard product list
- Implemented create, edit, delete, and duplicate product flows
- Built reusable product form with RHF and Zod

### Phase 4
- Implemented brand rules settings page
- Loaded and saved the single `brand_rules` record from Supabase
- Added array-field editing for tone, avoid, and priority rules

### Phase 5
- Added `POST /api/generate`
- Added placeholder generation service and provider interface
- Added generation context builder using product, brand rules, and research summary

### Phase 6
- Replaced results placeholder page with editable output tabs
- Added copy, markdown export, plain text export, and save version flow
- Added save route for generated output bundles

### Phase 7
- Added version list on the results page
- Added latest-version display
- Added previous-version loading into the current editing draft
- Confirmed version numbers increment per product on save

## 3. Current Working Features

Product management:
- create product
- edit product
- delete product
- duplicate product
- dashboard list, search, filter, and sorting

Brand rules:
- load current rules
- edit and save rules

Generation:
- placeholder generation through `/api/generate`
- context-based mock output generation

Generated outputs:
- editable tabbed results workspace
- copy active tab
- export active tab as markdown
- export active tab as plain text
- save a full output set as a new version
- list saved versions
- load a previous version into the editor

## 4. Key Routes

Pages:
- `/`
- `/products/new`
- `/products/[id]`
- `/products/[id]/results`
- `/settings/brand-rules`

APIs:
- `/api/products`
- `/api/products/[id]`
- `/api/products/[id]/duplicate`
- `/api/products/[id]/generated-outputs`
- `/api/brand-rules/[id]`
- `/api/generate`

## 5. Key Architectural Decisions

- UI components do not call Supabase directly.
- Database access is isolated in repository and service layers.
- Route handlers are used as the client mutation boundary.
- Generation logic is isolated behind a provider interface.
- Generated output versions are saved as full bundles for now.
- Previous versions load into editor state only and do not overwrite saved rows.

## 6. Recommended Next Work

High-priority next steps:
- add version compare or diff UI
- add clearer restore-as-new-version workflow
- connect generation entry more directly from the product editor

Medium-priority next steps:
- add real provider integration seam for OpenAI or Gemini
- add output metadata display and workflow polish

Lower-priority later steps:
- auth
- RLS
- richer export automation
