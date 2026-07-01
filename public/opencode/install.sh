#!/usr/bin/env bash
#
# install.sh — install the OpenCode token-frugal config + plugins.
#
# Usage:
#   curl -fsSL https://vanmarkic.github.io/mycelium-blog/opencode/install.sh | bash
#
# Or download and run, choosing where to install:
#   bash install.sh              # global: ~/.config/opencode  (default)
#   bash install.sh --project    # project: ./.opencode  (in the current repo)
#
# Environment overrides:
#   OPENCODE_BUNDLE_BASE   base URL to fetch from
#                          (default https://vanmarkic.github.io/mycelium-blog/opencode)
#   OPENCODE_CONFIG_DIR    explicit target dir (overrides --project / default)
#
# It backs up an existing opencode.json before writing, and never touches your
# API keys — those stay in your environment.

set -euo pipefail

BASE="${OPENCODE_BUNDLE_BASE:-https://vanmarkic.github.io/mycelium-blog/opencode}"

TARGET=""
case "${1:-}" in
  --project) TARGET="$(pwd)/.opencode" ;;
  --global|"") TARGET="${XDG_CONFIG_HOME:-$HOME/.config}/opencode" ;;
  *) echo "Unknown option: $1" >&2; echo "Use --global (default) or --project." >&2; exit 2 ;;
esac
TARGET="${OPENCODE_CONFIG_DIR:-$TARGET}"

PLUGINS=(daily-usage.js context-guard.js session-hygiene.js)

echo "Installing OpenCode bundle from: $BASE"
echo "Target config dir:              $TARGET"

mkdir -p "$TARGET/plugins"

fetch() {
  # fetch <remote-path> <local-path>
  curl -fsSL "$BASE/$1" -o "$2"
  echo "  wrote $2"
}

# Config — back up any existing one first.
if [ -f "$TARGET/opencode.json" ]; then
  ts="$(date +%Y%m%d-%H%M%S)"
  cp "$TARGET/opencode.json" "$TARGET/opencode.json.bak-$ts"
  echo "  backed up existing config to opencode.json.bak-$ts"
fi
fetch "opencode.json" "$TARGET/opencode.json"

# Plugins (auto-loaded from the plugins/ directory).
for p in "${PLUGINS[@]}"; do
  fetch "plugins/$p" "$TARGET/plugins/$p"
done

# Lean AGENTS.md template — only if the current dir doesn't already have one.
if [ ! -f "$(pwd)/AGENTS.md" ]; then
  fetch "AGENTS.md" "$(pwd)/AGENTS.md"
  echo "  (placed a lean AGENTS.md template in the current directory)"
fi

cat <<EOF

Done. Next steps:

  1. Set your API keys / endpoints in your shell profile:

       export DASHSCOPE_API_KEY=...            # Qwen via Alibaba Model Studio
       export ORNITH_BASE_URL=http://localhost:8000/v1   # your Ornith server
       export ORNITH_API_KEY=...               # any non-empty value if unauth'd

  2. (Optional) Daily-usage display settings (it only DISPLAYS, never blocks):

       export OPENCODE_USAGE_TZ=Europe/Brussels        # day boundary + clock
       export OPENCODE_DAILY_TOKEN_TARGET=40000000     # shown as "X% of 40M"; 0 hides it
       # export OPENCODE_USAGE_TOAST=0                  # logs only, no toast

  3. Restart OpenCode. Verify the plugins loaded:

       opencode run --print-logs "hi" 2>&1 | grep -i "daily-usage active"

  Config:  $TARGET/opencode.json
  Plugins: $TARGET/plugins/{${PLUGINS[*]}}
  State:   \${XDG_DATA_HOME:-\$HOME/.local/share}/opencode/daily-usage.json
EOF
