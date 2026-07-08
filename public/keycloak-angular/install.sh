#!/usr/bin/env bash
#
# install.sh — fetch the "Keycloak in Angular 21" context pack into a repo, so a
# local coding model can read it and apply Keycloak to your Angular app.
#
# Usage:
#   curl -fsSL https://vanmarkic.github.io/mycelium-blog/keycloak-angular/install.sh | bash
#
# By default it writes into ./.keycloak-angular-pack/ in the current directory.
# Override the target:
#   KCNG_TARGET=docs/keycloak bash install.sh
# Override the source base URL:
#   KCNG_BASE=https://example.com/keycloak-angular bash install.sh
#
# It fetches Markdown docs + ready-to-copy source files. It does NOT modify your
# app or install npm packages — that is the applying agent's job (see APPLY.md).

set -euo pipefail

BASE="${KCNG_BASE:-https://vanmarkic.github.io/mycelium-blog/keycloak-angular}"
TARGET="${KCNG_TARGET:-$(pwd)/.keycloak-angular-pack}"

# Every file in the pack, relative to BASE / TARGET.
FILES=(
  "llms.txt"
  "llms-full.txt"
  "README.md"
  "APPLY.md"
  "recipes/00-overview.md"
  "recipes/01-install.md"
  "recipes/02-app-config.md"
  "recipes/03-bearer-interceptor.md"
  "recipes/04-route-guards.md"
  "recipes/05-auth-store.md"
  "recipes/06-silent-check-sso.md"
  "recipes/07-logout-token.md"
  "recipes/08-keycloak-server.md"
  "recipes/09-testing.md"
  "recipes/10-gotchas.md"
  "src/main.ts"
  "src/app/app.config.ts"
  "src/app/app.routes.ts"
  "src/app/core/auth/auth.store.ts"
  "src/app/core/auth/auth-role.guard.ts"
  "src/app/core/auth/bearer-token.conditions.ts"
  "src/environments/environment.ts"
  "src/public/silent-check-sso.html"
)

echo "Fetching Keycloak+Angular 21 context pack"
echo "  from: $BASE"
echo "  into: $TARGET"

for f in "${FILES[@]}"; do
  dest="$TARGET/$f"
  mkdir -p "$(dirname "$dest")"
  curl -fsSL "$BASE/$f" -o "$dest"
  echo "  wrote $f"
done

cat <<EOF

Done. Next:

  1. Point your local coding model at the pack, e.g.:

       "Read $TARGET/APPLY.md and apply it to this Angular project."

  2. Or, for a single-blob model, feed it:

       $TARGET/llms-full.txt

  3. The model should:
       - npm install keycloak-angular@^21 keycloak-js@^26   (match your Angular major)
       - copy the src/ files into your app, editing environments/environment.ts
       - configure the Keycloak client per recipes/08-keycloak-server.md

  Start here: $TARGET/APPLY.md
EOF
