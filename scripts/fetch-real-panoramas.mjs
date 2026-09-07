import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { encode } from 'jpeg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const PANO_DIR = path.join(PUBLIC_DIR, 'panoramas');
const THUMB_DIR = path.join(PUBLIC_DIR, 'thumbnails');
const CACHE_DIR = path.join(process.env.TEMP || '.', 'opencode', 'ph');

const OUT_W = 4096;
const OUT_H = 2048;
const THUMB_W = 384;
const THUMB_H = 192;

const SCENES = [
  { scene: 'salon', slug: 'kiara_interior', name: 'Kiara Interior (living)' },
  { scene: 'cocina', slug: 'warm_reception_dinner', name: 'Warm Reception Dinner (comedor)' },
  { scene: 'pasillo', slug: 'large_corridor', name: 'Large Corridor (pasillo)' },
  { scene: 'dormitorio-principal', slug: 'relax_inn_seaview_suite', name: 'Relax Inn Seaview Suite (suite)' },
  { scene: 'dormitorio-2', slug: 'hotel_room', name: 'Hotel Room (dormitorio)' },
  { scene: 'bano', slug: 'modern_bathroom', name: 'Modern Bathroom (baño)' },
  { scene: 'patio', slug: 'sundowner_deck', name: 'Sundowner Deck (patio)' },
  { scene: 'cochera', slug: 'garage', name: 'Garage (cochera)' },
];

mkdirSync(PANO_DIR, { recursive: true });
mkdirSync(THUMB_DIR, { recursive: true });
mkdirSync(CACHE_DIR, { recursive: true });

function readU8(buf, pos) {
  return { v: buf[pos], pos: pos + 1 };
}

function decodeHDR(buffer) {
  let pos = 0;
  while (pos < buffer.length - 1) {
    if (buffer[pos] === 0x0a && buffer[pos + 1] === 0x0a) { pos += 2; break; }
    pos++;
  }
  const headerEnd = buffer.indexOf(0x0a, pos);
  const resLine = buffer.toString('latin1', pos, headerEnd).trim();
  pos = headerEnd + 1;
  const m = /([+-])Y (\d+) ([+-])X (\d+)/.exec(resLine);
  if (!m) throw new Error('No se pudo parsear resolución HDR: ' + resLine);
  const height = parseInt(m[2], 10);
  const width = parseInt(m[4], 10);
  const flip = m[1] === '-';
  const mirror = m[3] === '-';

  const bytes = buffer;
  const count = bytes.length;
  const flat = !(width >= 8 && height >= 8 && bytes[pos] === 2 && bytes[pos + 1] === 2);

  const floats = new Float32Array(width * height * 3);

  function readByte() {
    return bytes[pos++];
  }

  function decodeRLE(w) {
    const out = new Uint8Array(w);
    let cnt = 0;
    while (cnt < w) {
      const code = readByte();
      if (code > 128) {
        const run = code - 128;
        const val = readByte();
        let i = run;
        while (i-- && cnt < w) out[cnt++] = val;
      } else {
        let i = code;
        while (i-- && cnt < w) out[cnt++] = readByte();
      }
    }
    return out;
  }

  if (flat) {
    for (let p = 0; p < width * height; p++) {
      const r = readByte(), g = readByte(), b = readByte(), e = readByte();
      const f = e === 0 ? 0 : 2 ** (e - 136);
      const row = Math.floor(p / width), col = p % width;
      const o = ((flip ? row : height - 1 - row) * width + (mirror ? width - 1 - col : col)) * 3;
      floats[o] = r * f; floats[o + 1] = g * f; floats[o + 2] = b * f;
    }
  } else {
    for (let y = 0; y < height; y++) {
      let col = 0;
      while (col < width) {
        const a = readByte(), b = readByte(), c = readByte(), d = readByte();
        if (a !== 2 || b !== 2) throw new Error(`Scanline RLE inválido en fila ${y}`);
        const wEnc = (c << 8) | d;
        if (wEnc < 1 || wEnc > width) throw new Error(`Ancho de scanline inválido ${wEnc}`);
        const chR = decodeRLE(wEnc), chG = decodeRLE(wEnc), chB = decodeRLE(wEnc), chE = decodeRLE(wEnc);
        const rowBase = (flip ? y : height - 1 - y) * width;
        for (let i = 0; i < wEnc; i++) {
          const colIdx = mirror ? width - 1 - (col + i) : col + i;
          if (colIdx < 0 || colIdx >= width) break;
          const o = (rowBase + colIdx) * 3;
          const e = chE[i];
          const f = e === 0 ? 0 : 2 ** (e - 136);
          floats[o] = chR[i] * f; floats[o + 1] = chG[i] * f; floats[o + 2] = chB[i] * f;
        }
        col += wEnc;
      }
    }
  }
  return { width, height, data: floats };
}

function sRGB(x) {
  return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
}

function toLDR(floats, w, h) {
  const n = w * h;
  const hist = new Float32Array(2048);
  let mn = Infinity, mx = 0;
  for (let i = 0; i < n; i++) {
    const l = 0.2126 * floats[i * 3] + 0.7152 * floats[i * 3 + 1] + 0.0722 * floats[i * 3 + 2];
    if (l < mn) mn = l;
    if (l > mx) mx = l;
  }
  mn = Math.max(mn, 1e-8);
  const logLo = Math.log(mn), logHi = Math.log(mx);
  const span = logHi - logLo || 1;
  for (let i = 0; i < n; i++) {
    const l = 0.2126 * floats[i * 3] + 0.7152 * floats[i * 3 + 1] + 0.0722 * floats[i * 3 + 2];
    const b = Math.min(2047, Math.max(0, Math.floor(((Math.log(Math.max(l, mn)) - logLo) / span) * 2048)));
    hist[b]++;
  }
  let acc = 0, medianBin = 0;
  const half = n / 2;
  for (let b = 0; b < 2048; b++) { acc += hist[b]; if (acc >= half) { medianBin = b; break; } }
  const medianLog = logLo + (span * medianBin) / 2048;
  const median = Math.exp(medianLog);
  const target = 0.4;
  const exposure = target / median;

  const out = new Uint8ClampedArray(n * 3);
  const aces = x => (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  for (let i = 0; i < n; i++) {
    const o = i * 3;
    const r = floats[o] * exposure, g = floats[o + 1] * exposure, b = floats[o + 2] * exposure;
    out[o] = Math.round(sRGB(aces(r)) * 255);
    out[o + 1] = Math.round(sRGB(aces(g)) * 255);
    out[o + 2] = Math.round(sRGB(aces(b)) * 255);
  }
  let black = 0, blown = 0;
  for (let i = 0; i < n * 3; i += 3) {
    if (out[i] < 6 && out[i + 1] < 6 && out[i + 2] < 6) black++;
    if (out[i] > 249 && out[i + 1] > 249 && out[i + 2] > 249) blown++;
  }
  return { out, stats: { blackPct: ((black / n) * 100).toFixed(1), blownPct: ((blown / n) * 100).toFixed(1), median: median.toExponential(2), exposure: exposure.toFixed(2) } };
}

function asciiPreview(rgb, w, h) {
  const cols = 64, rows = 14;
  const stride = rgb.length === w * h * 4 ? 4 : 3;
  const chars = ' .:-=+*#%@';
  let s = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = Math.min(w - 1, Math.floor(((c + 0.5) / cols) * w));
      const py = Math.min(h - 1, Math.floor(((r + 0.5) / rows) * h));
      const i = (py * w + px) * stride;
      const l = (0.2126 * rgb[i] + 0.7152 * rgb[i + 1] + 0.0722 * rgb[i + 2]) / 255;
      s += chars[Math.min(chars.length - 1, Math.floor(l * chars.length))];
    }
    s += '\n';
  }
  return s;
}

function toRGBA(rgb) {
  const n = rgb.length / 3;
  const out = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    out[i * 4] = rgb[i * 3];
    out[i * 4 + 1] = rgb[i * 3 + 1];
    out[i * 4 + 2] = rgb[i * 3 + 2];
    out[i * 4 + 3] = 255;
  }
  return out;
}

function resizeBilinear(src, w, h, tw, th) {
  const out = new Uint8Array(tw * th * 3);
  for (let y = 0; y < th; y++) {
    const sy = ((y + 0.5) / th) * h - 0.5;
    const y0 = Math.max(0, Math.floor(sy)), y1 = Math.min(h - 1, y0 + 1);
    const fy = sy - y0;
    for (let x = 0; x < tw; x++) {
      const sx = ((x + 0.5) / tw) * w - 0.5;
      const x0 = Math.max(0, Math.floor(sx)), x1 = Math.min(w - 1, x0 + 1);
      const fx = sx - x0;
      const o = (y * tw + x) * 3;
      for (let c = 0; c < 3; c++) {
        const a = src[(y0 * w + x0) * 3 + c] * (1 - fx) + src[(y0 * w + x1) * 3 + c] * fx;
        const b = src[(y1 * w + x0) * 3 + c] * (1 - fx) + src[(y1 * w + x1) * 3 + c] * fx;
        out[o + c] = a * (1 - fy) + b * fy;
      }
    }
  }
  return out;
}

async function download(url, file) {
  if (existsSync(file)) return;
  console.log(`  descargando ${path.basename(file)} ...`);
  const t0 = Date.now();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} para ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(file, buf);
  console.log(`  ok ${(buf.length / 1048576).toFixed(1)} MB en ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

for (const s of SCENES) {
  console.log(`\n== ${s.scene} <- ${s.slug} (${s.name})`);
  const meta = JSON.parse(readFileSync(path.join(CACHE_DIR, `${s.slug}.json`), 'utf8'));
  const url = meta.hdri['4k'].hdr.url;
  const cacheFile = path.join(CACHE_DIR, `${s.slug}_4k.hdr`);
  await download(url, cacheFile);

  const t0 = Date.now();
  const { width, height, data } = decodeHDR(readFileSync(cacheFile));
  if (width !== OUT_W || height !== OUT_H) console.log(`  aviso: resolución ${width}x${height}`);
  const { out, stats } = toLDR(data, width, height);
  const panoRGB = width === OUT_W ? out : resizeBilinear(out, width, height, OUT_W, OUT_H);
  const pano = toRGBA(panoRGB);
  const thumb = toRGBA(resizeBilinear(panoRGB, OUT_W, OUT_H, THUMB_W, THUMB_H));

  const panoName = path.join(PANO_DIR, `${s.scene}.jpg`);
  const thumbName = path.join(THUMB_DIR, `${s.scene}.jpg`);
  writeFileSync(panoName, encode({ data: Buffer.from(pano.buffer, pano.byteOffset, pano.byteLength), width: OUT_W, height: OUT_H }, 85).data);
  writeFileSync(thumbName, encode({ data: Buffer.from(thumb.buffer, thumb.byteOffset, thumb.byteLength), width: THUMB_W, height: THUMB_H }, 80).data);
  console.log(`  proceso ${((Date.now() - t0) / 1000).toFixed(1)}s  negro=${stats.blackPct}%  quemado=${stats.blownPct}%  median=${stats.median}  exposure=${stats.exposure}`);
  console.log(asciiPreview(pano, OUT_W, OUT_H));
  console.log(`  -> ${panoName.replace(PUBLIC_DIR, '/public')}`);
}

writeFileSync(
  path.join(PUBLIC_DIR, 'panoramas', 'FUENTES.txt'),
  'Panoramas 360° reales de Poly Haven (https://polyhaven.com — licencia CC0, uso comercial libre).\n' +
  'Descargados vía inmersa-demo/scripts/fetch-real-panoramas.mjs y convertidos a JPG (auto-exposición + ACES).\n' +
  SCENES.map(s => `${s.scene} <- ${s.slug}`).join('\n') + '\n',
);
console.log('\nListo. Fuentes documentadas en public/panoramas/FUENTES.txt');