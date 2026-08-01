# Iron Forge Gym - AI Lead Capture Platform

A premium, futuristic AI fitness company website. Cinematic 3D dumbbell experience,
glassmorphism design, full lead capture form - hosted on GitHub Pages.

## Architecture

```
GitHub Pages Website → n8n Webhook → AI Agent → Supabase Database → Respond → Website
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS, Three.js |
| 3D Experience | Three.js (procedural metal dumbbell, HDR reflections, particles) |
| Automation | n8n (Milestone 3) |
| AI | Anthropic Claude via n8n (Milestone 3) |
| Database | Supabase PostgreSQL (Milestone 3) |
| Hosting | GitHub Pages |

## Project Structure

```
Gym-Lead-System/
├── index.html                        # Landing page (all sections)
├── style.css                         # Design system & animations
├── app.js                            # UI logic & lead form pipeline
├── config.js                         # Every configurable value lives here
├── assets/
│   └── js/
│       └── three-dumbbell.js         # 3D dumbbell, particles, scroll story
├── docs/
│   ├── INSTALL.md                    # Local setup guide
│   └── GITHUB_PAGES.md               # Deployment guide
├── database/                         # SQL schema (Milestone 3)
├── n8n/                              # Workflow JSON (Milestone 3)
└── README.md
```

Note: `frontend/` contains the legacy Netlify version of this project. The new
GitHub Pages version lives at the project root.

## Quick Start

1. Open `index.html` in a browser, or run a local server:

   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```

2. Open `http://localhost:8080`

## Configuration

All configurable values live in `config.js`:

```js
APP_NAME, VERSION, WEBHOOK_URL, REQUEST_TIMEOUT, DEBUG,
CONTACT, STATS, PRICING, PLANS
```

Set `WEBHOOK_URL` when the n8n workflow is ready (Milestone 3). Until then the
form runs in preview mode so the full UX can be tested.

## Roadmap

- **Milestone 1** (done) - Premium landing page, 3D hero, animations, lead form UX, GitHub Pages compatible
- **Milestone 2** (done) - Supabase schema (`database/schema.sql`, `docs/SUPABASE_SETUP.md`)
- **Milestone 3** (done) - n8n workflow: webhook → validate → normalize → duplicate check → insert → Claude AI analysis → update → respond (`n8n/gym-lead-capture-workflow.json`, `docs/N8N_SETUP.md`)
- **Milestone 4** - End-to-end wiring, monitoring, polish

## License

MIT
