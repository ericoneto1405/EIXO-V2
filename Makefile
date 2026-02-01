.PHONY: install dev dev-frontend dev-backend build preview clean restart

install:
	@npm install

dev:
	@npm run dev

dev-frontend:
	@npm run dev:frontend

dev-backend:
	@npm run dev:server

build:
	@npm run build

preview:
	@npm run preview

clean:
	@rm -rf node_modules package-lock.json frontend/node_modules server/node_modules frontend/dist

restart:
	@$(MAKE) --no-print-directory dev
