# Mallelacheruvu Palli Portal — Frontend (React + Vite)

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL if backend isn't on localhost:8000
npm run dev
```

Visit http://localhost:5173

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## What's included

- All public pages from the spec: Home, About, Our Village (facilities + map
  placeholder), Agriculture, Events (filterable), Youth, Services (searchable
  directory), Gallery (lightbox + Village Memories submission), Announcements
  (filterable), Contact (contact form + feedback form + important contacts).
- Admin Login + Admin Dashboard (Dashboard stats, Announcements, Events,
  Services, Gallery, Feedback review, Memory approval — each with add/delete).
- Sticky navbar with mobile hamburger menu, global search, and an
  English/Telugu language switcher (`src/context/LanguageContext.jsx` —
  add more keys/strings there as content grows).
- All content is data-driven from the FastAPI backend — nothing about the
  village is hard-coded in components. Anywhere the API returns
  `is_demo_data: true` (or a "DEMO DATA" prefix), the UI shows a small
  "demo" flag so it's obvious what still needs real content.

## Design

Palette and motifs are drawn from the village's own name: "Malle" (jasmine),
"Cheruvu" (pond/tank), "Palli" (village) — jasmine-white background, paddy
green, tank-water teal, temple-terracotta and turmeric-gold accents, with a
ripple + jasmine-sprig divider (`src/components/RippleDivider.jsx`) as the
one recurring signature element between sections. Tokens live in
`src/styles/theme.css`.

## Connecting a real map

`Village.jsx` and `Contact.jsx` currently show a labeled placeholder instead
of a live map, per the brief. Facilities already carry `latitude`/`longitude`
fields from the API — swap the placeholder `<div>` for a Google Maps or
Leaflet/OpenStreetMap embed using those coordinates when you're ready.
