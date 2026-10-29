// Convierte las fotos de iPhone (.heic / .heif) de SRC_RAW a JPG en scripts/_cut.
//
//   npm run assets:heic
//
// Por qué existe: sharp no decodifica HEVC (el códec del HEIC de iPhone), así que
// build-assets.mjs no puede leerlas. heic-convert sí (libheif en WASM).
// Detalle: a veces llegan truncadas por unos bytes (subida o descarga a medias) y
// libheif falla con «bad seek». Si pasa, se reintenta con el final relleno de
// ceros; el decodificador lo tolera y la imagen sale completa.
import fs from 'node:fs';
import path from 'node:path';
import convert from 'heic-convert';

const SRC_RAW = 'C:/Users/Lenovo/Desktop/DYNASTIC';
const OUT = 'scripts/_cut';
fs.mkdirSync(OUT, { recursive: true });

const decode = async (buffer) =>
  Buffer.from(await convert({ buffer, format: 'JPEG', quality: 0.95 }));

const files = fs.readdirSync(SRC_RAW).filter((f) => /\.(heic|heif)$/i.test(f));
if (!files.length) console.log('No hay .heic/.heif en', SRC_RAW);

for (const f of files) {
  const src = path.join(SRC_RAW, f);
  // «IMG_2787.HEIC.heif» -> «IMG_2787»
  const name = f.replace(/(\.(heic|heif))+$/i, '');
  const out = path.join(OUT, `${name}.jpg`);

  if (fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(src).mtimeMs) {
    console.log(`${f}  ->  ${out}  (ya convertida)`);
    continue;
  }

  const input = fs.readFileSync(src);
  let jpg;
  let relleno = false;
  try {
    jpg = await decode(input);
  } catch {
    relleno = true;
    jpg = await decode(Buffer.concat([input, Buffer.alloc(4096)]));
  }
  fs.writeFileSync(out, jpg);
  console.log(
    `${f}  ->  ${out}  (${(jpg.length / 1048576).toFixed(1)} MB${relleno ? ', archivo truncado: se rellenó el final' : ''})`,
  );
}
