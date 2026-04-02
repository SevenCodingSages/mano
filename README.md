# Mano — मनो
### *Mind · Intellect · Thought*

> A free, local-first mind mapping and logic flow tool for researchers, authors, and game designers.

![Free forever](https://img.shields.io/badge/Free-forever-E8651A?style=flat-square) ![No login](https://img.shields.io/badge/No%20login-required-1D9E75?style=flat-square) ![Works offline](https://img.shields.io/badge/Works-offline-1D9E75?style=flat-square) ![React](https://img.shields.io/badge/React%2018-Vite-378ADD?style=flat-square) ![MIT](https://img.shields.io/badge/Licence-MIT-888780?style=flat-square)

**Live demo:** https://sevencodingsages.github.io/mano

Save your maps as `.mano` files — open them anytime, no account needed.

---

## What is Mano?

Mano (Sanskrit: मनो, meaning *mind* and *intellect*) is a browser-based mind mapping and logic flow tool. It runs entirely in your browser — no server, no account, no subscription. Your maps are saved as portable `.mano` files that you own completely.

Unlike most mind mapping tools, Mano treats **logic and reasoning structure** as seriously as visual layout. Nodes can carry typed relationships (causes, supports, contradicts, precedes), rich text notes, and citation metadata — making it genuinely useful for structured intellectual work, not just brainstorming.

---

## Who is it for?

| Researchers | Authors | Game designers |
|---|---|---|
| Map papers and concepts, link citations to ideas, identify research gaps, export bibliographies in APA, MLA, or Chicago. | Plan story arcs, world-building, character journeys, and narrative logic flows on a single infinite canvas. | Sketch skill trees, level design plans, player progression systems, and branching decision flows. |

---

## Key features

- Infinite canvas with pan, zoom, and minimap navigation
- Multiple node shapes — rounded rectangle, diamond, ellipse, hexagon, cylinder, and more
- Typed edge relationships — causes, supports, contradicts, precedes, and custom labels
- Rich text notes panel per node (bold, headings, lists, links)
- Affinity containers — group nodes into named, coloured clusters
- Citation cards — structured reference widgets with bibliography export (APA / MLA / Chicago)
- Auto-layout — top-down tree, left-right tree, or force-directed arrangement via elkjs
- Export to PNG, JPEG, PDF at A0–A4 sizes, full canvas or selection only
- Save and re-open maps as `.mano` JSON files — open format, always yours
- Full undo/redo history, keyboard shortcuts, dark and light mode
- Starter templates — Research Map, Story Outline, Game Design skill tree

---

## Getting started

### Option 1 — Use the live version

Open [sevencodingsages.github.io/mano](https://sevencodingsages.github.io/mano) in any modern browser. No installation needed.

### Option 2 — Run locally

```bash
git clone https://github.com/SevenCodingSages/mano.git
cd mano
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Option 3 — Build for production

```bash
npm run build
```

The `dist/` folder is a self-contained static site. Place it anywhere — a USB drive, Dropbox, a web server. Open `index.html` directly in a browser.

---

## The .mano file format

Maps are saved as human-readable JSON with the `.mano` extension. The format is open and documented — you are never locked in. Place `.mano` files in any cloud-synced folder (Google Drive, Dropbox) for backup without any account integration in the app itself.

---

## Built with

- **React 18 + Vite** — framework and build tooling
- **React Flow** — graph canvas and interaction
- **Tailwind CSS** — styling
- **TipTap** — rich text editor for node notes
- **elkjs** — automatic graph layout
- **localforage** — local IndexedDB persistence
- **html2canvas + jsPDF** — image and PDF export

---

## Roadmap

- **v1.0** — current release (core canvas, citation widget, export)
- **v1.1** — bug fixes and community feedback
- **v2.0** — additional colour themes, PWA offline support, Markdown import


---

## Contributing

Mano is open source and welcomes contributions. Please open an issue before submitting a pull request so we can discuss the change. Bug reports, feature suggestions, and feedback from researchers and educators are especially welcome.

---

## Licence

This project is licensed under the [MIT Licence](https://opensource.org/licenses/MIT).

Free to use, modify, and distribute for any purpose. Attribution appreciated.

For enquiries, contact [saptarshi.samanta@iitg.ac.in](mailto:saptarshi.samanta@iitg.ac.in)

---

## Created by

**Saptarshi Samanta**  
Research Scholar, Department of Design, IIT Guwahati  
Researcher — Haptic Experience Design · HCI · Game Design

[Website](https://saptarshisamanta.com/) · [ResearchGate](https://www.researchgate.net/profile/Saptarshi-Samanta-2) · [ORCID](https://orcid.org/0000-0003-3252-6499) · [LinkedIn](https://www.linkedin.com/in/saptarshi-samanta-aa9301ab/) · [saptarshi.samanta@iitg.ac.in](mailto:saptarshi.samanta@iitg.ac.in)

---

*Mano is a tool that emerged from my research process and is developed to aid other researchers and creative people in mapping out your mental thoughts and patterns more effectively. If you use Mano in your research or teaching, a mention is appreciated.*
