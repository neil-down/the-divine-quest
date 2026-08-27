# Deploy — The Divine Quest

This is a static browser game. It needs no server process; just serve the built files.

## Build output

- Output directory: `dist/`
- Expected files: `index.html`, `bundle.js`, `styles.css`, assets referenced by the game.

## Local deploy script

```bash
chmod +x ./deploy.sh
./deploy.sh
```

`deploy.sh` will:
- Run `npm run build` if `package.json` exists, otherwise require `dist/` to already exist.
- Publish the `dist/` folder to a `gh-pages` branch via a git worktree.
- Skip the push if there are no changes.

After the first push:
1. Enable GitHub Pages in the repository settings.
2. Set **Source** to branch `gh-pages` (root).

## GitHub Actions

`.github/workflows/deploy.yml` runs on push to `main`/`master` and:
- Installs dependencies.
- Builds (`npm run build`).
- Runs tests (`npm test`).
- Deploys `dist/` to GitHub Pages.

To activate:
1. Push this repo to GitHub.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source if prompted.

## General static hosting

Since this is a static site, `dist/` can be hosted anywhere:
- Netlify / Vercel / Cloudflare Pages: point at `dist/`.
- Any S3/Blob bucket with static website hosting.
