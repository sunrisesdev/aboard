// Turbopack can't resolve MapLibre's worker URL, so the worker is served from public/ instead (see RouteMapCanvas).
// The version is part of the path, so the files can be cached as immutable (see next.config.ts).
import { cpSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const { version } = JSON.parse(readFileSync(fileURLToPath(import.meta.resolve('maplibre-gl/package.json')), 'utf8'));

const vendorDirectory = new URL('../public/vendor/maplibre/', import.meta.url);
const targetDirectory = new URL(`${version}/`, vendorDirectory);
rmSync(vendorDirectory, { force: true, recursive: true });
mkdirSync(targetDirectory, { recursive: true });

// The worker imports the shared chunk relatively, so both have to be copied.
for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
  cpSync(fileURLToPath(import.meta.resolve(`maplibre-gl/dist/${file}`)), fileURLToPath(new URL(file, targetDirectory)));
}
