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

project_id=$(gh project view "$PROJECT_NUMBER" --owner "$OWNER" --format json --jq .id)
fields=$(gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json)
version_field_id=$(jq -r --arg n "$VERSION_FIELD" '.fields[] | select(.name == $n) | .id' <<<"$fields")
status_field_id=$(jq -r '.fields[] | select(.name == "Status") | .id' <<<"$fields")
status_option_id=$(jq -r --arg n "$TARGET_STATUS" '.fields[] | select(.name == "Status") | .options[] | select(.name == $n) | .id' <<<"$fields")
if [ -z "$version_field_id" ] || [ -z "$status_option_id" ]; then
    echo "Field \"$VERSION_FIELD\" or status \"$TARGET_STATUS\" not found in project $PROJECT_NUMBER" >&2
    exit 1
fi

prs=$(git log --format=%s "$previous_tag..$TAG" |
    sed -nE 's/^Merge pull request #([0-9]+) .*/\1/p; s/.*\(#([0-9]+)\)$/\1/p' | sort -u)

# "<number> move" for the shipped tickets, "<number> version" for the mentioned ones
tickets=$(for pr in $prs; do
    echo "$pr move" # the PR itself may be a card
    gh pr view "$pr" --repo "$OWNER/$REPO" --json headRefName,body \
        --jq '((.headRefName | scan("(?:^|[/-])([0-9]{3,5})(?:-|$)") | .[0]),
               (.body // "" | scan("(?i)(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?):? +#([0-9]+)") | .[0])
               | "\(.) move"),
              (.body // "" | scan("#([0-9]+)") | .[0] | "\(.) version")'
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
    [ -z "$item" ] && continue
    IFS=$'\t' read -r item_id status <<<"$item"
    if [[ "$status" == Done* ]]; then
        echo "#$number skipped ($status)"
        continue
    fi
    move=$([ "$kind" = move ] && [ "$status" != Testing ] && echo 1 || true)
    echo "#$number ($kind): $VERSION_FIELD = $version, status \"$status\"${move:+ -> \"$TARGET_STATUS\"}"
    [ "${DRY_RUN:-}" = 1 ] && continue
    gh project item-edit --project-id "$project_id" --id "$item_id" --field-id "$version_field_id" --text "$version" >/dev/null
    if [ -n "$move" ]; then
        gh project item-edit --project-id "$project_id" --id "$item_id" --field-id "$status_field_id" --single-select-option-id "$status_option_id" >/dev/null
    fi
done <<<"$tickets"
