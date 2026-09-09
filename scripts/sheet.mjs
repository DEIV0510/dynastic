import sharp from 'sharp';
import fs from 'fs';
const dir = process.argv[2], out = process.argv[3];
const files = fs.readdirSync(dir).filter(f=>f.endsWith('.png')).sort();
const CELL=320, COLS=5;
const rows = Math.ceil(files.length/COLS);
const comps = [];
for (let i=0;i<files.length;i++){
  const buf = await sharp(`${dir}/${files[i]}`).resize(CELL-20, CELL-20, {fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
  comps.push({input: buf, left: (i%COLS)*CELL+10, top: Math.floor(i/COLS)*CELL+10});
}
await sharp({create:{width:COLS*CELL, height:rows*CELL, channels:4, background:{r:255,g:0,b:255,alpha:1}}})
  .composite(comps).png().toFile(out);
console.log(out, files.join(' '));
