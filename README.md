# VIDYAQUEST

<p align="center">
  <strong>Learn. Play. Explore. Achieve.</strong><br/>
  AI-assisted learning platform with interactive 3D virtual laboratories, gamified adventure worlds, and role-based portals for Students, Parents, and Admins.
</p>

---

## What's Inside

This repository contains the VidyaQuest web platform and its 3D/gamification modules:

| Folder | Description |
|---|---|
| [`vidyaquest/`](vidyaquest) | Primary **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4** application (Landing page, Role-Based Auth, Student Glass CRM, Virtual World, 3D Virtual Labs, Parent Portal, Admin Console) |
| [`gamification/`](gamification) | Gamification world-map, missions, streak, and avatar system (Next.js frontend + Express/MongoDB modular-monolith backend) |
| [`VidyaQuest-React-ThreeJS/`](VidyaQuest-React-ThreeJS) | Standalone **Vite + React Three Fiber** 3D `.glb` Ohm's Law circuit viewer |
| [`docs/`](docs) | Product Requirements ([PRD](docs/PRD.md)), [Architecture](docs/ARCHITECTURE.md), [Roadmap](docs/DEVELOPMENT_ROADMAP.md), and [Decisions](docs/DECISIONS.md) |

---

## Implemented Features

### 1. Role-Based Authentication & Authorization (`/login`)
- Signed HTTP-only session cookies (`vq_session`, HMAC-SHA256) with `scrypt` password verification and server-side route guards (`requireRole`).
- Enforces portal-role matching across **Student** (`/student`), **Parent** (`/parent`), and **Admin** (`/admin`), with `/unauthorized` handling for cross-role access.
- Demo accounts available via one-click **Use demo** on `/login`:
  - **Student**: `student@vidyaquest.edu` / `Student@123`
  - **Parent**: `parent@vidyaquest.edu` / `Parent@123`
  - **Admin**: `admin@vidyaquest.edu` / `Admin@123`

### 2. Student Portal (`/student`) — Glassmorphic CRM Workspace
- **Overview**: Pastel frosted-glass stat cards, interactive Hours Spent chart, Performance gauge, Courses & Learning Worlds, weekly calendar strip, and interactive Task List with subtasks.
- **Virtual World**: Embedded interactive RPG Overworld Map (`GameWorldFlow` + `/world` fullscreen route) with subject realms, missions, and XP rewards.
- **Virtual Labs**:
  - **Interactive 3D Lab Studio** (8 live WebGL Three.js simulations in `vidyaquest/public/labs/`):
    - *Biology*: 3D Human Heart Model, Leaf Peel Stomata 3D Lab, DNA Double Helix 3D
    - *Chemistry*: 3D Acid-Base Titration Lab, Properties of Acids & Bases 3D
    - *Physics*: Ohm's Law 3D Circuit Workbench, 3D Projectile Motion & Gravity
    - *Astronomy*: 3D Solar System & Planetary Orbits
  - **Open-Source 3D Model Library**: 20 verified open-source / Creative Commons / public-domain 3D study models segregated across Physics, Chemistry, Biology, Astronomy, and Engineering & Math.
- **QuestBot 3D**: Interactive drag-to-rotate 3D voxel chatbot docked in the Student Portal and AI Quest Guide.
- **Assignments, Opportunity Radar, Skill Passport, File Storage, Inbox & Accessibility Settings**.

### 3. Parent Portal (`/parent`)
- Child switcher (`Aarav Sharma`, `Anika Sharma`) with interactive SVG analytics:
  - Smooth dual-series **Learning & Virtual Lab Hours** area chart
  - **Subject Mastery Radar** chart, **Time Distribution** donut chart, **8-Week Consistency Heatmap**, and **Subject XP** bars
  - Virtual Lab & AI Hint activity log and **Parental Controls** (daily screen limit, safe Socratic AI mode, weekly digest, Opportunity Radar alerts).

### 4. Admin Console (`/admin`)
- **Executive Overview**: Platform growth area chart, RBAC role distribution donut, 3D lab sessions by subject, and cohort mastery radar.
- **Users & RBAC**: Searchable user directory with role filters and account status controls.
- **Curriculum & 3D Labs**: Publish/draft governance over the 20 open-source 3D models.
- **Analytics & Cohorts** + **Security & Session Audit Log**.

---

## Quick Start

### Main Web App (`vidyaquest/`)

```bash
cd vidyaquest
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or go straight to [http://localhost:3000/login](http://localhost:3000/login)).

Available scripts in `vidyaquest/`:
- `npm run dev` — Start Next.js development server
- `npm run build` — Create production build
- `npm run typecheck` — Run `tsc --noEmit`
- `npm run lint` — Run ESLint

### Standalone 3D GLB Viewer (`VidyaQuest-React-ThreeJS/`)

```bash
cd VidyaQuest-React-ThreeJS
npm install --legacy-peer-deps
npm run dev
```

---

## Project Documentation & Guidelines

- [Product Requirements Document](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development Roadmap](docs/DEVELOPMENT_ROADMAP.md)
- [Architecture Decision Log](docs/DECISIONS.md)
- [Landing Page Design Spec](docs/landingpage.md)
- [AI Coding-Agent Instructions](AGENTS.md)

Never commit `.env` files, real credentials, or student data.

---

<p align="center">Built to make learning interactive, inclusive, and curiosity-driven.</p>
