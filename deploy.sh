#!/usr/bin/env bash
set -euo pipefail

# deploy.sh — Publish this static site to the gh-pages branch for GitHub Pages.
# Idempotent and safe: never force-pushes to origin master.

echo "=== Deploy: starting ==="

# 1) Build
if [[ -f package.json ]]; then
  echo "-> package.json detected; building with npm"
  npm run build
else
  echo "-> No package.json found. This project is a static site."
  echo "   Ensure the built site lives in the ./dist directory."
  if [[ ! -d dist ]]; then
    echo "ERROR: ./dist directory not found. Create it with your built assets (index.html + bundle.js) and retry."
    exit 1
  fi
fi

# 2) Sanity checks
if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git is not installed or not in PATH."
  exit 1
fi

if [[ ! -d .git ]]; then
  echo "ERROR: .git directory not found. Run this from the repo root."
  exit 1
fi

# Prevent accidental force-push to master/main
branch="$(git rev-parse --abbrev-ref HEAD || echo unknown)"
if [[ "$branch" == "master" || "$branch" == "main" ]]; then
  echo "ERROR: Refusing to deploy from protected branch '$branch' to avoid overwriting it."
  echo "Create a deploy branch or run from a feature branch."
  exit 1
fi

# 3) Prepare gh-pages branch in a separate worktree
worktree_dir="$(mktemp -d)/the-divine-quest-gh-pages"
pages_branch="gh-pages"

echo "-> Preparing worktree for '$pages_branch' branch"

if git show-ref --verify --quiet "refs/heads/$pages_branch"; then
  git worktree add "$worktree_dir" "$pages_branch"
else
  # Create orphan branch if it doesn't exist
  git worktree add --detach "$worktree_dir"
  pushd "$worktree_dir" >/dev/null
  git checkout --orphan "$pages_branch"
  git rm -rf . >/dev/null 2>&1 || true
  popd >/dev/null
fi

# 4) Copy dist contents into the worktree
echo "-> Copying dist/ -> gh-pages worktree"
# Clean the worktree except .git
find "$worktree_dir" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +

# Copy built artifacts
cp -a dist/. "$worktree_dir"/

# SPA fallback: copy index.html to 404.html so GitHub Pages serves the app
# on deep links / refreshes of unknown routes.
if [[ -f "$worktree_dir/index.html" ]]; then
  cp "$worktree_dir/index.html" "$worktree_dir/404.html"
  echo "-> Created 404.html fallback for SPA routing"
fi

# 5) Commit and push
pushd "$worktree_dir" >/dev/null

git config user.email "deploy@example.com" >/dev/null 2>&1 || true
git config user.name  "Deploy Script"   >/dev/null 2>&1 || true

git add -A
git diff --cached --quiet && echo "-> No changes to deploy." || {
  git commit -m "chore: deploy site to gh-pages [skip ci]"
  echo "-> Pushing $pages_branch to origin"
  git push origin "$pages_branch"
}
popd >/dev/null

# 6) Cleanup
git worktree remove --force "$worktree_dir" >/dev/null 2>&1 || true

echo "=== Deploy: complete ==="
echo "Next steps:"
echo "  - Enable GitHub Pages for this repo, source: branch 'gh-pages'."
echo "  - Or install/authenticate the GitHub CLI: https://cli.github.com/"
