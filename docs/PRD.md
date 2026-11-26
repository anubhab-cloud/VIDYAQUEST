# VIDYAQUEST — Product Requirements Document

Status: Phase 0 baseline  
Architecture: Modular monolith  
Development: Solo developer with AI coding-agent assistance

## Vision
VIDYAQUEST is an AI-assisted learning platform that helps school students understand academic concepts through structured learning content, interactive virtual experiments, guided explanations, practice and progress visibility.

## Problem
Students can struggle to connect textbook theory with practical concepts. Physical labs may be unavailable or costly, personalised support may be limited, and parents or educators may lack clear progress visibility. Connectivity can also interrupt digital learning.

## Users
- Student: explores subjects, performs experiments, asks learning questions, completes assessments and views own progress.
- Teacher / institution staff: later manages assigned learners and class-level progress.
- Parent / guardian: later views authorised reports for linked students.
- Administrator: manages users, content, experiments and platform configuration.

Backend authorisation is mandatory; hiding a frontend screen is not access control. Guardian access requires a verified relationship and appropriate consent.

## Product principles
1. Learning outcomes before feature count.
2. Curriculum-aligned content with source attribution.
3. Safe, age-appropriate and accessible UX.
4. AI assists learning and must not invent curriculum facts.
5. Privacy and data minimisation for student information.
6. Offline support must clearly identify cached resources.
7. Review code, asset and content licences before reusing simulations.
8. Build one working vertical slice before expanding.

## MVP scope
Included:
- Responsive student-facing application shell.
- Authentication foundation and role model.
- Student dashboard with a small curated set of learning units.
- One complete Physics virtual experiment.
- Experiment instructions, controls, observations and completion record.
- Basic knowledge check for the experiment.
- Backend APIs, persistence, tests and developer documentation.

Later:
- More Physics, Chemistry and Biology labs.
- Gemini tutor and syllabus-grounded RAG.
- Gamification, badges and leaderboards.
- Teacher/institution and parent/guardian portals.
- Offline-first PWA and sync.
- Notifications, institutional deployments and paid services.

Out of scope for first MVP:
- Microservices, Kafka and distributed event processing.
- Payments, advertising and subscription billing.
- High-stakes automated grading or AI-generated rankings.
- Broad production rollout before content validation.
- Large library of unreviewed third-party simulations.

## Core student journey
1. Sign in.
2. Open dashboard.
3. Choose subject and learning unit.
4. Read objective and instructions.
5. Launch experiment.
6. Change permitted parameters and observe.
7. Record an observation and complete a short knowledge check.
8. See saved completion and feedback.

## Functional requirements
- FR-01 Authentication.
- FR-02 Backend role and resource-ownership authorisation.
- FR-03 Browse published subjects and learning units.
- FR-04 Launch the published MVP experiment.
- FR-05 Responsive experiment instructions and controls.
- FR-06 Persist attempts and completion.
- FR-07 Complete a knowledge check and view feedback.
- FR-08 Clear loading, empty and error states.
- FR-09 Protect administrative content operations server-side.
- FR-10 Future AI answers use approved retrieved content and show sources.

## Non-functional requirements
- Responsive laptop, tablet and mobile layouts.
- Type-safe frontend/backend contracts.
- Validate input at API boundaries.
- Secrets only in environment variables or a secret manager.
- No passwords, tokens or unnecessary student data in logs.
- Basic accessibility and keyboard navigation.
- Automated tests for critical business rules and authorisation.
- Separate domain logic, API transport and persistence.
- Review dependency and asset licences.

## MVP success criteria
- A developer can install and run the project using documented steps.
- A student completes the first experiment without manual database edits.
- Completion remains visible after refresh or re-login.
- Tests cover critical authorisation and attempt ownership.
- No secrets are committed.
- The experiment has reviewed learning objectives, expected observations and licence/source details.

## Open decisions for Phase 0
- Target grade, curriculum board and first chapter.
- Authentication provider and student onboarding.
- Hosting and database deployment.
- First Physics experiment and selected simulation source.
- Demo/pilot versus production release.
- Data retention, guardian consent and child-data compliance.
Do not silently assume these. Record decisions in docs/DECISIONS.md.
