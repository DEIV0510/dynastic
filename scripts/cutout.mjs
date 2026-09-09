import sharp from 'sharp';
import fs from 'fs';
const SRC = 'C:/Users/Lenovo/Desktop/DYNASTIC';
const OUT = 'scripts/_cut';
fs.mkdirSync(OUT, { recursive: true });
const files = ['camara.png','cargador.png','diadema.png','parlante.png','powerbank.png','proyector.png','reloj.png','smartwatch.png','termos.png'];

function integral(mask, W, H) {
  const I = new Int32Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) {
    let rs = 0;
    for (let x = 0; x < W; x++) {
      rs += mask[y * W + x];
      I[(y + 1) * (W + 1) + x + 1] = I[y * (W + 1) + x + 1] + rs;
    }
  }
  return I;
}
const box = (I, W, H, x, y, r) => {
  const x0 = Math.max(0, x - r), y0 = Math.max(0, y - r);
  const x1 = Math.min(W, x + r + 1), y1 = Math.min(H, y + r + 1);
  const S = W + 1;
  return {
    sum: I[y1 * S + x1] - I[y0 * S + x1] - I[y1 * S + x0] + I[y0 * S + x0],
    area: (x1 - x0) * (y1 - y0),
  };
};

for (const f of files) {
  const { data, info } = await sharp(`${SRC}/${f}`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info, N = W * H;
  const lum = new Uint8Array(N), gray = new Uint8Array(N);
  const light = new Uint8Array(N), dark = new Uint8Array(N);
  for (let p = 0, i = 0; p < N; p++, i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    lum[p] = (r * 0.299 + g * 0.587 + b * 0.114) | 0;
    if (Math.max(r, g, b) - Math.min(r, g, b) < 20 && lum[p] >= 185) {
      gray[p] = 1;
      if (lum[p] >= 243) light[p] = 1;
      else if (lum[p] <= 233 && lum[p] >= 196) dark[p] = 1;
    }
  }
  const IL = integral(light, W, H), ID = integral(dark, W, H);
  const R1 = 14, R2 = 7;
  const seed = new Uint8Array(N), prop = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x;
    if (!gray[p]) continue;
    const a = box(IL, W, H, x, y, R1), b = box(ID, W, H, x, y, R1);
    if (a.sum > a.area * 0.18 && b.sum > b.area * 0.18) seed[p] = 1;
    const d2 = box(ID, W, H, x, y, R2), l2 = box(IL, W, H, x, y, R2);
    if (d2.sum > d2.area * 0.14 && l2.sum > l2.area * 0.14) prop[p] = 1;
  }
  // flood fill: seeds on the border, propagate through `prop`
  const bg = new Uint8Array(N); const st = [];
  const push = (p, m) => { if (m[p] && !bg[p]) { bg[p] = 1; st.push(p); } };
  for (let x = 0; x < W; x++) { push(x, seed); push((H - 1) * W + x, seed); }
  for (let y = 0; y < H; y++) { push(y * W, seed); push(y * W + W - 1, seed); }
  const run = () => {
    while (st.length) {
      const p = st.pop(), x = p % W, y = (p / W) | 0;
      if (x > 0) push(p - 1, prop); if (x < W - 1) push(p + 1, prop);
      if (y > 0) push(p - W, prop); if (y < H - 1) push(p + W, prop);
    }
  };
  run();
  // enclosed checkerboard pockets (headband gaps, handles, strap holes)
  const seen = new Uint8Array(N);
  for (let s0 = 0; s0 < N; s0++) {
    if (!prop[s0] || bg[s0] || seen[s0]) continue;
    const comp = [], q = [s0]; seen[s0] = 1; let seeds = 0;
    while (q.length) {
      const p = q.pop(); comp.push(p); if (seed[p]) seeds++;
      const x = p % W, y = (p / W) | 0, nb = [];
      if (x > 0) nb.push(p - 1); if (x < W - 1) nb.push(p + 1);
      if (y > 0) nb.push(p - W); if (y < H - 1) nb.push(p + W);
      for (const r of nb) if (prop[r] && !seen[r]) { seen[r] = 1; q.push(r); }
    }
    if (comp.length > 900 && seeds > comp.length * 0.4) for (const p of comp) bg[p] = 1;
  }
  // close anti-aliased seams
  for (let pass = 0; pass < 2; pass++) {
    const add = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const p = y * W + x;
      if (bg[p] || !gray[p]) continue;
      if ((x > 0 && bg[p - 1]) || (x < W - 1 && bg[p + 1]) || (y > 0 && bg[p - W]) || (y < H - 1 && bg[p + W])) add.push(p);
    }
    for (const p of add) bg[p] = 1;
  }
  let kept = 0;
  const alpha = Buffer.alloc(N);
  for (let p = 0; p < N; p++) { alpha[p] = bg[p] ? 0 : 255; if (!bg[p]) kept++; }
  const ab = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(0.8).linear(1.7, -80).toColourspace("b-w").raw().toBuffer();
  const rgba = Buffer.alloc(N * 4);
  for (let p = 0; p < N; p++) {
    rgba[p * 4] = data[p * 3]; rgba[p * 4 + 1] = data[p * 3 + 1]; rgba[p * 4 + 2] = data[p * 3 + 2]; rgba[p * 4 + 3] = ab[p];
  }
  const m = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 1 }).png().toFile(`${OUT}/${f}`);
  console.log(f.padEnd(20), `kept=${((kept / N) * 100).toFixed(1)}% -> ${m.width}x${m.height}`);
}
