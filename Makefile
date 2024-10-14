
run-dev:
	docker compose up --build

stop-dev:
	docker compose down -v

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

test:
	npm run test

test-wa:
	npm run test:wa

application-logs:
	docker compose logs -f
