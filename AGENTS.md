# AGENTS.md

Origo is a course platform: a Go/PocketBase API that also serves a React SPA from one binary.

## Layout

- `backend/` is its own Go module named `backend` (Go 1.26). `backend/server/main.go` wires PocketBase, config, middleware, and routes.
- Each resource (`auth`, `course`, `chapter`, `video`, `note`, `user`) owns `dto.go`, `handler.go`, `service.go`, and `router.go` under `backend/internal/`; services own business rules and PocketBase access. Register new resource routers in `backend/internal/router/router.go`.
- Collection schemas are Go code in `backend/internal/db/collections/`; `internal/db/migrations/initial_schema.go` creates them. Add new collections to both its create and rollback lists.
- `web/` is React 19 + Vite 8 + Tailwind 4/daisyUI 5, JavaScript only. Import routing APIs from `react-router` (v8), not `react-router-dom`. HTTP wrappers live in `web/src/services/`; auth state lives in `web/src/context/AuthContext.jsx`.
- Frontend requests are relative to `/api/v1` (`web/src/services/apiClient.jsx`). PocketBase file/thumbnail URLs use `/api/files/...`; health is `/health`, although `fly.toml` currently checks `/api/health`.
- Sessions use the HttpOnly `origo_session` cookie loaded by `backend/internal/auth/cookie.go`; there are no bearer tokens or localStorage sessions. `backend/internal/middleware/` is an unused stub.
- All custom collection API rules are `nil`, so `/api/collections/*` is intentionally locked; use the custom `/api/v1` handlers.

## Commands

- API dev server: `make run` (port 8090, API only). `make build` produces `backend/bin/origo_server`.
- Frontend dev server: `cd web && npm run dev` (port 5173; proxies `/api` to `127.0.0.1:8090`).
- Production local run: build `web/dist` with `cd web && npm run build`, then `make run-prod`.
- Backend tests: `make test`, or `cd backend && go test ./...` because the repo root is not a Go module. Single test: `cd backend && go test ./internal/chapter -run TestName -v`.
- Frontend lint: `cd web && npm run lint`. The baseline is currently red (13 errors, 2 warnings); check whether failures are pre-existing before attributing them to your change.
- Docker image must be built from the repo root: `docker build -t origo .`; it builds `web/dist` then the Go binary and serves both on port 8080.
- `make deploy` runs `make test` then `fly deploy`. There is no CI configuration; these local commands are the verification path.

## Setup and gotchas

- Root `.env` is loaded only by Makefile targets. Direct binary runs must export env vars themselves.
- `AUTH_MODE` defaults to `password`. Email mode (`make run AUTH_MODE=email`, not `make run-email`) requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_SENDER_ADDRESS`.
- `DATA_DIR` defaults to `pb_data` next to the executable (`backend/bin/pb_data` with Make); `make clean-db` deletes it. Docker/Fly set it to `/data`.
- `APP_ENV=production` is the only thing that sets `Secure` on the session cookie; the Docker and Fly configs do not set it.
- Auth-mode UI guard is broken: `web/src/components/EmailAuthRoute.jsx` checks the whole `useAuth()` object instead of its `emailAuth` flag, so email-only pages still render in password mode.
- Paid courses are stubbed: `canAccessCourse` rejects every course with `price > 0`, and the `subscriptions` collection has no handlers even though the README describes purchase gating.
- Tests use `tests.NewTestApp("../../testdata/pb_data")`, which clones the committed PocketBase snapshot `backend/testdata/pb_data` per test. New schema will not appear there automatically; refresh that snapshot after collection changes.
- Backend handlers must send errors through `backend/internal/apis.MapError` with `apperr` sentinels. The frontend `ApiError` expects PocketBase's `{message, data: {field: {message}}}` envelope.
- Frontend has no test runner. `npm run build` is the only frontend verification beyond lint.
