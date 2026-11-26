# VIDYAQUEST — Architecture

Decision: modular monolith. Deployment: one Next.js frontend and one Express backend. Backend domain modules are separated in code but deployed together.

## Goals
- Keep solo development and local setup simple.
- Enforce clear product-domain boundaries.
- Avoid premature distributed systems.
- Make third-party lab integrations replaceable.
- Extract services later only when measurable needs justify it.

## System overview
Browser users (student, teacher, guardian, admin) use the Next.js application. It calls the Express API under /api/v1. The API contains identity, users, catalog, labs and progress modules. MongoDB stores application data. A future AI tutor module retrieves approved curriculum material and calls Gemini through a provider boundary. PWA caching is a later frontend capability.

## Proposed technology baseline
| Layer | Technology |
|---|---|
| Web | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| API | Node.js, Express.js, TypeScript |
| Database | MongoDB |
| Validation | Zod or equivalent |
| Custom 3D labs | React Three Fiber |
| AI later | Gemini API behind provider interface; RAG over approved content |
| Testing | Vitest or Jest, API integration tests, Playwright |
| Tooling | npm, ESLint, Prettier, GitHub Actions |

This is a proposed baseline, not a claim that packages are already installed. Confirm versions during scaffolding.

## Backend module boundaries
- identity: authentication, sessions/tokens, roles.
- users: profiles and role-specific profile data.
- catalog: subjects, chapters, learning units and publication status.
- labs: experiment catalogue, launch configuration and adapter contracts.
- progress: attempts, observations, completion and assessment results.
- ai-tutor (later): retrieval, model provider abstraction and citations.
- guardian (later): verified student–guardian links and scoped reports.
- admin (later): protected management and audit events.

Each module owns routes, services, validation/domain types and persistence access. One module must not directly use another module's database implementation.

## Frontend boundaries
- app: route composition and layouts.
- features: feature-specific UI, hooks and API clients.
- components: reusable design-system components.
- lib: shared utilities and API client.
Keep feature logic near its feature. Avoid global state until a real cross-feature need exists.

## Virtual lab integration contract
A lab catalogue record should contain stable experiment ID, title, subject, grade/level, chapter, learning objectives, prerequisites, provider type (native, embedded or external), launch configuration, instructions, safety notes, licence/source attribution and review status.

Support native VIDYAQUEST components, separately bundled simulations via documented adapters, or external links/embeds only when licence, security and UX permit. Never assume iframe use is allowed or that a code licence covers media, 3D models, datasets and third-party assets.

## API conventions
- Prefix routes with /api/v1.
- Use resource-oriented routes and consistent JSON responses.
- Validate request parameters and bodies.
- Enforce authentication, role and ownership in backend middleware/services.
- Paginate list endpoints.
- Use appropriate HTTP status codes; do not expose production stack traces.
- Document endpoints as implemented.

## Initial data entities
User, StudentProfile, Subject, LearningUnit, Experiment, ExperimentAttempt, Assessment, Question and AssessmentAttempt. Implement only what the first vertical slice requires. Avoid unnecessary personal data.

## Security and privacy
- Keep secrets in environment variables or secret manager.
- Use recognised password hashing if password authentication is selected.
- Configure cookies/tokens securely and document the strategy.
- Apply least-privilege role and ownership checks.
- Rate-limit authentication and abuse-prone endpoints.
- Validate uploads; never trust client-supplied role or student IDs.
- Avoid sensitive payloads in logs.
- Design guardian access around verified relationships and consent.
- Complete a child-data/privacy review before a real student pilot.

## Testing
Unit tests for domain rules; integration tests for API/database/authorisation; component tests for interactive controls; end-to-end test for sign-in, experiment completion and saved progress; manual checks for mobile, keyboard and simulation performance.

## Evolution
Remain a modular monolith while one developer can own it safely. Consider service extraction only for measured independent scaling, deployment cadence, team ownership or reliability isolation. Do not add Kafka, Redis or Kubernetes by default.
