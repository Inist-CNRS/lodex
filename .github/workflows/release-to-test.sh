#!/usr/bin/env bash
# Moves the Project cards of the tickets shipped in a release to "To test"
# and writes the release in their "Version à tester" field.
# A ticket is shipped when a PR merged since the previous tag has its number
# in its branch name (anthony/lodex-issue-3825-…, thibault/3852-…) or closes it
# (Closes/Fixes/Resolves #3825). Any other ticket the PR mentions (#3773) only
# gets the new version, its status is kept. Cards in Done are left alone, cards
# in Testing only get the new version.
# Env: TAG (v16.19.2), GH_TOKEN (project write), DRY_RUN=1 to only print,
# PREVIOUS_TAG to cover several releases (default: the tag before TAG).
set -euo pipefail

OWNER=Inist-CNRS
REPO=lodex
PROJECT_NUMBER=15
VERSION_FIELD="Version à tester"
TARGET_STATUS="To test"

previous_tag=${PREVIOUS_TAG:-$(git describe --tags --abbrev=0 "$TAG^")}
version=${TAG#v}
echo "Tickets shipped between $previous_tag and $TAG"

# Plain GraphQL, not "gh project": with PROJECT_TOKEN it fails on "unknown owner type"
project=$(gh api graphql -f query='
    query($owner: String!, $number: Int!, $version: String!) {
        organization(login: $owner) {
            projectV2(number: $number) {
                id
                version: field(name: $version) { ... on ProjectV2Field { id } }
                status: field(name: "Status") {
                    ... on ProjectV2SingleSelectField { id options { id name } }
                }
            }
        }
    }' -f owner="$OWNER" -F number="$PROJECT_NUMBER" -f version="$VERSION_FIELD" --jq .data.organization.projectV2) || {
    echo "PROJECT_TOKEN cannot read project $PROJECT_NUMBER of $OWNER (see the error above)" >&2
    exit 1
}
project_id=$(jq -r .id <<<"$project")
version_field_id=$(jq -r '.version.id // empty' <<<"$project")
status_field_id=$(jq -r .status.id <<<"$project")
status_option_id=$(jq -r --arg n "$TARGET_STATUS" '.status.options[] | select(.name == $n) | .id' <<<"$project")
if [ -z "$version_field_id" ] || [ -z "$status_option_id" ]; then
    echo "Field \"$VERSION_FIELD\" or status \"$TARGET_STATUS\" not found in project $PROJECT_NUMBER" >&2
    exit 1
fi

# set_field <item id> <field id> <text=… | singleSelectOptionId=…>
set_field() {
    gh api graphql -f query='
        mutation($project: ID!, $item: ID!, $field: ID!, $value: ProjectV2FieldValue!) {
            updateProjectV2ItemFieldValue(input: {
                projectId: $project, itemId: $item, fieldId: $field, value: $value
            }) { projectV2Item { id } }
        }' -f project="$project_id" -f item="$1" -f field="$2" -f "value[${3%%=*}]=${3#*=}" >/dev/null
}

prs=$(git log --format=%s "$previous_tag..$TAG" |
    sed -nE 's/^Merge pull request #([0-9]+) .*/\1/p; s/.*\(#([0-9]+)\)$/\1/p' | sort -u)

# "<number> move" for the shipped tickets, "<number> version" for the mentioned ones
tickets=$(for pr in $prs; do
    echo "$pr move" # the PR itself may be a card
    gh pr view "$pr" --repo "$OWNER/$REPO" --json headRefName,body \
        --jq '((.headRefName | scan("(?:^|[/-])([0-9]{3,5})(?:-|$)") | .[0]),
               (.body // "" | scan("(?i)(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?):? +#([0-9]+)\\b") | .[0])
               | "\(.) move"),
              (.body // "" | scan("#([0-9]+)\\b") | .[0] | "\(.) version")'
done | sort -u | awk '!seen[$1]++') # "move" sorts before "version", so it wins

while read -r number kind; do
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
    # a number that is not an issue or PR (#99999) answers with the GraphQL error
    [[ "$item" == PVTI_* ]] || continue
    IFS=$'\t' read -r item_id status <<<"$item"
    if [[ "$status" == Done* ]]; then
        echo "#$number skipped ($status)"
        continue
    fi
    move=$([ "$kind" = move ] && [ "$status" != Testing ] && echo 1 || true)
    echo "#$number ($kind): $VERSION_FIELD = $version, status \"$status\"${move:+ -> \"$TARGET_STATUS\"}"
    [ "${DRY_RUN:-}" = 1 ] && continue
    set_field "$item_id" "$version_field_id" text="$version"
    if [ -n "$move" ]; then
        set_field "$item_id" "$status_field_id" singleSelectOptionId="$status_option_id"
    fi
done <<<"$tickets"
