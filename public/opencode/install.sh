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

# Local file-drop plugins. Usage tracking (opencode-token-tracker) is an npm
# plugin referenced in opencode.json's "plugin" array — OpenCode installs it
# automatically at startup, so it isn't fetched here.
PLUGINS=(context-guard.js session-hygiene.js)

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

  2. Usage tracking is opencode-token-tracker (in the "plugin" array of the
     config). It only DISPLAYS — it never blocks. It groups by day in your
     machine's local time, so set your clock to Brussels if that's what you want:

       timedatectl set-timezone Europe/Brussels   # (Linux) or however your OS does it

     After first run, see totals with its CLI:

       opencode-tokens today          # today's usage
       opencode-tokens --by daily     # day-by-day breakdown
       # optional daily budget status toast (USD, warn-only, never blocks):
       opencode-tokens config set budget.daily 20

  3. Restart OpenCode. Verify plugins loaded:

       opencode run --print-logs "hi" 2>&1 | grep -Ei "token-tracker|context-guard|session-hygiene"

  Config:        $TARGET/opencode.json
  Local plugins: $TARGET/plugins/{${PLUGINS[*]}}
  Tracker config: $TARGET/token-tracker.json   (managed via 'opencode-tokens config')
EOF
