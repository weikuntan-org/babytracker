#!/bin/bash
# PreToolUse(Bash) hook — block `gh pr create` until /review AND /security-review
# have been run on the CURRENT commit of the current branch. Sessions touch the
# marker file for the corresponding skill on completion.
set -uo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("tool_input",{}).get("command",""))')

# Only act on `gh pr create` invocations. Match `gh pr create` as a whole-word
# command (allow leading whitespace, `rtk gh ...`, `... && gh pr create ...`).
if ! printf '%s' "$cmd" | grep -qE '(^|[^a-zA-Z0-9_-])gh[[:space:]]+pr[[:space:]]+create([[:space:]]|$)'; then
    exit 0
fi

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)
sha=$(git rev-parse HEAD 2>/dev/null || echo unknown)
slug=${branch//[^a-zA-Z0-9_-]/_}
marker_dir="/tmp/claude-review-markers"
review_marker="${marker_dir}/${slug}__${sha}.review"
security_marker="${marker_dir}/${slug}__${sha}.security-review"

mkdir -p "$marker_dir" 2>/dev/null || true

missing=()
[ -f "$review_marker" ]          || missing+=("/review")
[ -f "$security_marker" ]        || missing+=("/security-review")

if [ ${#missing[@]} -eq 0 ]; then
    exit 0   # both present, allow
fi

joined=$(printf '%s, ' "${missing[@]}")
joined=${joined%, }

# Emit a deny JSON with a clear instruction. Note: the reason text is shown to
# Claude verbatim and to the user via the permission UI.
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Before opening a PR, run ${joined} on this branch (commit ${sha:0:7}). After each one finishes, mark it complete: \`touch ${review_marker}\` and/or \`touch ${security_marker}\`. Both markers must exist for the current commit before \`gh pr create\` is allowed. New commits invalidate prior markers — re-run the reviews."
  }
}
EOF
exit 0
