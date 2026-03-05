#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_PATH="${DATA_LEVERAGE_BLOGS_PATH:-$ROOT_DIR/../../content/data-leverage-blogs}"
POSTS_PATH="$ROOT_DIR/posts"
REPAIR=0

if [[ "${1:-}" == "--repair" ]]; then
  REPAIR=1
elif [[ -n "${1:-}" ]]; then
  echo "Usage: $0 [--repair]"
  exit 1
fi

if [[ ! -d "$SOURCE_PATH" ]]; then
  echo "ERROR: Canonical content directory not found: $SOURCE_PATH"
  exit 1
fi

if [[ -L "$POSTS_PATH" ]]; then
  if [[ "$REPAIR" -eq 1 ]]; then
    rm "$POSTS_PATH"
  else
    echo "ERROR: posts is a symlink, but Quarto listings require a real directory."
    echo "Run with --repair to replace it with a synced directory."
    exit 1
  fi
fi

if [[ -e "$POSTS_PATH" && ! -d "$POSTS_PATH" ]]; then
  echo "ERROR: posts exists and is not a directory: $POSTS_PATH"
  exit 1
fi

mkdir -p "$POSTS_PATH"

rsync -a --delete \
  --include='*/' \
  --include='*.md' \
  --include='*.qmd' \
  --exclude='*' \
  "$SOURCE_PATH"/ "$POSTS_PATH"/

TOTAL_FILES="$(find "$POSTS_PATH" -maxdepth 1 -type f \( -name '*.md' -o -name '*.qmd' \) | wc -l | tr -d ' ')"
echo "Synced $TOTAL_FILES post files from $SOURCE_PATH to $POSTS_PATH"
