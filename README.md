# Learnix

Turn your syllabus into an interactive, RPG-style learning journey. A premium, frontend-only React app — landing page, onboarding wizard, gamified dashboard, and a React Flow skill tree with XP, levels, and achievements. Everything runs on mock data, no backend required.

## Stack

- React 19 + Vite
- Tailwind CSS (custom dark theme — emerald / blue / purple / gold)
- React Router 7
- Framer Motion (page transitions, hover states, counters)
- @xyflow/react (the skill tree visualization)
- Recharts (analytics dashboard)
- Lucide React (icons)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `/` is the landing page, `/onboarding` is the setup wizard, and `/app` is the dashboard (you can jump straight there via "Explore Demo" on the landing page).

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint       # oxlint
```

## Structure

```
src/
  animations/   Shared Framer Motion variants
  components/
    cards/      SubjectCard, AchievementCard, ResourceCard, LeaderboardCard, ProfileCard, AnalyticsCard
    common/     SearchBar, NotificationsPanel, FloatingParticles, BackgroundGrid, ThemeToggle, Breadcrumb, AnimatedCounter, HeroTreeIllustration
    layout/     Sidebar, Navbar
    skilltree/  SkillNode (custom React Flow node), TopicDrawer
    ui/         Button, Card, Badge, ProgressRing, XPBar, Drawer, Tabs, ChipSelect
  contexts/     AppContext — student profile + onboarding state
  data/         Mock JSON: student, subjects, topics, resources, achievements,
                leaderboard, analytics, progress, bookmarks, onboarding options
  hooks/        (reserved for future custom hooks)
  layouts/      PublicLayout, DashboardLayout
  pages/        Landing, Onboarding (+ onboarding/ steps), Dashboard, Subjects,
                SkillTree, Resources, Achievements, Analytics, Leaderboard,
                Bookmarks, Profile, Settings
  utils/        cn (class merge), xp (accent tokens, formatting), iconMap
```

## Notes on the mock data

All content lives in `src/data/*.json` and is designed to be swapped for a real
API later without touching component code — every page imports its data by
name (`import subjects from '../data/subjects.json'`) rather than reaching
into a global store.

The flagship skill tree (`topics.json`) models a "Web Development" path:
HTML → CSS → JavaScript → (DOM / ES6+ / Git) → React Fundamentals → Components
→ State & Hooks → (Context / Router / Testing) → Redux Toolkit → **Next.js
(boss level)**. Node status (`locked` / `unlocked` / `current` / `completed`)
and edge color both derive from this file.

## Extending it

- Add a new subject's tree by adding topics to `topics.json` with a new
  `subjectId` and wiring a subject filter into `SkillTree.jsx`.
- Swap any mock JSON for a `fetch`/React Query call — components already
  consume plain arrays/objects, so the shape is the only contract to keep.
- The design tokens (colors, glow shadows, fonts) live in `tailwind.config.js`
  under `theme.extend` — change them once, everything updates.
