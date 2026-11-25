# VIDYAQUEST — Development Roadmap

## Working rules
- Work in small, demonstrable vertical slices.
- Keep one primary issue in progress.
- Every task has acceptance criteria and a test plan.
- Update this file when milestone status changes; GitHub Issues remain the task tracker.
- Do not begin the next phase until exit criteria pass.

## Phase 0 — Foundation
- [ ] Confirm grade range, board and first learning unit.
- [ ] Confirm MVP demo/pilot scope.
- [ ] Select first experiment after code and asset licence review.
- [ ] Decide authentication, hosting and data handling assumptions.
- [ ] Add PRD, architecture, decisions and agent instructions.
- [ ] Add GitHub issue and PR templates.
- [ ] Add environment example and ignore rules.
- [ ] Configure branch protection and project board.
Exit: open decisions are recorded, workflow is usable, no secrets are committed, MVP scope is clear.

## Phase 1 — Application foundation
- [ ] Scaffold Next.js frontend.
- [ ] Scaffold Express + TypeScript API.
- [ ] Validate environment variables.
- [ ] Connect MongoDB behind repository/service boundaries.
- [ ] Add health endpoint and error handling.
- [ ] Add lint, format, typecheck and test scripts.
- [ ] Add CI.
Exit: clean install and local run instructions pass; CI is green.

## Phase 2 — Student learning foundation
- [ ] Implement identity and role-aware protection.
- [ ] Implement subject and learning-unit catalogue.
- [ ] Build dashboard and learning-unit detail page.
- [ ] Seed a small reviewed content set.
Exit: student can sign in and open a published learning unit.

## Phase 3 — First virtual lab
- [ ] Evaluate candidate simulation and all relevant licences/assets.
- [ ] Select one experiment aligned to chosen grade/chapter.
- [ ] Build lab catalogue and adapter interface.
- [ ] Integrate experiment into student journey.
- [ ] Save attempts, parameters, observations and completion.
- [ ] Add knowledge check and progress view.
Exit: student completes one experiment and sees persisted progress after reload.

## Phase 4 — AI tutor
- [ ] Prepare approved curriculum corpus and metadata.
- [ ] Build ingestion and retrieval evaluation.
- [ ] Add Gemini provider behind an interface.
- [ ] Ground answers in retrieved sources and show citations.
- [ ] Add low-context fallback.
- [ ] Test prompt injection and unsupported-answer cases.
Exit: defined evaluation set passes with source references and safe fallback.

## Phase 5 — Assessment and motivation
- [ ] Add reusable quiz/question model.
- [ ] Add scoring and feedback.
- [ ] Add progress summaries.
- [ ] Add badges after learning events are reliable.

## Phase 6 — Teacher and guardian
- [ ] Define institution/classroom model.
- [ ] Define guardian verification and consent.
- [ ] Add scoped reports and access audit trail.
- [ ] Complete privacy review.

## Phase 7 — Offline and release
- [ ] Define cacheable resources.
- [ ] Add service worker and IndexedDB where justified.
- [ ] Define sync/conflict behaviour.
- [ ] Perform accessibility, security, performance and device testing.
- [ ] Prepare deployment, backups, monitoring and support.

Current phase: Phase 0 — Foundation  
Next implementation milestone: Phase 1 — Application foundation
