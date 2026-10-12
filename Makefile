.PHONY: build run run-email test clean clean-db

BINARY := backend/bin/origo_server

# Export everything from .env (if present) into the recipe's environment.
LOAD_ENV = set -a; if [ -f .env ]; then . ./.env; fi; set +a

build:
	cd backend && go build -o bin/origo_server ./server

run: build
	@$(LOAD_ENV); AUTH_MODE=password ./$(BINARY) serve

run-email: build
	@$(LOAD_ENV); AUTH_MODE=email ./$(BINARY) serve

test:
	cd backend && go test ./...

clean:
	rm -rf $(BINARY)

clean-db:
	cd backend/bin && rm -rf pb_data
