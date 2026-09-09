import sharp from 'sharp';
const [file, top, height, out] = process.argv.slice(2);
const m = await sharp(file).metadata();
await sharp(file).extract({ left: 0, top: Number(top), width: m.width, height: Math.min(Number(height), m.height - Number(top)) }).png().toFile(out);
console.log(out);
