// Builds the static site into the repo root: assets/app.js + assets/app.css.
// Usage: npm install && npm run build   (Node 18+)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const NODE_PATHS = (process.env.NODE_PATH || '').split(':').filter(Boolean);
const req = (m) => { try { return require.resolve(m); } catch { for (const p of NODE_PATHS) { try { return require.resolve(m, { paths: [p] }); } catch {} } throw new Error('Missing ' + m + ' (run npm install)'); } };
const esbuild = await import(req('esbuild'));
const twDir = path.dirname(req('tailwindcss/package.json'));
const { compile } = await import(path.join(twDir, 'dist/lib.mjs'));

fs.mkdirSync('assets', { recursive: true });
await esbuild.build({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es2020', 'safari15'],
  outfile: 'assets/app.js',
  jsx: 'automatic',
  nodePaths: NODE_PATHS,
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
});

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const cands = new Set();
for (const f of [...walk('src'), 'index.html'].filter((f) => /\.(jsx?|html)$/.test(f)))
  for (const m of fs.readFileSync(f, 'utf8').matchAll(/[^\s"'`{}<>;]+/g)) cands.add(m[0]);
const compiler = await compile(fs.readFileSync('src/styles.css', 'utf8'), {
  base: 'src',
  loadStylesheet: async (id, base) => {
    const p = id === 'tailwindcss' ? path.join(twDir, 'index.css') : path.resolve(base, id);
    return { path: p, base: path.dirname(p), content: fs.readFileSync(p, 'utf8') };
  },
});
const css = (await esbuild.transform(compiler.build([...cands]), { loader: 'css', minify: true })).code;
fs.writeFileSync('assets/app.css', css);
console.log('Built assets/app.js (' + (fs.statSync('assets/app.js').size / 1024).toFixed(0) + ' KB) and assets/app.css (' + (css.length / 1024).toFixed(0) + ' KB)');
