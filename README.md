# MotoFix

React + Vite consumer-facing two-wheeler repair and servicing platform.

> **New to this project?** Read [`PROJECT_HANDOFF.md`](PROJECT_HANDOFF.md) for the full project context, design rules, and development roadmap.
> **AI agent?** Read [`AGENTS.md`](AGENTS.md) before making any changes.

---

## What is MotoFix?

MotoFix is a college full-stack project that connects motorcycle and scooter owners with mechanics. It offers:

- **Home Repair** — mechanic comes to you
- **Service Center Booking** — schedule a service center visit
- **Breakdown Assistance** — roadside help when you're stranded

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 |
| Build tool | Vite 8 |
| Styling | Plain CSS with CSS Custom Properties |
| State | React Context API |
| Linter | oxlint |
| Backend *(planned)* | Java Spring Boot |
| Database *(planned)* | MySQL |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install

```bash
npm install
```

### Set up environment variables

Create a `.env.local` file in the project root:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

This points to the Spring Boot backend. If the backend isn't running, the API calls won't work but the UI will still load.

### Run development server

```bash
npm run dev
# App runs at http://localhost:5173
```

To expose to other devices on the same network:

```bash
npm run dev -- --host
```

### Build for production

```bash
npm run build
# Output goes to dist/
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
motofix/
├── public/                  # Static files served as-is
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   │
│   ├── assets/              # Images and icons used in components
│   │   ├── logo-transparent.png   # MotoFix logo (used in Navbar)
│   │   └── engine-illustration.png # Hero motorcycle illustration
│   │
│   ├── components/
│   │   ├── home/            # Hero section (homepage — final design)
│   │   ├── layout/          # Navbar, Footer
│   │   ├── booking/         # (empty — booking flow components go here)
│   │   ├── common/          # (empty — shared UI components go here)
│   │   └── tracking/        # (empty — tracking UI goes here)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx  # User authentication state
│   │   └── BookingContext.jsx # Multi-step booking wizard state
│   │
│   ├── pages/               # (empty — page components go here)
│   ├── hooks/               # (empty — custom hooks go here)
│   │
│   ├── services/
│   │   └── api.js           # REST API calls (scaffolded, backend not connected yet)
│   │
│   ├── styles/
│   │   ├── global.css       # CSS entry point
│   │   ├── variables.css    # Design tokens
│   │   ├── reset.css        # CSS reset
│   │   └── utilities.css    # Utility classes
│   │
│   └── utils/
│       ├── constants.js     # App-wide constants
│       └── helpers.js       # Pure utility functions
│
├── index.html
├── vite.config.js           # Vite config (React plugin, /api proxy, @ alias)
├── package.json
├── package-lock.json
├── .env.local               # Local env vars (not committed)
├── .gitignore
├── .oxlintrc.json
├── PROJECT_HANDOFF.md       # Full project context — read this first
└── AGENTS.md                # Rules for AI coding agents
```

---

## Current Status

The **homepage is fully implemented** and is the final approved design:
- Navbar with MotoFix logo, navigation links, and BOOK NOW button
- Hero with "YOUR BIKE. / OUR FIX." heading, description, buttons, and engine illustration
- Footer with tagline and navigation links

Everything else (pages, booking flows, tracking, login, backend) is **planned but not yet built**.

See [`PROJECT_HANDOFF.md`](PROJECT_HANDOFF.md) for the full picture.

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#F5C200` | MotoFix Yellow — CTAs, accents |
| `--color-black` | `#0A0A0A` | Navbar, footer, text |
| `--color-charcoal` | `#1C1C1E` | Dark surfaces |
| `--color-white` | `#FFFFFF` | Cards, inputs |
| `--color-surface` | `#F5F5F5` | Page background |
