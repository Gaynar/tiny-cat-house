.PHONY: help install start dev build test preview clean

help:
	@echo "Available commands:"
	@echo "  make start    Start the Vite dev server"
	@echo "  make dev      Alias for start"
	@echo "  make install  Install npm dependencies"
	@echo "  make build    Build the app for production"
	@echo "  make test     Run the test suite"
	@echo "  make preview  Preview the production build"
	@echo "  make clean    Remove generated build output"

install:
	npm install

start:
	npm run dev

dev: start

build:
	npm run build

test:
	npm test

preview:
	npm run preview

clean:
	rm -rf dist
