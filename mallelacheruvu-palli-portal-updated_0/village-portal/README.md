# Mallelacheruvu Palli — Digital Village Portal

Full-stack build: **React (Vite)** frontend + **FastAPI** backend + **MongoDB**.

```
village-portal/
  backend/    FastAPI app — see backend/README.md to run it
  frontend/   React app  — see frontend/README.md to run it
```

## Quick start

1. **Backend** — `cd backend`, follow backend/README.md (set `MONGO_URI` in
   `.env` — local MongoDB or Atlas both work, no DB needs pre-creating,
   `pip install -r requirements.txt`, `python -m app.seed`, then
   `uvicorn app.main:app --reload --port 8000`).
2. **Frontend** — `cd frontend`, `npm install`, `npm run dev` — opens on
   http://localhost:5173 and talks to the API at http://localhost:8000/api.
3. Log into `/admin/login` with the seeded admin credentials from
   `backend/.env` (change the password immediately after first login).

## What's real vs. placeholder

Per the brief, no village-specific facts, phone numbers, or businesses were
invented. Every seeded record that stands in for real information is
flagged `is_demo_data: true` in the database and shown with a small "demo"
badge in the UI, so an administrator knows exactly what to replace first via
the Admin Dashboard — no code changes needed.

## Verified working

- Backend: all 34 API endpoints run end-to-end against MongoDB (seed →
  public reads → category filtering → search → admin login → protected
  create), tested via FastAPI's TestClient against a mocked MongoDB
  instance before delivery.
- Frontend: `npm run build` completes with no errors (118 modules, ~85 KB
  gzipped JS).

## Data storage notes

Every document uses a string UUID as its Mongo `_id`, so the API always
returns a plain `id` field to the frontend — no `ObjectId` serialization
quirks to work around. `village_info` is a single document (there's only
one village); everything else is a normal collection.

## Not yet wired (by design, per the brief)

- **Live map** — placeholder shown; facility lat/long fields are already in
  the API, ready for a Google Maps/Leaflet embed.
- **Image uploads** — gallery/event/facility images are stored as URLs;
  wire up Cloudinary (or similar) in the backend before going live.
- **Real Telugu translations** — the language switcher works and holds nav
  strings in Telugu already; extend `frontend/src/context/LanguageContext.jsx`
  as more copy is finalized.
