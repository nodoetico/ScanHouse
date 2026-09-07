import { readFileSync } from 'node:fs';
import path from 'node:path';
import { decode } from 'jpeg-js';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PANO_DIR = path.resolve(__dirname, '../public/panoramas');

function lum(r, g, b) { return 0.2126 * r + 0.7152 * g + 0.0722 * b; }

function analyze(file) {
  const { data, width, height } = decode(readFileSync(file));
  // sample a few full rows to compute adjacent-row correlation at lags
  const stride = 4;
  const L = {};
  const rows = [];
  for (let y = 0; y < height; y += Math.max(1, Math.floor(height / 400))) {
    const row = new Float32Array(width);
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * stride;
      row[x] = lum(data[i], data[i + 1], data[i + 2]);
    }
    rows.push(row);
  }
  // correlation between consecutive sampled rows at lags -16..16
  const lags = {};
  for (let r = 1; r < rows.length; r++) {
    const a = rows[r - 1], b = rows[r];
    const n = a.length;
    for (let lag = -16; lag <= 16; lag++) {
      let s = 0, ca = 0, cb = 0, ma = 0, mb = 0;
      for (let i = 0; i < n; i++) { if (lags[lag] === undefined) break; }
      for (let i = Math.max(0, -lag); i + Math.max(0, lag) < n; i++) { ma += a[i]; mb += b[i + lag]; }
      const m = Math.max(1, n - Math.abs(lag));
      ma /= m; mb /= m;
      let na = 0, nb = 0;
      for (let i = Math.max(0, -lag); i + Math.max(0, lag) < n; i++) {
        const va = a[i] - ma, vb = b[i + lag] - mb;
        s += va * vb; na += va * va; nb += vb * vb;
      }
      lags[lag] = (lags[lag] || 0) + s / Math.sqrt(na * nb + 1e-9);
    }
  }
  let best = null;
  for (const lag of Object.keys(lags)) {
    const v = lags[lag] / (rows.length - 1);
    if (!best || Math.abs(v) > Math.abs(best.v)) best = { lag: +lag, v: v.toFixed(3) };
  }
  // coherence: mean abs corr at lag 0 and at best lag
  const c0 = (lags[0] / (rows.length - 1)).toFixed(3);
  const cBest = best.v;
  // blur detector: energy of vertical Laplacian on a middle patch
  let lap = 0, n = 0;
  const y0 = Math.floor(height * 0.4), y1 = Math.floor(height * 0.6);
  for (let y = y0 + 1; y < y1 - 1; y += 2) {
    const rowT = (y - 1) * width, rowM = y * width, rowB = (y + 1) * width;
    for (let x = 4; x < width - 4; x += 4) {
      const iT = (rowT + x) * stride, iM = (rowM + x) * stride, iB = (rowB + x) * stride;
      const lt = lum(data[iT], data[iT + 1], data[iT + 2]);
      const lm = lum(data[iM], data[iM + 1], data[iM + 2]);
      const lb = lum(data[iB], data[iB + 1], data[iB + 2]);
      lap += (lb - 2 * lm + lt) ** 2; n++;
    }
  }
  // distribution check (coherent rooms are rarely 100% vertical stripes)
  return { c0, cBestLag: best.lag, cBest, laplacian: Math.sqrt(lap / n).toFixed(2), size: `${width}x${height}` };
}

import { spawnSync } from 'node:child_process';
const scenes = ['salon', 'cocina', 'pasillo', 'dormitorio-principal', 'dormitorio-2', 'bano', 'patio', 'cochera'];
for (const sc of scenes) {
  const f = path.join(PANO_DIR, `${sc}.jpg`);
  console.log(sc, JSON.stringify(analyze(f)));
}