# Origo

> Educate. Agitate. Organize.

Origo is a course platform that brings structured, classroom-style learning online. Instead of a loose pile of videos, learning follows a clear path: **Course → Chapters → Lessons → Progress**. Creators manage their own courses from a dashboard, and learners pick up exactly where they left off. The name means *origin*, a starting point.

## Screenshot

![Origo front page](docs/screenshot.png)

## Features

- **Structured courses**: courses are split into chapters, each holding video lessons and downloadable notes
- **Course player**: one page with the video player, previous/next controls and a collapsible curriculum tree beside it
- **Creator dashboard**: create and manage your own courses, chapters, videos and notes
- **Per-resource ownership**: there is no separate "creator" account type; anyone can learn, and you manage only what you created
- **Access control**: lessons require sign-in, and paid courses are gated to purchasers
- **Progress tracking**: mark lessons as done and see your progress per chapter and course
- **Flexible auth**: password-only signup by default, with an optional email mode (verification, forgot and reset password)
- **Cookie-based sessions**: HttpOnly, Secure, SameSite cookies instead of tokens in local storage
- **Single deployable**: one Go process serves both the API and the built frontend

## Technology Used

| Layer | Stack |
| --- | --- |
| Backend | Go, [PocketBase](https://pocketbase.io) (as a framework), SQLite |
| Frontend | React, Vite, React Router, Tailwind CSS, daisyUI |
| Tooling | Docker (multi-stage build), Make |
| Deployment | Fly.io with a persistent volume |

## Installation

### Prerequisites

- **Docker** for option 1
- **Go 1.26+** and **Node.js 22+** for option 2

Clone the repository first:

```bash
git clone https://github.com/Muhafiz22/origo.git
cd origo
```

### 1. Via Docker

Build the image from the repository root (it builds the frontend and backend in separate stages):

```bash
docker build -t origo .
```

Run it, with a volume so your data survives restarts:

```bash
docker run -d \
  --name origo \
  -p 8080:8080 \
  -v origo_data:/data \
  origo
```

Open <http://localhost:8080>.

By default the app runs in `password` auth mode, which needs no email setup. To use email verification and password reset instead, pass `-e AUTH_MODE=email` along with your SMTP settings.

### 2. Go build + npm run build

**Build the frontend:**

```bash
cd web
npm ci
npm run build   # outputs web/dist
cd ..
```

**Build and run the backend**, pointing it at the built frontend:

```bash
make run-prod
```

This runs `go build` for the server (`backend/bin/origo_server`) and serves the API together with `web/dist` from a single process. The default address is <http://localhost:8090>.

If you prefer to run the steps by hand:

```bash
cd backend
go build -o bin/origo_server ./server
FRONTEND_DIR=../web/dist ./bin/origo_server serve
```

**Optional configuration** (environment variables, or a `.env` file in the repository root for `make` targets):

| Variable | Purpose | Default |
| --- | --- | --- |
| `AUTH_MODE` | `password` or `email` | `password` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |
| `DATA_DIR` | Where database and uploads are stored | `backend/bin/pb_data` |
| `FRONTEND_DIR` | Path to the built frontend | none (API only) |

### Development

Run the API and the Vite dev server separately for hot reloading:

```bash
make run              # API only
cd web && npm run dev # frontend, proxies /api to the backend
```

Run the backend tests with `make test`.
