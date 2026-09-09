import sharp from 'sharp';
import fs from 'fs';
const DIR='scripts/_cut';
for (const f of fs.readdirSync(DIR).filter(x=>x.endsWith('.png'))) {
  const { data, info } = await sharp(`${DIR}/${f}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width:W,height:H}=info, N=W*H;
  const solid=new Uint8Array(N);
  for(let p=0;p<N;p++) solid[p]= data[p*4+3]>140 ?1:0;
  // keep only connected components of meaningful size
  const seen=new Uint8Array(N); const comps=[];
  for(let s=0;s<N;s++){
    if(!solid[s]||seen[s])continue;
    const c=[]; const st=[s]; seen[s]=1;
    while(st.length){const p=st.pop();c.push(p);const x=p%W,y=(p/W)|0;const nb=[];
      if(x>0)nb.push(p-1); if(x<W-1)nb.push(p+1); if(y>0)nb.push(p-W); if(y<H-1)nb.push(p+W);
      for(const r of nb) if(solid[r]&&!seen[r]){seen[r]=1;st.push(r);} }
    comps.push(c);
  }
  comps.sort((a,b)=>b.length-a.length);
  const keep=new Uint8Array(N);
  const minSize=Math.max(400, comps[0].length*0.004);
  let kept=0;
  for(const c of comps){ if(c.length>=minSize){kept++; for(const p of c) keep[p]=1;} }
  // dilate keep by 3 px so soft edges survive
  let cur=keep;
  for(let i=0;i<3;i++){ const nx=Uint8Array.from(cur);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=y*W+x; if(cur[p])continue;
      if((x>0&&cur[p-1])||(x<W-1&&cur[p+1])||(y>0&&cur[p-W])||(y<H-1&&cur[p+W])) nx[p]=1;}
    cur=nx; }
  let removed=0;
  for(let p=0;p<N;p++) if(!cur[p]&&data[p*4+3]>0){data[p*4+3]=0;removed++;}
  const m = await sharp(data,{raw:{width:W,height:H,channels:4}}).trim({threshold:1}).png().toFile(`${DIR}/${f}`);
  console.log(f.padEnd(20),`comps=${comps.length} kept=${kept} strayPx=${removed} -> ${m.width}x${m.height}`);
}
