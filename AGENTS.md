# Repository Working Instructions

## Start-Of-Task Rule
- Before making any new code changes, read [docs/SESSION_HANDOFF.md](/C:/dev/cnc_detail/docs/SESSION_HANDOFF.md).
- Treat that file as the current source of truth for:
  - completed phases
  - current architecture decisions
  - pending work
  - environment variables
  - guardrails for the next implementation step

## Current Project Rule
- This repository is being built phase by phase.
- Do not implement multiple phases at once unless explicitly asked.
- Preserve clean architecture and modular folder structure.
- Do not add features outside the PRD.

## Current Phase Status
- Phase 1 is complete.
- The next default implementation target is Phase 2: Supabase schema and domain/data scaffolding.

## Documentation Update Rule
- After each completed phase, update [docs/SESSION_HANDOFF.md](/C:/dev/cnc_detail/docs/SESSION_HANDOFF.md).
- Include:
  - what was completed
  - files created or changed
  - verification performed
  - remaining work for the next phase
