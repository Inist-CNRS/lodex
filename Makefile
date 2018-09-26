.PHONY: build test help
.DEFAULT_GOAL := help

NODE_ENV ?= development

help:
	@grep -P '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# If the first argument is one of the supported commands...
SUPPORTED_COMMANDS := npm restore-db-dev _restore_db_dev restore-db-prod _restore_db_prod build import_units import_users import_sections import_unit_sections
SUPPORTS_MAKE_ARGS := $(findstring $(firstword $(MAKECMDGOALS)), $(SUPPORTED_COMMANDS))
ifneq "$(SUPPORTS_MAKE_ARGS)" ""
    # use the rest as arguments for the command
    COMMAND_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
    # ...and turn them into do-nothing targets
    $(eval $(COMMAND_ARGS):;@:)
endif

# Initialization ===============================================================
copy-conf: ## Initialize the configuration files by copying the *''-dist" versions (does not override existing config)
	-cp -n ./config/${NODE_ENV}-dist.js ./config/${NODE_ENV}.js
ifeq ($(NODE_ENV), development)
	-cp -n ./config/test-dist.js ./config/test.js
endif

install-npm-dependencies:
	echo "Installing Node dependencies"
	docker-compose run --rm node npm install

install: copy-conf install-npm-dependencies ## Install npm dependencies for the api, admin, and frontend apps

build-app:
	docker-compose run node npm run build

build: ## build the docker image localy
	docker build -t inistcnrs/lodex --build-arg http_proxy --build-arg https_proxy .

run-dev: ## run node server
	docker-compose up --force-recreate mongo api

mongo: ## Start the mongo database
	docker-compose up -d mongo

mongo-shell: ## Start the mongo shell
	docker-compose exec mongo mongo lodex

mongo-shell-test: ## Start the mongo shell for the test database
	docker-compose exec mongo mongo lodex_test

npm: ## allow to run dockerized npm command eg make npm 'install koa --save'
	docker-compose run --rm node npm $(COMMAND_ARGS)

test-api-unit: ## Run the API unit tests
	NODE_ENV=test docker-compose run --rm test-api npm run test:api

test-api-unit-watch: ## Run the API unit tests
	NODE_ENV=test docker-compose run --rm test-api npm run test:api:watch

test-frontend-unit: ## Run the frontend application unit tests
	NODE_ENV=test docker-compose run --rm node npm run test:app

test-frontend-unit-watch: ## Watch the frontend application unit tests
	NODE_ENV=test docker-compose run --rm node npm run test:app:watch

test-e2e-start-dockers:
ifeq "$(CI)" "true"
	docker-compose -f docker-compose.test.yml up -d --build
else
	docker-compose -f docker-compose.test.yml up -d
endif

test-e2e-logs:
	docker-compose -f docker-compose.test.yml logs

test-e2e-stop-dockers:
	docker-compose -f docker-compose.test.yml down

test-e2e-open-cypress:
	./node_modules/.bin/cypress open

test-e2e:
ifeq "$(DISABLE_E2E_TESTS)" "true"
	echo "E2E tests were disable because of the flag 'DISABLE_E2E_TESTS=true'"
else
	$(MAKE) test-e2e-start-dockers
	./node_modules/.bin/cypress install
	./bin/wait-for -t 60 localhost:3000 -- ./node_modules/.bin/cypress run
	$(MAKE) test-e2e-stop-dockers
endif


test: test-frontend-unit test-api-unit test-e2e

clear-database: ## Clear the whole database
	docker-compose exec mongo mongo lodex --eval " \
		db.publishedDataset.remove({}); \
		db.publishedCharacteristic.remove({}); \
		db.field.remove({}); \
		db.uriDataset.remove({}); \
		db.dataset.remove({}); \
	"
clear-publication: ## Clear the published data, keep uploaded dataset and model
	docker-compose exec mongo mongo lodex --eval " \
		db.publishedDataset.remove({}); \
		db.publishedCharacteristic.remove({}); \
		db.publishedFacet.remove({}); \
		db.uriDataset.remove({}); \
	"
