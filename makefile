dbup:
	docker-compose -f docker/postgres/docker-compose.local.yml up -d

dbdown:
	docker-compose -f docker/postgres/docker-compose.local.yml down

test-watch:
	./scripts/run-integration-watch.sh
