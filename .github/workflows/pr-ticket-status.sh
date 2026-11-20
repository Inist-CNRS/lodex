#!/usr/bin/env bash
# Moves the Project cards of the tickets of a pull request to TARGET_STATUS
# ("Code review" when the PR is opened, "To be deployed" when it is merged).
# A ticket belongs to the PR when its number is in the branch name
# (anthony/lodex-issue-3825-…, thibault/3852-…) or when the PR closes it
# (Closes/Fixes/Resolves #3825). The PR itself is moved too if it is a card.
# A card never goes backwards: see STATUS_ORDER.
# Env: PR_NUMBER, HEAD_REF, PR_BODY, TARGET_STATUS, GH_TOKEN (project write),
# DRY_RUN=1 to only print.
set -euo pipefail

OWNER=Inist-CNRS
REPO=lodex
PROJECT_NUMBER=15
# Any status not listed here (Todo, In Progress, To be fixed…) comes before these
STATUS_ORDER=("Code review" "To be deployed" "To test" "Testing" "Done")

rank() {
    local i
    for i in "${!STATUS_ORDER[@]}"; do
        [[ "$1" == "${STATUS_ORDER[$i]}"* ]] && echo $((i + 1)) && return
    done
    echo 0
}

# Plain GraphQL, not "gh project": with PROJECT_TOKEN it fails on "unknown owner type"
project=$(gh api graphql -f query='
    query($owner: String!, $number: Int!) {
        organization(login: $owner) {
            projectV2(number: $number) {
                id
                field(name: "Status") {
                    ... on ProjectV2SingleSelectField { id options { id name } }
                }
            }
        }
    }' -f owner="$OWNER" -F number="$PROJECT_NUMBER" --jq .data.organization.projectV2) || {
    echo "PROJECT_TOKEN cannot read project $PROJECT_NUMBER of $OWNER (see the error above)" >&2
    exit 1
}
project_id=$(jq -r .id <<<"$project")
status_field_id=$(jq -r .field.id <<<"$project")
status_option_id=$(jq -r --arg n "$TARGET_STATUS" '.field.options[] | select(.name == $n) | .id' <<<"$project")
if [ -z "$status_option_id" ]; then
    echo "Status \"$TARGET_STATUS\" not found in project $PROJECT_NUMBER" >&2
    exit 1
fi

tickets=$({
    echo "$PR_NUMBER"
    jq -rn --arg ref "$HEAD_REF" --arg body "${PR_BODY:-}" '
        ($ref | scan("(?:^|[/-])([0-9]{3,5})(?:-|$)") | .[0]),
        ($body | scan("(?i)(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?):? +#([0-9]+)") | .[0])'
} | sort -u)

while read -r number; do
    item=$(gh api graphql -f query='
        query($owner: String!, $repo: String!, $number: Int!) {
            repository(owner: $owner, name: $repo) {
                issueOrPullRequest(number: $number) {
                    ... on Issue { projectItems(first: 20) { nodes { ...item } } }
                    ... on PullRequest { projectItems(first: 20) { nodes { ...item } } }
                }
            }
        }
        fragment item on ProjectV2Item {
            id
            project { number }
            status: fieldValueByName(name: "Status") {
                ... on ProjectV2ItemFieldSingleSelectValue { name }
            }
        }' -f owner="$OWNER" -f repo="$REPO" -F number="$number" \
        --jq ".data.repository.issueOrPullRequest.projectItems.nodes[]? | select(.project.number == $PROJECT_NUMBER) | [.id, (.status.name // \"\")] | @tsv" \
        2>/dev/null || true)
    [ -z "$item" ] && continue
    IFS=$'\t' read -r item_id status <<<"$item"
    if [ "$(rank "$status")" -ge "$(rank "$TARGET_STATUS")" ]; then
        echo "#$number skipped ($status)"
        continue
    fi
    echo "#$number: \"$status\" -> \"$TARGET_STATUS\""
    [ "${DRY_RUN:-}" = 1 ] && continue
    gh api graphql -f query='
        mutation($project: ID!, $item: ID!, $field: ID!, $option: String!) {
            updateProjectV2ItemFieldValue(input: {
                projectId: $project, itemId: $item, fieldId: $field,
                value: { singleSelectOptionId: $option }
            }) { projectV2Item { id } }
        }' -f project="$project_id" -f item="$item_id" -f field="$status_field_id" -f option="$status_option_id" >/dev/null
done <<<"$tickets"
