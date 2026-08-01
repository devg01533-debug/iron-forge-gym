# Installation Guide

## Prerequisites

- A modern browser (Chrome, Edge, Firefox, Safari)
- Optional: Node.js 18+ (only if you want a local server)
- No backend, no build step required

## Local Development

### Option A - Direct open

Open `index.html` in your browser. The page works standalone, but the 3D
experience and fonts load from CDNs, so an internet connection is required.

### Option B - Local server (recommended)

With Node.js:

```bash
npx serve .
```

With Python:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Configuration

Edit `config.js` before deploying:

| Key | Purpose |
|-----|---------|
| `APP_NAME` | Brand name shown in nav, title and footer |
| `WEBHOOK_URL` | n8n webhook endpoint (set in Milestone 3) |
| `REQUEST_TIMEOUT` | Form submission timeout in ms (default 15000) |
| `DEBUG` | Enables console logging |
| `CONTACT` | Address, phone, email, hours, socials |
| `STATS` | Hero statistics counters |
| `PRICING` | Prices per plan and billing period |

## Fonts & Libraries

All external resources load from CDNs (Google Fonts, jsDelivr for Three.js).
No files are vendored into the repo, so GitHub Pages needs no build step.

## Browser Support

- Chrome / Edge / Firefox / Safari (last 2 versions)
- The 3D experience automatically falls back to a gradient hero if WebGL is
  unavailable or `prefers-reduced-motion` is enabled.
