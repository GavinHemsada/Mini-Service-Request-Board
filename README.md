# GlobalTNA — Mini Service Request Board

A full-stack homeowner service request board: browse and search listings, register/sign in, post requests, update status, and manage your own posts.

| Layer    | Stack                          | Default URL              |
| -------- | ------------------------------ | ------------------------ |
| Frontend | Next.js 16 (App Router), React | http://localhost:3000    |
| Backend  | Express, MongoDB, JWT          | http://localhost:4000    |

The frontend talks to the Express API only (no Next.js API routes for app data).

---

## Prerequisites

- **Node.js 18+** (backend `engines` require `>=18`)
- **MongoDB** — local instance, Docker, or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- npm (included with Node)

---

## Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd GlobalTNA

cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Copy the example files and edit values for your machine:

```bash
# From repo root
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

See [Environment variables](#environment-variables) below.

### 3. Seed sample data (optional)

With the backend `.env` pointing at your database:

```bash
cd backend
npm run seed
```

This creates a demo user and sample job requests:

- **Email:** `seed@example.com`
- **Password:** `password123`

---

## Environment variables

### Backend (`backend/.env`)

| Variable         | Required | Description |
| ---------------- | -------- | ----------- |
| `MONGODB_URI`    | Yes      | MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/globaltna` or an Atlas URI). |
| `JWT_SECRET`     | Yes      | Secret used to sign JWTs. Use a long random string in production. |
| `PORT`           | No       | API port. Default: `4000`. |
| `JWT_EXPIRES_IN` | No       | JWT lifetime (e.g. `7d`). Default: `7d`. |
| `CORS_ORIGIN`    | No       | Allowed browser origin(s) for CORS. Comma-separated. For local dev use `http://localhost:3000`. |

**Example `backend/.env`:**

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/globaltna
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env`)

| Variable               | Required | Description |
| ---------------------- | -------- | ----------- |
| `NEXT_PUBLIC_API_URL`  | Yes      | Base URL of the Express API (no trailing slash). Must match backend `PORT` and be allowed by `CORS_ORIGIN`. |

**Example `frontend/.env`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not put secrets in the frontend env file.

---

## Run instructions

Run **both** apps for full functionality. Start the backend first so the API is available when the frontend loads.

### Backend (Express API)

```bash
cd backend
npm run dev
```

- Development uses Node’s `--watch` for auto-restart on file changes.
- API base: `http://localhost:4000` (or your `PORT`).
- Health check: `GET http://localhost:4000/api/health` → `{ "ok": true }`.

**Production-style start:**

```bash
cd backend
npm start
```

### Frontend (Next.js)

In a **second terminal**:

```bash
cd frontend
npm run dev
```

- App: **http://localhost:3000**

**Production build:**

```bash
cd frontend
npm run build
npm start
```

---

## Backend tests

Router integration tests use Jest, Supertest, and an in-memory MongoDB (no external DB required for tests):

```bash
cd backend
npm test
```

Watch mode: `npm run test:watch`

---

## API overview

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| `POST` | `/api/auth/register` | No | Create account |
| `POST` | `/api/auth/login` | No | Sign in |
| `GET` | `/api/jobs` | No | List jobs (filters: `category`, `status`, `q`, `page`, `limit`) |
| `GET` | `/api/jobs/mine` | Yes | List current user’s jobs |
| `GET` | `/api/jobs/:id` | No | Job detail |
| `POST` | `/api/jobs` | Yes | Create job |
| `PATCH` | `/api/jobs/:id` | Yes | Update status (any signed-in user) |
| `DELETE` | `/api/jobs/:id` | Yes | Delete job (creator only) |

Send JWT as: `Authorization: Bearer <token>`

---

## Project structure

```text
GlobalTNA/
├── backend/          # Express API
│   ├── src/
│   │   ├── routes/     # auth, jobs routers
│   │   ├── controllers/
│   │   ├── models/
│   │   └── middleware/
│   ├── tests/          # Jest router tests
│   └── scripts/seed.js
└── frontend/           # Next.js app
    ├── app/            # pages (home, jobs, login, register)
    ├── components/
    └── lib/            # API client, types
```

---

## Troubleshooting

| Issue | What to check |
| ----- | ------------- |
| Frontend can’t reach API | `NEXT_PUBLIC_API_URL` matches backend URL; backend is running; `CORS_ORIGIN` includes `http://localhost:3000`. |
| `JWT_SECRET is not configured` | Set `JWT_SECRET` in `backend/.env` and restart the API. |
| `MONGODB_URI is not set` | Set `MONGODB_URI` in `backend/.env`; confirm MongoDB is running or Atlas IP allowlist. |
| 401 on create/update/delete | Sign in; token is stored in `localStorage` and sent on protected routes. |

---

## License

Private / assessment project — see repository owner for usage terms.
