.PHONY: build run run-prod test deploy clean clean-db

BINARY    := backend/bin/origo_server
FRONTEND  := $(CURDIR)/web/dist
AUTH_MODE ?= password

# Load .env for local runs only.
LOAD_ENV = set -a; if [ -f .env ]; then . ./.env; fi; set +a

build:
	cd backend && go build -o bin/origo_server ./server

# API only; the Vite dev server serves the frontend.
# Email mode: make run AUTH_MODE=email
run: build
	@$(LOAD_ENV); AUTH_MODE=$(AUTH_MODE) ./$(BINARY) serve

# One Go process serves the built frontend and the API.
run-prod: build
	@test -f "$(FRONTEND)/index.html" || { echo "Run 'cd web && npm run build' first"; exit 1; }
	@$(LOAD_ENV); AUTH_MODE=$(AUTH_MODE) FRONTEND_DIR="$(FRONTEND)" ./$(BINARY) serve

test:
	cd backend && go test ./...

deploy: test
	fly deploy

clean:
	rm -f $(BINARY)

# Destructive: permanently deletes local PocketBase data.
clean-db:
	rm -rf backend/bin/pb_data
