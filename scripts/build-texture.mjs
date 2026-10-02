// Reconstructs the lab's seamless marble/dithered background texture (public/images/marble-tex.webp)
// from base64 source chunks checked in under src/assets/texture-chunks/.
//
// Why chunks instead of a single committed binary: this repo is maintained through tooling that can
// only commit text content, so the image is kept as base64 text (split into fixed-size chunks purely
// to keep each source file small and easy to diff/review) and decoded back into a real binary webp
// here, once, before every build. Runs automatically via the "postinstall" npm script, so it's in
// place both for local `npm run dev` / `npm run build` and in CI before `astro build`.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const chunkDir = join(root, 'src', 'assets', 'texture-chunks');
const outDir = join(root, 'public', 'images');
const outPath = join(outDir, 'marble-tex.webp');

const chunkFiles = readdirSync(chunkDir)
  .filter((f) => f.endsWith('.b64'))
  .sort();

if (chunkFiles.length === 0) {
  throw new Error(`No .b64 texture chunks found in ${chunkDir}`);
}

const base64 = chunkFiles.map((f) => readFileSync(join(chunkDir, f), 'utf8').trim()).join('');
mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, Buffer.from(base64, 'base64'));

console.log(`build-texture: wrote ${outPath} from ${chunkFiles.length} chunk(s), ${base64.length} base64 chars.`);
