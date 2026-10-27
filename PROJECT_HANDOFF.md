# MotoFix – Project Handoff Document

> **Read this document first before modifying anything in this project.**

---

## A. PROJECT OVERVIEW

**MotoFix** is a consumer-facing two-wheeler repair and servicing platform built as a college full-stack project.

- **What it does:** Connects motorcycle/scooter owners with mechanics for doorstep repairs, service center bookings, and breakdown assistance.
- **Target users:** Two-wheeler owners in India who need repair or servicing services.
- **Current purpose:** Build the complete frontend UI and wire it to a Java/Spring Boot REST API with a MySQL database.
- **Project type:** College full-stack project (frontend: React/Vite, backend: Java Spring Boot, DB: MySQL).

---

## B. CURRENT TECHNOLOGY STACK

### Currently Implemented (Frontend)
| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Language | JavaScript (JSX) |
| Styling | Plain CSS with CSS Custom Properties (no Tailwind, no CSS-in-JS) |
| State Management | React Context API (`AuthContext`, `BookingContext`) |
| Linter | oxlint |
| Package Manager | npm |

### Planned / Not Yet Implemented
| Layer | Technology | Status |
|---|---|---|
| Backend | Java Spring Boot | **Planned** |
| Database | MySQL | **Planned** |
| Auth | JWT via Spring Boot | **Planned** |
| API integration | REST (fetch via `src/services/api.js`) | **Scaffolded, not connected** |

---

## C. CURRENT PROJECT STATUS

### ✅ Implemented and Working

| Area | Status |
|---|---|
| **Homepage (complete)** | Fully implemented — this is the final approved design |
| **Navbar** | Fixed, dark background, MotoFix logo image, nav links (Services, Track Repair, Login), yellow BOOK NOW button, mobile hamburger menu |
| **Hero section** | Grey-to-charcoal gradient, "YOUR BIKE. / OUR FIX." heading, description, BOOK A MECHANIC + BOOK A SERVICE buttons, engine illustration |
| **Footer** | Single bottom bar: tagline left, How it works + Contact links right |
| **Button hover interactions** | BOOK A MECHANIC: yellow glow; BOOK A SERVICE: inverts black; BOOK NOW: yellow glow |
| **Navigation links** | All links are functional anchors; pointer cursor + underline hover on all nav items |
| **AuthContext** | Session state provider with localStorage persistence; ready for API wiring |
| **BookingContext** | Multi-step booking state manager; ready for booking flow components |
| **API service layer** | `src/services/api.js` — all fetch wrappers defined (auth, bookings, bikes, service centers, admin) |
| **Constants** | `src/utils/constants.js` — booking types, repair statuses, bike problems, service types |
| **Helpers** | `src/utils/helpers.js` — date/time/currency formatting, booking ref generator, debounce, etc. |
| **CSS design system** | `src/styles/` — variables, reset, utilities, global |
| **Build** | `npm run build` passes with 0 errors |
| **Responsive** | Mobile hamburger menu; hero and footer adapt for small screens |

### ❌ Not Yet Implemented (Planned)

- Services page / booking flow (Home Repair, Service Center, Breakdown)
- Track Repair page / tracking UI
- Login / Register pages
- User dashboard
- Bike management
- React Router (no routing configured yet — currently single-page, no URL changes)
- Spring Boot backend
- MySQL database
- API integration (all API calls in `api.js` are scaffolded but point to a non-existent backend)

---

## D. FINAL HOMEPAGE DESIGN (DO NOT REDESIGN)

The current homepage is the **final approved design**. Do not change it unless the user explicitly requests a redesign.

### Navbar
- **Background:** Near-black `#0A0A0A`
- **Height:** 60px, fixed to top of viewport
- **Left:** MotoFix logo image (`src/assets/logo-transparent.png`) — distressed yellow block-style "MOTO FIX" with mechanical tool imagery. This is the exact approved logo; do NOT replace with text.
- **Center:** Navigation links — `Services`, `Track Repair`, `Login` — white text at 85% opacity, underline-on-hover
- **Right:** `BOOK NOW` button — yellow pill with golden glow on hover

### Hero Section
- **Background:** Linear gradient top-to-bottom: `#D0D0D0` → `#8E8D8D` → `#464242`
- **Left side — content:**
  - `YOUR BIKE.` — black text, yellow dot
  - `OUR FIX.` — yellow (`#F5C200`) text, black dot
  - Description: "Professional two-wheeler repair and servicing at your doorstep." — white text
  - `BOOK A MECHANIC` — yellow pill button with golden glow hover
  - `BOOK A SERVICE` — white pill button with black border; inverts to black background on hover
- **Right side:** Technical motorcycle engine illustration (`src/assets/engine-illustration.png`) — line-art style, transparent, positioned absolute top-right of hero

### Footer
- **Background:** `#0A0A0A`
- **Height:** 60px fixed-height bar
- **Left:** Italic tagline — *"Your bike. Our fix."* — white at 55% opacity
- **Right:** `How it works` and `Contact` links — white at 85% opacity, underline-on-hover

### Colors
| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#F5C200` | Yellow — CTAs, accents, OUR FIX text |
| `--color-black` | `#0A0A0A` | Navbar, footer, text |
| `--color-charcoal` | `#1C1C1E` | Dark surfaces |
| `--color-white` | `#FFFFFF` | Cards, inputs, button text |
| `--color-surface` | `#F5F5F5` | Page background default |

### Typography
- **Font:** Inter (Google Fonts), fallback: Segoe UI, system-ui, sans-serif
- **Hero heading:** `font-size: clamp(3rem, 5.5vw, 4.8rem)`, `font-weight: 900`
- **Body text:** 16px base

### Hover Interactions
- **BOOK A MECHANIC / BOOK NOW:** `box-shadow: 0 0 14px rgba(245, 194, 0, 0.55), 0 0 4px rgba(245, 194, 0, 0.35)` — no background change, no movement
- **BOOK A SERVICE:** background → black, text → white, no glow
- **Nav links:** underline appears on hover, text brightens to full white

---

## E. BRAND / DESIGN SYSTEM

All design tokens live in [`src/styles/variables.css`](src/styles/variables.css).

### Spacing Scale
```
--space-1: 0.25rem  (4px)
--space-2: 0.5rem   (8px)
--space-3: 0.75rem  (12px)
--space-4: 1rem     (16px)
--space-5: 1.25rem  (20px)
--space-6: 1.5rem   (24px)
--space-8: 2rem     (32px)
--space-10: 2.5rem  (40px)
--space-12: 3rem    (48px)
--space-16: 4rem    (64px)
```

### Border Radius
```
--radius-full: 9999px  (pill buttons)
--radius-lg: 12px
--radius-md: 8px
```

### Transitions
```
--transition-fast: 150ms ease
--transition-base: 250ms ease
```

### Button Rules
- **Primary (yellow):** `background: #F5C200`, `color: #0A0A0A`, `border: 2px solid #F5C200`, pill shape, golden glow on hover — no transform
- **Service (white):** `background: #FFFFFF`, `color: #0A0A0A`, `border: 2px solid #0A0A0A`, inverts on hover — no glow

### Key Assets
| File | Purpose |
|---|---|
| `src/assets/logo-transparent.png` | The exact MotoFix logo — transparent background, yellow distressed block style with crossed tools |
| `src/assets/engine-illustration.png` | Technical motorcycle engine line-art — extracted from reference; transparent background; rendered in Hero |
| `src/assets/logo.png` | Logo with dark background (not used in current UI, kept for reference) |
| `src/assets/hero.png` | Original placeholder (not used in current UI, kept) |
| `src/assets/vite.svg` | Vite icon (not used in current UI, kept) |
| `public/favicon.svg` | Browser tab icon |
| `public/icons.svg` | Icon sprite (available for future use) |

---

## F. CORE PRODUCT CONCEPT

MotoFix offers three service types:

### 1. Home Repair
- A mechanic travels to the customer's location
- Handles minor/simple repairs on-site
- If the repair requires workshop facilities, the bike may be taken to a service center

### 2. Service Center Booking
- Customer books a scheduled service at a service center
- Used for full servicing or major repairs

### 3. Breakdown Assistance
- Customer is stranded and requests immediate roadside assistance
- Customer provides their location and describes the problem

---

## G. PLANNED BOOKING FLOWS (Not Yet Implemented)

### Home Repair Flow
`Bike Details` → `Problem Selection` → `Location` → `Appointment` → `Review & Confirm`

### Service Center Flow
`Service Type` → `Select Center` → `Bike Details` → `Appointment` → `Confirm`

### Breakdown Flow
`Location` → `Problem Description` → `Confirm`

---

## H. PLANNED TRACKING FLOW (Not Yet Implemented)

```
Booking Confirmed
→ Mechanic Assigned
→ Mechanic On The Way
→ Inspection
→ Repair In Progress
→ Completed

(If major repair needed)
→ Service Center
→ Track at Service Center
→ Completed
```

The tracking statuses are pre-defined in `src/utils/constants.js` (`REPAIR_STATUS`).

---

## I. PLANNED USER DASHBOARD (Not Yet Implemented)

Intended sections:
- Current active repair / booking
- My Bikes (list, add, edit)
- Upcoming bookings
- Repair history
- Saved addresses
- Payment history
- Profile & settings

---

## J. DATABASE PLAN (Not Yet Implemented)

Intended MySQL entities:

| Table | Key Columns |
|---|---|
| `users` | id, name, email, password_hash, phone, role |
| `bikes` | id, user_id, brand, model, year, reg_number |
| `bookings` | id, user_id, bike_id, type, status, address, date, time |
| `mechanics` | id, name, phone, location_lat, location_lng, available |
| `repairs` | id, booking_id, mechanic_id, description, cost, status |
| `service_centers` | id, name, address, phone, available_slots |

---

## K. BACKEND PLAN (Not Yet Implemented)

Planned Spring Boot responsibilities:

| Domain | Endpoints |
|---|---|
| Auth | `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me` |
| Bikes | `GET/POST /api/bikes`, `PUT/DELETE /api/bikes/:id` |
| Bookings | `GET/POST /api/bookings`, `GET /api/bookings/:id`, `GET /api/bookings/:id/tracking` |
| Service Centers | `GET /api/service-centers`, `GET /api/service-centers/:id` |
| Admin | `PUT /api/admin/bookings/:id/status`, `PUT /api/admin/bookings/:id/location` |

All API call wrappers already exist in `src/services/api.js` — they just need a live backend to connect to.

---

## L. FILE STRUCTURE

```
motofix/
├── public/
│   ├── favicon.svg          # Browser tab icon
│   ├── icons.svg            # SVG icon sprite (for future use)
│   ├── logo.png             # Logo on dark background (reference)
│   └── logo-transparent.png # Logo with transparent bg (future public use)
│
├── src/
│   ├── App.jsx              # Root component: wraps providers + layout
│   ├── main.jsx             # React entry point (renders <App>)
│   │
│   ├── assets/
│   │   ├── engine-illustration.png  # Motorcycle engine line-art for Hero
│   │   ├── logo-transparent.png     # MotoFix logo (used in Navbar)
│   │   ├── logo.png                 # Logo on dark bg (kept, not in UI)
│   │   ├── hero.png                 # Original placeholder (kept, not in UI)
│   │   └── vite.svg                 # Vite icon (kept, not in UI)
│   │
│   ├── components/
│   │   ├── home/
│   │   │   ├── Hero.jsx     # Hero section — final approved design
│   │   │   └── Hero.css     # Hero-specific styles
│   │   ├── layout/
│   │   │   ├── Navbar.jsx   # Top nav: logo, links, BOOK NOW, mobile menu
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.jsx   # Bottom bar: tagline + nav links
│   │   │   └── Footer.css
│   │   ├── booking/         # Empty — booking flow components go here
│   │   ├── common/          # Empty — shared UI components go here
│   │   └── tracking/        # Empty — tracking UI components go here
│   │
│   ├── context/
│   │   ├── AuthContext.jsx   # User auth state (localStorage persistence)
│   │   └── BookingContext.jsx# Multi-step booking wizard state
│   │
│   ├── hooks/               # Empty — custom hooks go here
│   │
│   ├── pages/               # Empty — page-level route components go here
│   │
│   ├── services/
│   │   └── api.js           # All REST API calls (scaffolded, backend not connected)
│   │
│   ├── styles/
│   │   ├── global.css       # Entry CSS: imports all layers below
│   │   ├── variables.css    # All CSS custom properties / design tokens
│   │   ├── reset.css        # CSS reset + base element styles
│   │   └── utilities.css    # Utility classes: .btn, .card, .container, grid, etc.
│   │
│   └── utils/
│       ├── constants.js     # App-wide constants: booking types, statuses, problems
│       └── helpers.js       # Pure utility functions: format date/time/currency, etc.
│
├── index.html               # HTML entry point
├── vite.config.js           # Vite config: React plugin, /api proxy to :8080, @ alias
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked dependency tree
├── .env.local               # Local env vars (VITE_API_BASE_URL) — do not commit
├── .gitignore               # node_modules, dist, *.local, .DS_Store excluded
├── .oxlintrc.json           # oxlint configuration
├── README.md                # Quick-start guide
├── PROJECT_HANDOFF.md       # This document — full context for new agents
└── AGENTS.md                # Rules for AI coding agents
```

---

## M. RUNNING THE PROJECT

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
# Opens at http://localhost:5173
```

### Expose dev server to another device on the same network
```bash
npm run dev -- --host
# Shows a network URL like http://192.168.x.x:5173
```

### Production build
```bash
npm run build
# Output in dist/
```

### Preview production build locally
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

---

## N. ENVIRONMENT VARIABLES

The file `.env.local` is used for local development. It is **not committed** to version control.

| Variable | Purpose | Example value |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for the Spring Boot backend API | `http://localhost:8080/api` |

When setting up on a new machine, create `.env.local` in the project root:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

If `VITE_API_BASE_URL` is not set, `src/utils/constants.js` falls back to `http://localhost:8080/api`.

> **Note:** The Vite dev server also proxies all `/api/*` requests to `http://localhost:8080` automatically (configured in `vite.config.js`).

---

## O. KNOWN ISSUES / LIMITATIONS

1. **No routing:** React Router is not installed. All navigation links are `href` anchors. Clicking Services, Track Repair, Login, How it works, or Contact scrolls to anchor sections or does nothing (sections not yet built). No URL-based navigation exists.

2. **Backend not connected:** `api.js` is fully scaffolded but the Spring Boot backend does not exist yet. All API calls will fail until the backend is built.

3. **Booking flow not built:** The `BookingContext` manages state, but no booking step components exist. The BOOK A MECHANIC and BOOK A SERVICE buttons link to `#book` which is a placeholder anchor.

4. **oxlint warnings (non-blocking):**
   - `BOOKING_TYPES` is imported in `BookingContext.jsx` but only used in the initial state definition — valid, not a real issue.
   - `useBooking` and `useAuth` exported from context files — expected pattern for React context hooks.
   - `setUser` called inside `useEffect` in `AuthContext` — intended for session re-hydration on mount; safe.

5. **Unused assets:** `src/assets/hero.png` and `src/assets/vite.svg` are not referenced in the current UI. They are kept in case they are needed later.

6. **Logo asset size:** `src/assets/logo-transparent.png` is ~183KB uncompressed. Consider compressing or converting to WebP in a future optimization pass.

---

## P. RECOMMENDED NEXT DEVELOPMENT STEPS

In priority order:

1. **Install React Router** — `npm install react-router-dom` — set up routes for `/`, `/services`, `/book`, `/track`, `/login`
2. **Create page components** in `src/pages/`:
   - `HomePage.jsx` (already rendered in App.jsx via Hero)
   - `ServicesPage.jsx`
   - `BookingPage.jsx`
   - `TrackRepairPage.jsx`
   - `LoginPage.jsx`
3. **Build the booking flow UI** in `src/components/booking/` using the existing `BookingContext`
4. **Build the Track Repair UI** in `src/components/tracking/` using `REPAIR_STATUS` from constants
5. **Build Login / Register forms** wired to `AuthContext`
6. **Build the Spring Boot backend** (`/api/auth`, `/api/bookings`, `/api/bikes`, `/api/service-centers`)
7. **Set up MySQL database** with the planned schema (see Section J)
8. **Connect frontend API calls** — `api.js` is ready; enable endpoints as the backend is built
9. **Build the user dashboard** — bookings history, bike management, profile
10. **Deployment** — Frontend to Vercel/Netlify, Backend to Railway/Render/VPS
