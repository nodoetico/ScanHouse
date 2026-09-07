import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { encode } from 'jpeg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const PANO_DIR = path.join(PUBLIC_DIR, 'panoramas');
const THUMB_DIR = path.join(PUBLIC_DIR, 'thumbnails');

const W = 3072;
const H = 1536;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const mix = (a, b, t) => [a[0] * (1 - t) + b[0] * t, a[1] * (1 - t) + b[1] * t, a[2] * (1 - t) + b[2] * t];
const shade = (c, f) => [clamp(c[0] * f, 0, 255), clamp(c[1] * f, 0, 255), clamp(c[2] * f, 0, 255)];
const yawDiff = (a, b) => ((a - b + 540) % 360) - 180;
const mod = (a, n) => ((a % n) + n) % n;

function renderScene(sceneFn) {
  const data = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) {
    const pitch = 90 - (y / H) * 180;
    for (let x = 0; x < W; x++) {
      const yaw = (x / W) * 360;
      let c = sceneFn(yaw, pitch, x, y);
      const dith = ((x * 31 + y * 17) % 7 - 3) * 0.8;
      const i = (y * W + x) * 4;
      data[i] = clamp(Math.round(c[0] + dith), 0, 255);
      data[i + 1] = clamp(Math.round(c[1] + dith), 0, 255);
      data[i + 2] = clamp(Math.round(c[2] + dith), 0, 255);
      data[i + 3] = 255;
    }
  }
  return data;
}

function saveJpg(filePath, data, width, height, quality = 88) {
  const raw = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  const encoded = encode({ data: raw, width, height }, quality);
  writeFileSync(filePath, Buffer.from(encoded.data));
}

function writeScene(id, sceneFn) {
  console.time(`  ${id}`);
  const data = renderScene(sceneFn);
  saveJpg(path.join(PANO_DIR, `${id}.jpg`), data, W, H);

  const TW = 384;
  const TH = 192;
  const thumb = new Uint8Array(TW * TH * 4);
  for (let ty = 0; ty < TH; ty++) {
    for (let tx = 0; tx < TW; tx++) {
      const x = Math.floor(((tx + 0.5) / TW) * W);
      const y = Math.floor(((ty + 0.5) / TH) * H);
      const si = (y * W + x) * 4;
      const di = (ty * TW + tx) * 4;
      thumb[di] = data[si];
      thumb[di + 1] = data[si + 1];
      thumb[di + 2] = data[si + 2];
      thumb[di + 3] = 255;
    }
  }
  saveJpg(path.join(THUMB_DIR, `${id}.jpg`), thumb, TW, TH, 78);
  console.timeEnd(`  ${id}`);
}

function interior(palette) {
  const {
    wall = [196, 189, 177],
    wallTop = null,
    floor = [170, 158, 143],
    ceiling = [238, 236, 231],
    accent = [56, 50, 44],
    windows = [],
    doors = [],
    objects = [],
  } = palette;

  const wallHigh = wallTop || shade(wall, 1.12);

  return function (yaw, pitch) {
    let c;

    if (pitch > 68) {
      c = mix(shade(ceiling, 0.86), ceiling, (90 - pitch) / 22);
    } else if (pitch < -40) {
      const depth = (-pitch - 40) / 50;
      c = mix(floor, shade(floor, 0.52), clamp(depth, 0, 1));
      const glow = clamp(1 - Math.abs(yawDiff(yaw, 0)) / 90, 0, 1);
      c = shade(c, 1 + 0.1 * glow);
    } else if (pitch >= -40 && pitch <= 68) {
      const t = (pitch + 40) / 108;
      c = mix(floor, mix(wall, wallHigh, t), 0.72);
      if (pitch < -37) c = mix(c, accent, 0.85);
      if (pitch > 66) c = shade(c, 0.94);
    } else {
      c = wall;
    }

    for (const win of windows) {
      const { center = 0, halfY = 22, top = 42, bottom = -34, glow = [255, 242, 214] } = win;
      const dy = yawDiff(yaw, center);
      if (pitch <= top && pitch >= bottom && Math.abs(dy) <= halfY) {
        let f = 0;
        if (pitch >= -32 && pitch <= 40 && Math.abs(dy) <= halfY - 2) {
          f = Math.exp(-(dy * dy) / (2 * 9 * 9)) * Math.exp(-(Math.pow(pitch - 8, 2)) / (2 * 30 * 30));
          c = mix(glow, shade(glow, 1.1), 0.5);
          c = shade(c, 0.75 + 0.55 * f);
        } else {
          c = mix(c, shade(glow, 0.55), 0.9);
        }
        if (pitch >= -32 && pitch <= 40 && Math.abs(Math.abs(dy) - (halfY - 2)) < 1.1) {
          c = shade(c, 0.45);
        }
      }
    }

    for (const door of doors) {
      const { yaw: cy, wDeg = 13, topP = 30, bottomP = -38 } = door;
      if (yawDiff(yaw, cy) <= wDeg && pitch <= topP && pitch >= bottomP) {
        const t = (pitch + 38) / (topP + 38);
        c = mix([24, 20, 18], [52, 46, 40], t);
        if (Math.abs(yawDiff(yaw, cy)) > wDeg - 1 || Math.abs(pitch - topP) < 1 || Math.abs(pitch - bottomP) < 1) {
          c = shade(c, 1.6);
        }
      }
    }

    for (const obj of objects) {
      const { yaw: cy, wDeg = 14, topP = -18, bottomP = -38, color = [70, 62, 54], cap = null } = obj;
      if (yawDiff(yaw, cy) <= wDeg && pitch <= topP && pitch >= bottomP) {
        const t = (pitch - bottomP) / (topP - bottomP);
        if (cap) c = mix(shade(color, 0.7), cap, clamp(t * 1.3, 0, 1));
        else c = mix(shade(color, 0.55), shade(color, 1.12), clamp(t, 0, 1));
      }
    }

    return c;
  };
}

function patio() {
  const skyZenith = [34, 64, 96];
  const skyHorizon = [188, 205, 216];
  const lawn = [58, 92, 52];
  const deck = [150, 108, 66];
  const wallC = [206, 192, 168];
  const pergola = [120, 82, 48];

  return function (yaw, pitch) {
    let c;
    if (pitch > 0) {
      const h = pitch / 90;
      c = mix(skyHorizon, skyZenith, Math.pow(h, 0.72));
      if (yawDiff(yaw, 180) > -20 && pitch > 60 && Math.abs(yawDiff(yaw, 180)) < 40) {
        const s = Math.exp(-Math.pow(yawDiff(yaw, 180), 2) / 900);
        c = mix(c, [255, 214, 160], 0.25 * s * (1 - h) + 0.06);
      }
    } else {
      const depth = (-pitch) / 90;
      c = mix(lawn, shade(lawn, 0.45), clamp(depth, 0, 1));
      if (Math.abs(yawDiff(yaw, 0)) < 55 && pitch > -38) {
        const t = (pitch + 38) / 26;
        c = mix(deck, shade(deck, 0.62), clamp(t * 0.7, 0, 1));
        if (mod(Math.floor(pitch * 2) + Math.floor(yaw / 6), 2) === 0) c = shade(c, 0.93);
      }
      if (pitch <= -38 && pitch >= -58) {
        const bump = Math.sin(yaw * 3.4) * 0.5 + 0.5;
        c = shade(c, 0.8 + 0.35 * bump);
      }
      if (yawDiff(yaw, 0) > -55 && yawDiff(yaw, 0) < 55 && pitch <= -38) {
        c = shade(c, 0.85);
      }
    }

    if (pitch <= 66 && pitch >= -32 && Math.abs(yawDiff(yaw, 0)) <= 52) {
      c = mix(shade(wallC, 1.06), wallC, clamp((pitch + 32) / 98, 0, 1));
      if (Math.abs(yawDiff(yaw, 0)) > 50) c = shade(c, 0.82);
      if (pitch < -30) c = shade(c, 0.7);
    }

    if (pitch <= 58 && pitch >= -30 && Math.abs(yawDiff(yaw, 0)) <= 16) {
      const t = (pitch + 30) / 88;
      c = mix([26, 24, 22], [78, 96, 116], clamp(t, 0, 1));
      c = mix(c, [255, 250, 236], 0.22);
      if (Math.abs(yawDiff(yaw, 0)) > 14 || pitch < -28 || pitch > 56) c = shade(c, 1.7);
    }

    if (pitch > 66 && Math.abs(yawDiff(yaw, 0)) <= 78) {
      c = pergola;
      if (mod(Math.floor(pitch * 5), 4) === 0) c = mix(c, [20, 16, 12], 0.7);
    }

    if (pitch <= -6 && pitch >= -22 && yawDiff(yaw, 30) >= -8 && yawDiff(yaw, 30) <= 8) {
      const t = (pitch + 22) / 16;
      c = mix(shade([40, 38, 36], 0.7), [168, 172, 176], clamp(t, 0, 1));
      if (yawDiff(yaw, 30) > 6.5) c = mix(c, [60, 58, 56], 0.85);
    }

    return c;
  };
}

function cochera() {
  const conc = [150, 152, 156];
  const concDark = [110, 111, 115];
  const roof = [168, 170, 174];

  return function (yaw, pitch) {
    let c;
    if (pitch > 62) {
      c = shade(roof, 0.82);
      if (mod(Math.floor(yaw * 4), 2) === 0) c = shade(c, 0.86);
    } else if (pitch < -40) {
      const depth = (-pitch - 40) / 50;
      c = mix(conc, shade(concDark, 0.5), clamp(depth, 0, 1));
    } else {
      const t = (pitch + 40) / 102;
      c = mix(concDark, conc, clamp(t, 0, 1));
      if (pitch < -38) c = shade(c, 0.7);
      if (pitch > 60) c = shade(c, 0.85);
    }

    if (yawDiff(yaw, -90) <= 30 && pitch <= 46 && pitch >= -38) {
      const t = (pitch + 38) / 84;
      c = mix([22, 20, 20], [66, 74, 70], clamp(t, 0, 1));
      if (Math.abs(yawDiff(yaw, -90)) > 28 || pitch > 44 || pitch < -36) c = shade(c, 1.65);
    }

    if (pitch <= 30 && pitch >= -20 && Math.abs(yawDiff(yaw, 0)) <= 8) {
      c = [78, 82, 88];
      if (pitch > 12 && pitch < 30) c = mix(c, [120, 150, 140], clamp((30 - pitch) / 18, 0, 1));
      if (Math.abs(yawDiff(yaw, 0)) > 7) c = shade(c, 1.7);
    }

    if (pitch < -40) {
      if (mod(Math.floor(yaw / 6), 2) === 0) c = shade(c, 0.9);
    }

    return c;
  };
}

function buildScenes() {
  return [
    { id: 'salon', fn: interior({
      wall: [198, 190, 178], floor: [170, 158, 143], ceiling: [240, 238, 233], accent: [60, 52, 46],
      windows: [{ center: 0, halfY: 24, top: 44, bottom: -34 }],
      doors: [{ yaw: 90, topP: 30 }, { yaw: -90, topP: 30 }, { yaw: 180, topP: 30 }],
      objects: [
        { yaw: 45, wDeg: 9, topP: -4, color: [52, 48, 46], cap: [120, 66, 40] },
        { yaw: -45, wDeg: 10, topP: -10, color: [210, 220, 226], cap: [238, 244, 248] },
        { yaw: 8, wDeg: 20, topP: -22, bottomP: -38, color: [130, 122, 110], cap: [166, 158, 146] },
        { yaw: -12, wDeg: 12, topP: -15, bottomP: -38, color: [72, 66, 60], cap: [90, 82, 74] },
      ],
    }) },
    { id: 'cocina', fn: interior({
      wall: [226, 222, 216], floor: [205, 196, 184], ceiling: [242, 240, 236], accent: [88, 90, 92],
      windows: [{ center: 0, halfY: 20, top: 40, bottom: -20, glow: [255, 248, 230] }],
      doors: [{ yaw: -90, topP: 30 }, { yaw: 180, topP: 30 }],
      objects: [
        { yaw: 30, wDeg: 10, topP: -12, color: [34, 34, 36], cap: [64, 64, 66] },
        { yaw: -30, wDeg: 9, topP: -8, bottomP: -30, color: [24, 24, 26], cap: [40, 40, 42] },
        { yaw: 5, wDeg: 16, topP: -16, bottomP: -38, color: [120, 116, 112], cap: [168, 164, 160] },
      ],
    }) },
    { id: 'pasillo', fn: interior({
      wall: [210, 205, 198], floor: [176, 168, 160], ceiling: [236, 234, 230], accent: [74, 70, 66],
      windows: [],
      doors: [{ yaw: 90, topP: 30 }, { yaw: -90, topP: 30 }, { yaw: 0, topP: 30 }, { yaw: 180, topP: 30 }, { yaw: -45, topP: 30 }],
      objects: [
        { yaw: 45, wDeg: 6, topP: -14, bottomP: -38, color: [150, 148, 144], cap: [196, 196, 194] },
      ],
    }) },
    { id: 'dormitorio-principal', fn: interior({
      wall: [196, 182, 164], floor: [148, 112, 78], ceiling: [238, 234, 226], accent: [70, 56, 44],
      windows: [{ center: -45, halfY: 22, top: 42, bottom: -12, glow: [255, 240, 214] }],
      doors: [{ yaw: 180, topP: 30 }, { yaw: -90, topP: 28 }],
      objects: [
        { yaw: 10, wDeg: 18, topP: -10, color: [90, 76, 64], cap: [150, 138, 124] },
        { yaw: 45, wDeg: 12, topP: -6, color: [96, 78, 60], cap: [176, 158, 136] },
        { yaw: -20, wDeg: 15, topP: -18, bottomP: -38, color: [110, 102, 94], cap: [150, 142, 134] },
      ],
    }) },
    { id: 'dormitorio-2', fn: interior({
      wall: [200, 198, 190], floor: [152, 118, 86], ceiling: [238, 236, 230], accent: [66, 58, 50],
      windows: [{ center: -30, halfY: 20, top: 42, bottom: -10, glow: [255, 242, 218] }],
      doors: [{ yaw: 0, topP: 30 }],
      objects: [
        { yaw: 10, wDeg: 16, topP: -12, color: [86, 78, 70], cap: [140, 132, 122] },
        { yaw: 30, wDeg: 12, topP: -4, color: [120, 108, 96], cap: [190, 180, 168] },
      ],
    }) },
    { id: 'bano', fn: interior({
      wall: [224, 226, 228], floor: [196, 200, 204], ceiling: [236, 238, 240], accent: [150, 156, 160],
      windows: [{ center: 0, halfY: 14, top: 20, bottom: -16, glow: [255, 250, 240] }],
      doors: [{ yaw: 180, topP: 30 }, { yaw: 90, topP: 30 }],
      objects: [
        { yaw: -45, wDeg: 10, topP: 0, color: [170, 180, 188], cap: [220, 228, 232] },
        { yaw: 25, wDeg: 11, topP: -14, color: [208, 214, 218], cap: [244, 248, 250] },
      ],
    }) },
    { id: 'patio', fn: patio() },
    { id: 'cochera', fn: cochera() },
  ];
}

function main() {
  mkdirSync(PANO_DIR, { recursive: true });
  mkdirSync(THUMB_DIR, { recursive: true });
  for (const s of buildScenes()) {
    writeScene(s.id, s.fn);
  }
  console.log('Panoramas + thumbnails generados correctamente.');
}

main();