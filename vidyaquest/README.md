# VidyaQuest Web App

Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 frontend and role-based portal application for VidyaQuest.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | VidyaQuest landing page |
| `/login` | Public | Role-based login (Student, Parent, Admin) |
| `/student` | `student` | Frosted-glass Student CRM, Virtual World, 3D Virtual Labs & QuestBot 3D |
| `/world` | Public / Student | Fullscreen gamified adventure world map |
| `/parent` | `parent` | Parent analytics dashboard & parental controls |
| `/admin` | `admin` | Admin executive console, RBAC directory & 3D lab governance |
| `/unauthorized` | Authenticated | Access restricted notice on role mismatch |

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run typecheck` — Run TypeScript type checking (`tsc --noEmit`)
- `npm run lint` — Run ESLint
- `npm run format` — Format TypeScript/TSX files with Prettier
