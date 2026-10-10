# Mallelacheruvu Palli Portal — Backend (Node.js/Express + MongoDB)

## 1. Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set `MONGO_URI` to your MongoDB connection string, e.g.:

```
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=mallelacheruvu_palli
```

For MongoDB Atlas, use the connection string from your cluster (looks like
`mongodb+srv://user:password@cluster.mongodb.net`). No database or
collections need to be created ahead of time — MongoDB creates them on
first write, which the seed script below triggers.

## 2. Seed the database with demo data

```bash
npm run seed
```

This creates:
- One admin user — username/password from `.env` (`DEFAULT_ADMIN_USERNAME` / `DEFAULT_ADMIN_PASSWORD`, defaults to `VamsiReddy` / `VamsiReddy`). **Change the password after first login.** Re-running `npm run seed` always updates the admin account to whatever is currently in `.env`.
- Placeholder/demo content for village info, facilities, crops, events, announcements, services, contacts, and youth activities — all clearly flagged `is_demo_data: true` so you know what to replace.

The script is idempotent — it only inserts a collection's demo data if that
collection is currently empty, so it's safe to re-run.

## 3. Run the API

```bash
npm start        # production
npm run dev       # auto-restarts on file changes (Node's --watch)
```

By default the API listens on port 8000 (set via `PORT` in `.env`).

## 4. Project layout

```
src/
  server.js        Express app: middleware, CORS, router registration
  config.js        Settings loaded from .env
  database.js      MongoDB client + db handle (connectDB / getDb)
  models.js        Collection name constants + category/status vocabularies
  mongoUtils.js     Helpers: UUID id generation, doc -> API object serialization,
                    date <-> Date conversion (Mongo has no native date type)
  auth.js            Password hashing (bcrypt) + JWT issuing/verification,
                     requireAdmin Express middleware
  seed.js            One-time (idempotent) demo data seeder
  routes/            One file per resource, each mounted under /api/...
  utils/asyncHandler.js  Wraps async route handlers so rejected promises
                          reach Express's error middleware
```

## 5. Data model (collections)

`users`, `village_info` (single document), `facilities`, `crops`,
`farmer_resources`, `events`, `announcements`, `services`, `gallery_items`,
`memories`, `feedback`, `important_contacts`, `youth_activities`.

Every document uses a string UUID as its `_id` (via `mongoUtils.newId()`),
so the API always returns a plain `id` field — no MongoDB `ObjectId`
serialization to worry about on the frontend.

## 6. Auth

- `POST /api/auth/login` — returns a JWT bearer token for the admin.
- Protected routes require `Authorization: Bearer <token>`.
- Only mutating endpoints (create/update/delete) and admin-only reads
  (pending feedback/memories, dashboard stats) require the token —
  all public GETs are open, matching a public village site.

## 7. Notes on "demo data"

Per the spec, no real population figures, phone numbers, or business names
were invented. Every seeded record that stands in for real village
information carries `is_demo_data: true` (or a `DEMO DATA —` prefix in text
fields) so the frontend can visually flag it and the admin knows what to
replace first.

## 8. API surface

This is a straight port of the previous FastAPI/Motor backend to
Node.js/Express with the native `mongodb` driver — all 34 endpoints,
request/response shapes, and status codes are unchanged, so the existing
React frontend needs no changes beyond pointing at the same base URL.
