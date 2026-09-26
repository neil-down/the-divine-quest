import { build } from 'esbuild';
import { copyFileSync, cpSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const outDir = `${__dirname}/dist`;
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// bundle-entry.js imports every game module + the content bridge in load order;
// esbuild concatenates them into a single IIFE bundle.
build({
  entryPoints: [`${__dirname}/bundle-entry.js`],
  bundle: true,
  format: 'iife',
  outfile: `${outDir}/bundle.js`,
  minify: true,
  write: true,
}).then(() => {
  console.log('Build complete: dist/bundle.js');

  // Copy styles.css
  copyFileSync(`${__dirname}/styles.css`, `${outDir}/styles.css`);
  console.log('Copied styles.css -> dist/');

  // Copy PWA + static files (deployed to the site root).
  ['pwa.js', 'sw.js', 'offline.html', 'manifest.webmanifest'].forEach((file) => {
    if (existsSync(`${__dirname}/${file}`)) {
      copyFileSync(`${__dirname}/${file}`, `${outDir}/${file}`);
      console.log(`Copied ${file} -> dist/`);
    }
  });

  // Copy vendor assets (self-hosted, offline-first).
  if (existsSync(`${__dirname}/assets`)) {
    cpSync(`${__dirname}/assets`, `${outDir}/assets`, { recursive: true });
    console.log('Copied assets/ -> dist/');
  }

  // dist/index.html is derived from the SOURCE index.html (single source of
  // truth for markup/styles) with the dev module scripts swapped for the
  // bundled script.
  const srcHtml = readFileSync(`${__dirname}/index.html`, 'utf8');
  const distHtml = srcHtml
      .replace(/<script\s+src="[^"]*\.js"\s*><\/script>\s*/g, '')
      .replace('</body>', '    <script src="bundle.js"></script>\n</body>');
  writeFileSync(`${outDir}/index.html`, distHtml);
  console.log('Wrote dist/index.html referencing bundle.js');
}).catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});