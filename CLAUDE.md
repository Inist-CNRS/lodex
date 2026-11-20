# Lodex

Publishes a dataset (csv, json, xml…) as a website, with a back office to import, enrich and model the data. Node 24, Koa, MongoDB, Redis (Bull), React, ezs.

## Tickets, branches and pull requests

-   Branch: `<you>/<ticket number>-<short-description>` (ex: `jane/3825-fix-import`). No ticket: no number in the branch name.
-   PR description: `Closes #<ticket number>` when the PR finishes the ticket.
-   The ticket number in the branch name or the `Closes #N` moves the ticket on the [Project board](https://github.com/orgs/Inist-CNRS/projects/15) (see `.github/workflows/README.md`). Never write `Closes #N` / `Fixes #N` for a ticket the PR does not finish, even as an example.
-   Commit messages and PR titles follow [Conventional Commits](https://www.conventionalcommits.org): `feat(enrichment): …`, `fix(import): …`, `ci: …`.

## Commands

Run from the repository root.

| Need                    | Command                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| Install                 | `make install`                                                   |
| Run everything (Docker) | `make run-dev` (API and apps on http://localhost:3000)           |
| Unit tests, one path    | `npm run test:unit -- packages/api/src/workers`                  |
| Unit tests, all         | `npm run test:unit` (slow: one Jest worker)                      |
| Lint                    | `npm run lint:test` (`npm run lint` to fix)                      |
| Type check              | `npm run type-check`                                             |
| E2E, one phase          | `E2E_PHASE=phase:one make test-e2e-phase` (starts the dockers)   |
| E2E, interactive        | `make test-e2e-start-dockers`, then `make test-e2e-open-cypress` |

-   Unit tests are `*.spec.ts(x)` next to the code. API tests use an in-memory MongoDB (`@shelf/jest-mongodb`), no Docker needed.
-   E2E tests are in `cypress/e2e/phase_1` … `phase_5`; CI runs one shard per phase.
-   No npm workspaces: each package has its own `node_modules`, installed by the root `postinstall`.

## Packages

| Package                    | Role                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `packages/api`             | Koa API, Bull queues and job processors, serves the three apps                     |
| `packages/workers`         | ezs HTTP server (port 31976): one endpoint per `.ini` script. Not the Bull workers |
| `packages/ezsLodex`        | `@ezs/lodex`, the Lodex ezs statements (`LodexUpdateDocuments`, `paginateQuery`…)  |
| `packages/transformers`    | `@ezs/transformers`, ezs statements for the field transformers                     |
| `packages/common`          | Code shared by the API and the apps (statuses, constants, types)                   |
| `packages/frontend-common` | Components, state and hooks shared by the apps                                     |
| `packages/admin-app`       | Back office of one instance (data, enrichments, model, publication)                |
| `packages/public-app`      | Published website                                                                  |
| `packages/root-admin-app`  | Management of the instances (tenants)                                              |

`@ezs/lodex` is loaded from its compiled `lib/` (git-ignored): after a change in `packages/ezsLodex`, rebuild it (`cd packages/ezsLodex && npm run build`) and restart the `workers` container. See the "Development" section of `README.md`.

## Multi-tenancy

-   An instance is a tenant. It is resolved from the URL `/instance/<tenant>`, then the `X-Lodex-Tenant` header, then `DEFAULT_TENANT` (`packages/api/src/app.ts`).
-   One MongoDB database per tenant (`<dbName>_<tenant>`, `services/mongoClient.ts`) and one Bull queue per tenant, named after it.
-   Per-tenant settings live in `configTenant` (defaults in `configTenant.json`).

## Queues (Bull)

Everything is in `packages/api/src/workers`. Bull 4, not BullMQ. Redis is `REDIS_URL`.

-   One queue per tenant with a single processor of concurrency 1 (`workers/index.ts`): **a tenant runs one job at a time**, whatever its type.
-   The processor dispatches on `job.data.jobType`: `publisher`, `enricher`, `retry-enricher`, `precomputer`, `import`, `model-importer`.
-   Queues are `lifo`: among the waiting jobs, the newest runs first.
-   A publisher or import job that starts removes every other waiting job of its type (`cleanWaitingJobsOfType`): one publication is enough. Code that waits for "its" publisher job must cope with that job disappearing.
-   Only the last 10 completed and 10 failed jobs are kept: a finished job may already be gone when you look for it.
-   Jobs are queued by the helpers of `workers/tools.ts` (`queuePublisher`…) and `services/launchTasks.ts` (`queueEnrichment`, `queuePrecomputed`), called from the routes in `controller/api`.
-   Progress: `services/progress.ts` (in memory, per tenant), pushed over socket.io on `<dbName>_<tenant>-progress`, `-publisher`, `-enricher`, `-precomputer`, `-import`. Job logs go through `jobLogger` (`workers/tools.ts`) and are read with `GET /api/job/:id/logs`.
-   Cancel: `POST /api/job/:type/cancel` → `cancelJob` (`workers/tools.ts`), which trips the ezs `[breaker]` of the pipeline, then fails the job as `cancelled`. Pipelines throw `CancelWorkerError`.
-   Bull Board is served at `/bull`.

## ezs

Every data stream goes through [ezs](https://inist-cnrs.github.io/ezs/): imports, exports, routines, enrichments, precomputed, publication.

-   Scripts are `.ini` files in `packages/workers/src/{loaders,exporters,formatExporters,routines,precomputed}`. The `workers` service exposes each of them over HTTP (`ezs.createCluster`).
-   The API calls them with `ezs('URLConnect', { url })` on `WORKERS_URL` (`services/import.ts`, `controller/api/export.ts`, `controller/api/run.ts`). Enrichment rules run in the API process.
-   `@ezs/core`, `basics`, `analytics`, `conditor`, `istex`, `sparql`, `storage`, `xslt` are external dependencies of the root `package.json`. A commit `update ezs/*` only bumps their versions.
-   Files loaded by name at runtime (ezs plugins, `.ini`) are not bundled: they must be valid Node ESM with `.js` extensions in relative imports.

## Enrichments

An enrichment adds one column to the dataset by sending each row to a web service. Code: `packages/api/src/services/enrichment/enrichment.ts`, routes in `controller/api/enrichment.ts`, UI in `packages/admin-app/src/enrichment`.

-   Launch: `POST /api/enrichment/launch|relaunch/:id` → `queueEnrichment`, which sets the document to `PENDING` with its `jobId`, then adds an `enricher` job.
-   Rule: in simple mode, one of the four `.txt` templates next to the service is filled with the `webServiceUrl` (`[expand/URLConnect]`); in advanced mode, the user's ezs `rule` is used as is.
-   Pipeline (`processEnrichmentPipeline`): paginate the dataset → `[breaker]` → rule → group by `configTenant.enrichmentBatchSize` (10) → `LodexUpdateDocuments`. The result is written in the field named after the enrichment, in `dataset` (or `pc_<id>` when the source is a precomputed).
-   A failed row is stored as the string `[Error]: …` and counted in `errorCount`; `POST /api/enrichment/retry/:id` (`retry-enricher`) only replays those rows.
-   Statuses are `TaskStatus` (`packages/common/src/taskStatusType.ts`): `PENDING`, `IN_PROGRESS`, `PAUSED`, `ON_HOLD`, `FINISHED`, `ERROR`, `CANCELED`. A write from a stale job is ignored (`updateStatusOfJob`).

## Precomputed

Same idea, but on the whole dataset and asynchronous (`services/precomputed/precomputed.ts`): the job sends the source columns as a TAR to the web service, which later calls `POST /webhook/compute_webservice/`; that queues a second job which stores the result in its own collection `pc_<id>`.

## Site generation

`packages/api/src/services/siteGeneration`: a Mongo document that chains enrichments, precomputed and the publication as ordinary queue jobs (kinds `wizard` and `addData`).

-   Statuses: `running`, `publishing`, `error`, `stopping` (active), `done`, `stopped`.
-   `sweep.ts` advances the generations on each job `completed` / `failed` event and on a timer; a failing step is relaunched up to 3 times.
-   While a generation is active, the launch routes are refused (`refusedDuringSiteGeneration`).
