import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_RAW = 'C:/Users/Lenovo/Desktop/DYNASTIC';
const CUT = 'scripts/_cut';
const OUT_P = 'public/img/products';
const OUT_B = 'public/img/brand';
fs.mkdirSync(OUT_P, { recursive: true });
fs.mkdirSync(OUT_B, { recursive: true });

// slug -> source file (cutouts first, originals where alpha was already real)
const products = {
  'audifonos-airpods-pro2': `${SRC_RAW}/audifonos.png`,
  'audifonos-airpods-pro2-g2': `${SRC_RAW}/airpods.png`,
  'audifonos-airpods-pro2-g3': `${SRC_RAW}/airpods2.png`,
  'audifonos-airpods-serie4': `${SRC_RAW}/airpods3.png`,
  'diadema-soundcore': `${CUT}/diadema.png`,
  'smartwatch-deportivo': `${CUT}/smartwatch.png`,
  'reloj-diduna-chrono': `${CUT}/reloj.png`,
  'parlante-havit-rgb': `${CUT}/parlante.png`,
  'powerbank-20000': `${CUT}/powerbank.png`,
  'cargador-jellico-gan': `${CUT}/cargador.png`,
  'proyector-wanbo-fhd': `${CUT}/proyector.png`,
  'intercom-freedconn': `${SRC_RAW}/intercomunicador.png`,
  'camara-tapo': `${CUT}/camara.png`,
  'termo-bottle': `${CUT}/termos.png`,

  // ── incorporación 2026-09-22: fotos reales subidas por el cliente ────────
  // audio
  'audifonos-jkmx-tws': `${SRC_RAW}/audifono3.png`,
  'audifonos-jkmx-tws-g2': `${SRC_RAW}/audifonos3.png`,
  'audifonos-jkmx-tws-g3': `${SRC_RAW}/audifono5.png`,
  'audifonos-jkmx-tws-g4': `${SRC_RAW}/audifonos4.png`,
  // diademas
  'diadema-airmax-style': `${SRC_RAW}/airmax.png`,
  'diadema-airmax-style-g2': `${SRC_RAW}/airmax2.png`,
  // smartwatch
  'smartwatch-hk11-promax': `${SRC_RAW}/reloj2.png`,
  'smartwatch-hk11-promax-g2': `${SRC_RAW}/reloj3.png`,
  'smartwatch-hk11-promax-g3': `${SRC_RAW}/reloj4.png`,
  'smartwatch-harvic-swc962': `${SRC_RAW}/reloj5.png`,
  'smartwatch-harvic-swc964': `${SRC_RAW}/reloj6.png`,
  'smartwatch-harvic-swc964-g2': `${SRC_RAW}/reloj7.png`,
  'smartwatch-harvic-swc964-g3': `${SRC_RAW}/reloj8.png`,
  // relojes
  'reloj-curren-clasico': `${SRC_RAW}/reloj19.png`,
  'reloj-curren-clasico-g2': `${SRC_RAW}/reloj10.png`,
  'reloj-curren-clasico-g3': `${SRC_RAW}/reloj22.png`,
  'reloj-curren-clasico-g4': `${SRC_RAW}/reloj26.png`,
  'reloj-curren-deportivo': `${SRC_RAW}/reloj16.png`,
  'reloj-curren-deportivo-g2': `${SRC_RAW}/reloj15.png`,
  'reloj-curren-automatico': `${SRC_RAW}/reloj17.png`,
  'reloj-curren-automatico-g2': `${SRC_RAW}/reloj18.png`,
  'reloj-sanda-digital': `${SRC_RAW}/reloj12.png`,
  'reloj-sanda-digital-g2': `${SRC_RAW}/reloj11.png`,
  'reloj-sanda-digital-g3': `${SRC_RAW}/reloj13.png`,
  'reloj-sanda-digital-g4': `${SRC_RAW}/reloj14.png`,
  'reloj-digital-retro': `${SRC_RAW}/relojes.png`,
  'reloj-scottie': `${SRC_RAW}/relojmujer.png`,
  'reloj-scottie-g2': `${SRC_RAW}/relojmujer2.png`,
  'reloj-scottie-g3': `${SRC_RAW}/relojmujer3.png`,
  // proyectores
  'proyector-hy300-mini': `${SRC_RAW}/projector.png`,
  'proyector-hy300-mini-g2': `${SRC_RAW}/projector2.png`,
  'proyector-hy300-mini-g3': `${SRC_RAW}/projector3.png`,
  // intercomunicadores
  'intercom-sofistek-xz02': `${SRC_RAW}/intercomunicador2.png`,
  'intercom-sofistek-xz02-g2': `${SRC_RAW}/intercomunicador3.png`,
  'intercom-sofistek-xz02-g3': `${SRC_RAW}/intercomunicador4.png`,
  'intercom-q58max': `${SRC_RAW}/intercomunicador5.png`,
  'intercom-q58max-g2': `${SRC_RAW}/intercomunicador6.png`,
  'intercom-q58max-g3': `${SRC_RAW}/intercomunicador7.png`,
  // parlantes
  'parlante-jbl-boombox3xl': `${SRC_RAW}/parlante10.png`,
  'parlante-jbl-boombox3xl-g2': `${SRC_RAW}/parlante11.png`,
  'parlante-jbl-boombox3xl-g3': `${SRC_RAW}/parlante6.png`,
  'parlante-jbl-boombox3xl-g4': `${SRC_RAW}/parlante9.png`,
  'parlante-jbl-boombox4': `${SRC_RAW}/parlante7.png`,
  'parlante-jbl-boombox4-g2': `${SRC_RAW}/parlante8.png`,
  'parlante-jbl-boombox4-g3': `${SRC_RAW}/parlante5.png`,
  'parlante-jbl-boombox4-g4': `${SRC_RAW}/parlante4.png`,
  'parlante-harvic-pr810': `${SRC_RAW}/parlante12.png`,
  'parlante-harvic-pr810-g2': `${SRC_RAW}/parlante13.png`,
  'parlante-harvic-pr811': `${SRC_RAW}/parlante2.png`,
  'parlante-harvic-pr831': `${SRC_RAW}/parlante3.png`,
  // tv box
  'tvbox-onn-googletv': `${SRC_RAW}/watch.png`,
};

const WIDTHS = [320, 640, 960];
const manifest = {};

for (const [slug, src] of Object.entries(products)) {
  const meta = await sharp(src).metadata();
  const sizes = [];
  for (const w of WIDTHS) {
    if (w > meta.width) continue; // never upscale
    const file = `${slug}-${w}.webp`;
    await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82, alphaQuality: 90, effort: 6 })
      .toFile(path.join(OUT_P, file));
    sizes.push(w);
  }
  if (!sizes.length) {
    // source smaller than 320
    const file = `${slug}-${meta.width}.webp`;
    await sharp(src)
      .webp({ quality: 82, alphaQuality: 90, effort: 6 })
      .toFile(path.join(OUT_P, file));
    sizes.push(meta.width);
  }
  manifest[slug] = { sizes, w: meta.width, h: meta.height };
  console.log(slug.padEnd(24), `${meta.width}x${meta.height}`, '->', sizes.join(','));
}

// brand + editorial composites
const brand = {
  'logo-full': { src: `${SRC_RAW}/logosinfondo.png`, widths: [240, 480, 960] },
  'hero-lineup': { src: `${SRC_RAW}/productos.png`, widths: [640, 1024, 1536] },
};
for (const [name, { src, widths }] of Object.entries(brand)) {
  const meta = await sharp(src).metadata();
  const sizes = [];
  for (const w of widths) {
    if (w > meta.width) continue;
    await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 84, alphaQuality: 92, effort: 6 })
      .toFile(path.join(OUT_B, `${name}-${w}.webp`));
    sizes.push(w);
  }
  manifest[name] = { sizes, w: meta.width, h: meta.height };
  console.log(name.padEnd(24), `${meta.width}x${meta.height}`, '->', sizes.join(','));
}

// symbol only: crop the triangle mark out of the wordmark lockup
{
  const src = `${SRC_RAW}/logosinfondo.png`;
  const meta = await sharp(src).metadata();
  const cropW = Math.round(meta.width * 0.37);
  const cropped = await sharp(src)
    .extract({ left: 0, top: 0, width: cropW, height: meta.height })
    .png()
    .toBuffer();
  const sym = await sharp(cropped).trim({ threshold: 6 }).png().toBuffer();
  for (const w of [96, 192, 384]) {
    await sharp(sym)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 88, alphaQuality: 95, effort: 6 })
      .toFile(path.join(OUT_B, `symbol-${w}.webp`));
  }
  await sharp(sym).resize({ width: 180 }).png().toFile(path.join(OUT_B, 'symbol.png'));
  const sm = await sharp(sym).metadata();
  manifest['symbol'] = { sizes: [96, 192, 384], w: sm.width, h: sm.height };
  console.log('symbol'.padEnd(24), `${sm.width}x${sm.height}`);
}

// social share card (Open Graph) — logo over the product lineup on deep black
{
  const bg = await sharp({
    create: { width: 1200, height: 630, channels: 4, background: { r: 4, g: 6, b: 11, alpha: 1 } },
  })
    .png()
    .toBuffer();
  const line = await sharp(`${SRC_RAW}/productos.png`)
    .resize({ width: 1200, height: 470, fit: 'cover', position: 'bottom' })
    .png()
    .toBuffer();
  const logo = await sharp(`${SRC_RAW}/logosinfondo.png`).resize({ width: 520 }).png().toBuffer();
  const lm = await sharp(logo).metadata();
  await sharp(bg)
    .composite([
      { input: line, top: 160, left: 0 },
      {
        input: await sharp({
          create: {
            width: 1200,
            height: 630,
            channels: 4,
            background: { r: 4, g: 6, b: 11, alpha: 0.55 },
          },
        })
          .png()
          .toBuffer(),
        top: 0,
        left: 0,
      },
      { input: logo, top: Math.round((630 - lm.height) / 2), left: Math.round((1200 - 520) / 2) },
    ])
    .jpeg({ quality: 86 })
    .toFile('public/img/brand/og.jpg');
  console.log('og.jpg'.padEnd(24), '1200x630');
}

fs.writeFileSync('src/data/images.json', JSON.stringify(manifest, null, 2));
console.log('\nmanifest -> src/data/images.json');
