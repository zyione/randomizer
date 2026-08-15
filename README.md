# 🎲 Randomizer Pro

A sleek, minimal, dark-themed decision-maker and randomizer web application built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, and the **Web Audio API**.

Designed with a modern analytics dashboard aesthetic (near-black background, soft card panels, vibrant cyan/teal glow accents, smooth 60fps animations, and zero-latency sound synthesis).

---

## ✨ Features

### 🎰 5 Pluggable Animation Engines
Choose your favorite animation style from the dashboard or settings sandbox:
1. **Slot Machine Reel Spin** — Vertical blur reel with spring easing and mechanical tick sounds.
2. **3D Card Flip & Shuffle** — 3D perspective card deck with 180° flip-to-reveal.
3. **Matrix / Glitch Scramble Decode** — Cyberpunk rapid character decryption with high-frequency digital chirps.
4. **Particle Burst & Glow Pulse** — Multicolored HTML5 Canvas fireworks with a pulsating neon halo.
5. **Roulette Strip Ticker** — Horizontal CSGO/casino style ticker strip with center pointer needles and deceleration physics.

### 🎡 Interactive Circular Prize Wheel
- High-DPI HTML5 Canvas prize wheel.
- Auto-scaling text sizing and slice geometry supporting 2 to 50+ items.
- Smooth quintic ease-out rotational physics with needle bounce, slice tick audio triggers, and victory confetti celebration.

### ⚡ Dual Randomize Mode
- **Pick 2 from the Same List**: Samples a distinct pair without replacement or duplicates.
- **Combo Pick (List A + List B)**: Randomizes one item from List A and one from List B side-by-side with synchronized animations (e.g. Activity + Location, Person + Role).

### 🌐 Multi-API Category Hub
Pluggable adapters for fetching fresh live items directly from public APIs with instant offline fallback banks:
- 📜 **Quotes**: Motivational & philosophical quotes with authors.
- ❓ **Trivia**: Multi-category quiz questions with answers and categories.
- ⚡ **Pokémon**: Pokémon species with generation and types (via PokéAPI).
- 💡 **Advice**: Practical daily wisdom (via Advice Slip).
- 🎯 **Activities**: Fun recreational hobbies and ideas.
- 🎲 **Dice & Numbers**: D20 dice rolls and customizable numeric ranges.

### 📁 CSV & TXT File Import / Export
- Drag & Drop or paste `.csv` and `.txt` files with automatic whitespace trimming and duplicate detection.
- One-click export to **CSV**, **JSON**, or **TXT**.

### 🔊 Procedural Web Audio API Sound Synthesizer
- 100% locally synthesized procedural audio:
  - Mechanical clicks & ticks
  - Filtered whoosh spin sweeps
  - Glitch decryption chirps
  - Card flip snaps
  - Celebratory victory fanfare chords
- **Zero MP3 downloads**, zero 404s, and completely offline-capable.

### 📊 History & Frequency Analytics
- Timestamped timeline of recent picks.
- One-click copy result to clipboard.
- Frequency breakdown visualizer highlighting your most frequently picked items.

### ⌨️ Keyboard Shortcuts
- Press `[SPACE]` anywhere on the dashboard to trigger the active randomizer.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Audio API (Native browser synthesis)
- **Persistence**: LocalStorage (Local-first architecture)

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.17+` (or Node.js `v20+` / `v22+` / `v26+`)
- npm or pnpm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
randomizer/
├── src/
│   ├── app/
│   │   ├── globals.css           # 3D transforms, theme styles, scrollbars
│   │   ├── layout.tsx            # Metadata, fonts, and root container
│   │   └── page.tsx              # Main dashboard view
│   ├── components/
│   │   ├── Header.tsx            # Navigation, mode selector, quick drawers
│   │   ├── animations/           # 5 swappable animation engines
│   │   │   ├── AnimationContainer.tsx
│   │   │   ├── SlotMachineAnimation.tsx
│   │   │   ├── CardFlipAnimation.tsx
│   │   │   ├── ScrambleTextAnimation.tsx
│   │   │   ├── ParticleBurstAnimation.tsx
│   │   │   └── RouletteStripAnimation.tsx
│   │   ├── wheel/
│   │   │   └── PrizeWheel.tsx    # Canvas prize wheel with physics & audio
│   │   ├── dual/
│   │   │   └── DualRandomizer.tsx # Side-by-side synchronized dual picker
│   │   ├── list-manager/
│   │   │   ├── ListManagerDrawer.tsx
│   │   │   └── ListModal.tsx     # List creator & CSV/TXT file importer
│   │   ├── api-modal/
│   │   │   └── ApiCategoryModal.tsx # Public API hub discovery modal
│   │   ├── history/
│   │   │   └── HistoryDrawer.tsx # Pick history timeline & frequency charts
│   │   └── settings/
│   │       └── SettingsModal.tsx # Animation sandbox preview & audio controls
│   ├── lib/
│   │   ├── audio.ts              # Web Audio API procedural synthesizer
│   │   ├── importers.ts          # CSV/TXT parser and file exporters
│   │   ├── storage.ts            # LocalStorage persistence & default presets
│   │   └── api-adapters/         # Pluggable API adapters with fallback banks
│   └── types/
│       └── randomizer.ts         # TypeScript definitions
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📄 License

MIT License. Feel free to use, modify, and distribute for personal or commercial projects.
