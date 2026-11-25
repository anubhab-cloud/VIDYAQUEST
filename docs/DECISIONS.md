# VIDYAQUEST — Architecture Decision Log

Record significant decisions here. Add new entries at the top. Status values: Proposed, Accepted, Superseded or Rejected.

## ADR-001 — Modular monolith
Status: Accepted  
Date: 2026-11-25  
Context: Solo development with AI assistance. Microservices add deployment, networking, observability and data-consistency overhead before they are needed.  
Decision: One Express backend organised into domain modules, plus a separate Next.js frontend.  
Consequences: Simple local development; modules may be extracted later if evidence justifies it.

## ADR-002 — Initial technology baseline
Status: Proposed  
Date: 2026-11-25  
Context: Existing project direction identifies Next.js, React, TypeScript, Tailwind, Node.js, Express and MongoDB, with React Three Fiber for custom 3D labs.  
Decision: Use these as the Phase 1 baseline, subject to package/version review during scaffolding.  
Consequences: Avoid additional infrastructure until an MVP requirement needs it.

## ADR-003 — One lab vertical slice first
Status: Accepted  
Date: 2026-11-25  
Context: Integrating many repositories at once increases compatibility, licensing and maintenance risk.  
Decision: Select one Physics experiment first. Review source code, dependencies, code licence, assets and embedding restrictions.  
Consequences: Establish a reusable lab adapter and student progress flow before expanding.

## Open decisions
- Target grade, board and first chapter.
- First experiment and selected upstream repository.
- Authentication and account provisioning.
- Hosting, database deployment and backups.
- Pilot audience and guardian-consent requirements.
- AI retrieval corpus, embedding approach and evaluation.
For each decision record context, options, decision, date, owner and consequences.
