# Workflows

## Ticket status automation

The cards of the [Project board](https://github.com/orgs/Inist-CNRS/projects/15) follow the pull requests and the releases on their own:

| Event                                                | New status       | Workflow                |
| ---------------------------------------------------- | ---------------- | ----------------------- |
| PR opened, reopened or marked "Ready for review"     | `Code review`    | `pr-ticket-status.yml`  |
| PR merged (whatever the target branch)               | `To be deployed` | `pr-ticket-status.yml`  |
| Release published                                    | `To test`        | `release-to-test.yml`   |

### How a ticket is linked to a PR

Either one is enough:

- the ticket number is in the branch name: `anthony/3825-fix-import`, `anthony/lodex-issue-3825-fix-import`
- the PR description closes it: `Closes #3825`, `Fixes #3825`, `Resolves #3825`

A plain mention (`#3825`) does not move the ticket. On a release it only fills its `Version à tester` field.

### Rules

- A card never goes backwards: `Code review` → `To be deployed` → `To test` → `Testing` → `Done`. A card in `To be fixed` goes back to `Code review` when its fix PR is opened.
- Draft PRs move nothing until they are marked "Ready for review".
- A PR closed without merge moves nothing.
- A PR without a linked ticket does nothing: the job stops before calling the API.
- A ticket that is not on the board is ignored.
- PRs from forks are ignored (no access to the token).

### Setup

Both workflows need the `PROJECT_TOKEN` secret: a PAT with the `project` scope, because the default `GITHUB_TOKEN` cannot write to an organization Project.

### Dry run

```bash
DRY_RUN=1 PR_NUMBER=3903 HEAD_REF=anthony/ticket-3901-c08f0b TARGET_STATUS="Code review" bash .github/workflows/pr-ticket-status.sh
```

```bash
DRY_RUN=1 TAG=v16.19.2 bash .github/workflows/release-to-test.sh
```
