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
	echo "Installing Node dependencies for environment $(NODE_ENV)"
	npm install $(if $(filter production staging,$(NODE_ENV)),--production,)

install: copy-conf install-npm-dependencies ## Install npm dependencies for the api, admin, and frontend apps

# Development ==================================================================

run-frontend: ## Run the frontend application
	NODE_ENV=${NODE_ENV} BABEL_ENV=browser ./node_modules/.bin/webpack-dev-server --config=./src/app/webpack.config.babel.js --port=8080

docker-run-dev: ## run node server with pm2 for development and webpack-dev-server
	docker-compose up --force-recreate

mongo-shell: ## Start the mongo shell
	docker-compose exec mongo mongo lodex

mongo-shell-test: ## Start the mongo shell for the test database
	docker-compose exec mongo mongo lodex_test

# Build ==================================================================

build-frontend: ## Build the frontend application
	NODE_ENV=${NODE_ENV} BABEL_ENV=browser ./node_modules/.bin/webpack \
	    --config=./src/app/webpack.config.babel.js \
	    $(if $(filter test,$(NODE_ENV)),,--progress)

npm: ## allow to run dockerized npm command eg make npm 'install koa --save'
	docker-compose run --rm npm $(COMMAND_ARGS)

test-api-unit: ## Run the API unit tests
	docker-compose -f docker-compose.unit.yml run --rm api-unit

test-frontend-unit: ## Run the frontend application unit tests
	docker-compose -f docker-compose.unit.yml run --rm frontend-unit

test: test-frontend-unit test-api-unit

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
