# Deploy Verification — The Divine Quest

## Exact deploy command

```bash
bash deploy.sh
```

`deploy.sh` performs the following steps in order:
1. Runs `npm run build` (which invokes `node esbuild.config.js`) to produce `dist/`.
2. Validates that git is available and that the repo is not on a protected branch (`master`/`main`).
3. Creates a temporary worktree for the `gh-pages` branch (or reuses it if it exists).
4. Copies `dist/` into the worktree.
5. Creates `404.html` as a copy of `index.html` so GitHub Pages serves the SPA on deep links / refreshes.
6. Commits and pushes `gh-pages` to `origin` if there are changes.
7. Cleans up the worktree.

## Fresh build verification

`node esbuild.config.js` runs successfully and produces:
- `dist/index.html`
- `dist/bundle.js`
- `dist/styles.css`

Confirmed by direct execution on `2026-08-27`.

## Actions workflow validity

`.github/workflows/deploy.yml` is valid YAML and implements a working GitHub Pages deployment:

- Triggers on push to `main`/`master` and manual `workflow_dispatch`.
- Uses `actions/checkout@v4`, `actions/setup-node@v4` (Node 20), `npm install`, `npm run build`.
- Uploads `./dist` via `actions/upload-pages-artifact@v3`.
- Deploys with `actions/deploy-pages@v4`.

**Fixes applied:**
- Changed `npm ci` → `npm install` because the repo does not include a `package-lock.json`.
- Removed `npm test` step because no `test` script is defined in `package.json`; the step would fail in CI.

## Live GitHub Pages URL pattern

`git remote -v` returned no remotes, so the exact user/repo cannot be deduced from local state.

Expected URL once the repo is pushed to GitHub and Pages is enabled:

```
https://<GITHUB_USERNAME>.github.io/the-divine-quest/
```

**What's needed to enable Pages:**
1. Push the repository to GitHub under `<GITHUB_USERNAME>/the-divine-quest`.
2. In repository **Settings → Pages → Build and deployment**, set the source to **GitHub Actions** (the workflow will handle the deploy) **or** set the source to the `gh-pages` branch (root) if using `deploy.sh` locally.

If using the Actions workflow, no additional Pages configuration is usually required beyond granting the workflow `pages: write` and `id-token: write` permissions (already present).
