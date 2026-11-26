# VIDYAQUEST

<p align="center">
  <strong>Learn. Experiment. Grow.</strong><br/>
  AI-assisted learning with interactive virtual laboratories.
</p>

VIDYAQUEST aims to help students connect academic concepts with practical learning through structured content, virtual experiments, guided explanations and progress tracking.

> **Development status:** Foundation stage. Features described here are product goals unless explicitly marked implemented. The first release will be a focused student-learning experience with one complete Physics experiment.

## Product modules

- **Student learning:** subjects, chapters, learning units and progress.
- **Virtual labs:** interactive Physics first, followed by Chemistry and Biology.
- **AI tutor (later phase):** Gemini-powered explanations grounded in approved curriculum sources using RAG.
- **Assessment and gamification:** knowledge checks, feedback and achievements.
- **Teacher and institution portal (later phase):** learning activities and class-level insights.
- **Parent/guardian portal (later phase):** verified, consent-based student progress reports.
- **Offline learning (later phase):** explicitly cached learning resources and sync.

## Initial technology direction

| Layer | Proposed baseline |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB |
| Virtual labs | React Three Fiber for custom 3D; reviewed external simulations through adapters |
| AI (later) | Gemini API behind a provider boundary; RAG over approved curriculum material |
| Testing | Unit, API integration and browser end-to-end tests |

The project uses a **modular monolith**: one backend application organised into domain modules, with a separate Next.js frontend. Distributed services and extra infrastructure will be considered only when justified.

## Architecture overview

Student / teacher / guardian / admin users access the Next.js application. The frontend calls the Express API under /api/v1. The API is divided into identity, users, catalog, labs and progress modules, with AI tutor and guardian modules planned for later phases. MongoDB is the initial persistence layer.

## Business model direction

Potential future revenue channels include advertising, paid virtual labs, government collaboration, third-party technology partnerships, paid services for schools/colleges and optional parent-facing performance reports. These are proposed models, not active services.

## Project documentation

- [Product Requirements Document](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development Roadmap](docs/DEVELOPMENT_ROADMAP.md)
- [Architecture Decision Log](docs/DECISIONS.md)
- [AI coding-agent instructions](AGENTS.md)

## Development workflow

1. Work from a GitHub Issue with clear acceptance criteria.
2. Create a focused branch; do not commit directly to main.
3. Implement one scoped change and add tests.
4. Open a pull request using the repository template.
5. Review, test and merge only after checks pass.

See [AGENTS.md](AGENTS.md) for coding-agent rules. Copy the environment template to a local environment file when application scaffolding is added. Never commit real credentials or student data.

## Current milestone

**Phase 0 — Project foundation.** The next implementation milestone is Phase 1: scaffold the frontend and backend, configure environment validation, database connectivity, health checks and CI.

---

<p align="center">Built with ❤️ to make learning more interactive, accessible and meaningful.</p>
