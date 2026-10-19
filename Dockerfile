# syntax=docker/dockerfile:1
# Build from the repo root so both web/ and backend/ are in the context.

# ---- Stage 1: build the React frontend -> /src/web/dist
FROM node:22-alpine AS web
WORKDIR /src/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# ---- Stage 2: build the static Go binary
# go.mod says 1.26.4; the default toolchain mode fetches that exact patch
# release if this image's patch version is older.
FROM golang:1.26-alpine AS backend
WORKDIR /src/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/origo_server ./server

# ---- Stage 3: minimal runtime (runs as root: Fly mounts volumes root-owned)
FROM alpine:3.22
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=backend /out/origo_server /app/origo_server
COPY --from=web /src/web/dist /app/web

ENV DATA_DIR=/data \
    FRONTEND_DIR=/app/web

EXPOSE 8080
ENTRYPOINT ["/app/origo_server"]
CMD ["serve", "--http=0.0.0.0:8080"]
