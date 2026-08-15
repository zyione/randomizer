# Prompt: Build Plan + ERD + Implementation Guide for "Randomizer" App

> Copy everything below into a fresh chat with your AI assistant of choice (Claude, ChatGPT, etc.) to get a full plan, ERD, and step-by-step implementation guide.

---

## Role

You are a senior full-stack architect. Produce a **complete, fully detailed build plan** for the app described below, including a **database ERD**, **system architecture**, and a **step-by-step implementation guide**. Do not write full application code yet — this is a planning + architecture pass. End with a proposed file/folder structure and a phased task checklist I can hand to a coding agent afterward.

---

## Project Overview

**Name (working title):** Randomizer

**Concept:** A minimal, sleek, dark-themed randomizer web app. Visual inspiration: a dark dashboard UI (near-black background, soft card panels, teal/cyan accent color, thin fonts, subtle glow, rounded corners, generous whitespace — think analytics dashboard aesthetic, not a garish "random.org" look).

**Core idea:** The user picks or builds a list of items (manually, via CSV/text import, or pulled from a connected public API/category), then triggers a randomizer to pick one (or two, simultaneously, from one or two lists) with a satisfying animation, or spins a circular prize wheel instead.

---

## Functional Requirements

### 1. Randomizer core
- User can create/manage multiple **lists** of items.
- Items can be added manually, imported from a file, or pulled from a connected API category.
- "Randomize" button picks one random item from the active list with an animation, then displays the result clearly.
- **Dual randomize mode:** ability to randomize **two things at once** — either two picks from the same list (no repeat) or one pick each from two different lists, shown side by side.
- Keep a short **history** of recent results (session-based is fine, persisted is a bonus).

### 2. Animation system (must support ALL of these, user-selectable in a settings panel)
Build this as a pluggable "animation strategy" so new ones can be added later. Include all of the following, selectable from the UI itself (not hardcoded to one):
1. **Slot machine reel spin** — vertical reel(s) blur-scroll and land on the result.
2. **Card flip / shuffle** — cards shuffle/flip and reveal the winner face-up.
3. **Scramble / glitch text decode** — text rapidly cycles random characters/items before locking to the result (like a "decrypting" effect).
4. **Particle burst / glow pulse** — result appears with a particle explosion + glow pulse around it.
5. **Roulette-style spin** — a horizontal/linear roulette strip spins and slows to a stop on the result (distinct from the circular wheel feature below).

Each should be implemented as an isolated, swappable component/module so the user can preview and pick their favorite in Settings, and so more can be added later without touching core logic.

### 3. Circular wheel mode
- A separate **spinning prize wheel** (pie-slice wheel, one slice per item) as an alternative selection mode alongside the standard "randomize" button flow.
- Wheel should support a reasonable number of items (auto-adjust slice size/label handling for longer lists) and spin-to-stop physics (ease-out spin, pointer lands on winner).

### 4. Multi-API "category" integration
- Support connecting to **multiple external public APIs**, each acting as a "theme/category" the user can pull random items from (e.g., a quotes API, a trivia API, a movie API, a dog-breed API, a name generator API, etc. — pick reasonable free/public ones and list them as recommended default integrations).
- Design this as a **pluggable adapter pattern**: a common interface (e.g., `fetchRandomItem(category, params)` / `fetchList(category, params)`) so new API sources can be added by writing a new adapter, not rearchitecting the app.
- Clarify which APIs are safe to call **directly from the browser** (CORS-friendly, no key needed) vs. which need a **server-side proxy** (to hide API keys or bypass CORS) — and design the backend accordingly. Prefer the free/no-key/CORS-friendly option whenever possible to minimize backend need.

### 5. Import from file
- Allow importing a custom list from a text file: support both **CSV** and **newline-separated (.txt)** formats.
- Include basic validation/cleanup (trim whitespace, remove empty lines/duplicates, handle quoted CSV fields).

### 6. Settings
- Animation style picker (from section 2).
- Toggle for dual-randomize mode.
- Manage connected API categories.
- Manage saved lists (create/edit/delete/import/export).

---

## Non-Functional / Technical Constraints

- **Cost:** Everything must run on **free tiers only** — no paid services, no credit-card-required tiers where avoidable.
- **Backend usage:** Keep this as **lean as possible**. Only introduce a backend/database if genuinely needed (e.g., to store user lists persistently across devices, or to proxy an API key safely). Since this will only have a handful of users, prefer **client-side/local storage first**, and add backend pieces only for the specific features that truly require them (API key proxying, optional persistence/sharing). Explicitly call out in the plan *which* features need a backend and *why*, versus which can stay 100% client-side.
- **Stack:**
  - Frontend: React-based (Next.js) — chosen so the same project can optionally grow a lightweight backend (API routes) only where required, while still being deployable as a mostly-static app.
  - Backend/DB (only for the pieces that need it): Supabase (Postgres + Auth + free tier) for persistence and/or Next.js API routes as a thin proxy layer for any API keys.
- **Deployment (must be free):**
  - Frontend: **Vercel** or **Netlify** free tier.
  - Backend/DB (if used): **Supabase** or **Firebase** free tier.
  - Explicitly document the free-tier limits of whichever services are chosen (request limits, storage caps, sleep/cold-start behavior) so I know what I'm working within.
- **Local-first testing (critical):** The plan and implementation guide must be structured so that **every feature is fully testable on localhost before any deployment step**. Include:
  - Local dev setup instructions (env vars, `.env.local` handling, local Supabase emulation or a free-tier dev project used only for local testing).
  - A clear checklist of what to verify locally (all animations, wheel, dual-randomize, API pulls, file import) before touching deployment.
  - Deployment should be the **final phase**, only after local sign-off.

---

## Deliverables I want from you (the AI)

1. **Feature summary table** (feature, requires backend? yes/no, why).
2. **System architecture diagram** (described in text/ASCII or Mermaid) showing frontend, optional backend/proxy layer, external APIs, and database.
3. **Full ERD** (Mermaid `erDiagram` syntax) covering at minimum: Lists, Items, Categories/API sources, Settings/Preferences, and History — with fields, types, and relationships. Note which tables are actually needed given the "local-first, minimal backend" constraint.
4. **Tech stack recommendation**, finalized, with reasoning and links to each service's free-tier docs.
5. **Recommended default free/public APIs** to integrate as starter categories (with notes on which need a server-side proxy).
6. **Folder/file structure** for the project.
7. **Phased implementation plan**, ordered so that local testability comes first for each phase:
   - Phase 0: local project scaffold + dev environment
   - Phase 1: core randomizer + local storage lists (no backend)
   - Phase 2: animation system (all 5 styles) + settings picker
   - Phase 3: wheel mode
   - Phase 4: file import (CSV/txt)
   - Phase 5: dual-randomize mode
   - Phase 6: API adapter pattern + first 2–3 integrated APIs
   - Phase 7: (only if needed) backend/DB for persistence or key-proxying
   - Phase 8: local QA checklist / full test pass
   - Phase 9: deployment to Vercel/Netlify + Supabase (free tier), with step-by-step setup
8. **UI direction notes**: dark near-black theme, teal/cyan accent, card-based panels, minimal chrome, smooth transitions — consistent across all animation styles and the wheel.

Ask me clarifying questions only if something is truly ambiguous — otherwise make reasonable assumptions and state them explicitly at the top of your response.
