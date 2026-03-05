#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POSTS_PATH="$ROOT_DIR/posts"
TARGET_PATH="${DATA_LEVERAGE_BLOGS_PATH:-$ROOT_DIR/../../content/data-leverage-blogs}"
MIGRATE=0

if [[ "${1:-}" == "--migrate" ]]; then
  MIGRATE=1
elif [[ -n "${1:-}" ]]; then
  echo "Usage: $0 [--migrate]"
  exit 1
fi

if [[ ! -d "$TARGET_PATH" ]]; then
  echo "ERROR: Target content directory does not exist: $TARGET_PATH"
  exit 1
fi

TARGET_ABS="$(cd "$TARGET_PATH" && pwd -P)"

if [[ -L "$POSTS_PATH" ]]; then
  if [[ ! -d "$POSTS_PATH" ]]; then
    echo "ERROR: posts is a broken symlink: $POSTS_PATH"
    exit 1
  fi

  CURRENT_ABS="$(cd "$POSTS_PATH" && pwd -P)"
  if [[ "$CURRENT_ABS" != "$TARGET_ABS" ]]; then
    if [[ "$MIGRATE" -eq 1 ]]; then
      rm "$POSTS_PATH"
      ln -s "$TARGET_PATH" "$POSTS_PATH"
      echo "Updated posts symlink to: $TARGET_ABS"
      exit 0
    fi

    echo "ERROR: posts points to a different location: $CURRENT_ABS"
    echo "Expected: $TARGET_ABS"
    echo "Run with --migrate to rewrite the symlink."
    exit 1
  fi

  echo "posts symlink is valid: $TARGET_ABS"
  exit 0
fi

if [[ -e "$POSTS_PATH" ]]; then
  if [[ "$MIGRATE" -eq 1 ]]; then
    BACKUP_PATH="$ROOT_DIR/posts.local-backup-$(date +%Y%m%d-%H%M%S)"
    mv "$POSTS_PATH" "$BACKUP_PATH"
    ln -s "$TARGET_PATH" "$POSTS_PATH"
    echo "Moved existing posts to: $BACKUP_PATH"
    echo "Created posts symlink to: $TARGET_ABS"
    exit 0
  fi

  echo "ERROR: posts exists but is not a symlink: $POSTS_PATH"
  echo "Run with --migrate to move it aside and create a symlink."
  exit 1
fi

ln -s "$TARGET_PATH" "$POSTS_PATH"
echo "Created posts symlink to: $TARGET_ABS"
