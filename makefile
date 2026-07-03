.PHONY: build run clean

BINARY := backend/bin/origo_server

build:
	cd backend && go build -o bin/origo_server ./server

run: build
	./$(BINARY) serve

clean:
	rm -rf $(BINARY)
