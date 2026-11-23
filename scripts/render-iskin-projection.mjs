// Bake the game's projection light and threads. The book leaf moves separately.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
const game = path.resolve('../game/КрасноЦарство.exe/game');
const width=428, height=618;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const mix=(a,b,t)=>a*(1-t)+b*t;
const fract=x=>x-Math.floor(x);
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
const artwork = { reading:'iskin_reading.png', closing:'iskin_folio.png', stowed:'iskin_wry.png', reach:'monocle_reach.webp', approach:'monocle_approach.webp', touch:'iskin_left.png' };
// The closed folio is drawn in leather. Retain the hands and decorative
// embossing, and light the cover in the same cyan as the open virtual book.
function lightFolio(source) {
  for (let y=0;y<570;y++) for (let x=0;x<380;x++) {
    const px=x*240/380, py=y*360/570;
    const u=(px-54-.25*(py-205))/73;
    const v=(py-205+13*u)/40;
    if (u<0 || u>1 || v<0 || v>1) continue;
    const i=(y*380+x)*4, [r,g,b]=source.subarray(i,i+3);
    const ink=1-smooth(20,43,r-b);
    const luma=(.3*r+.59*g+.11*b)/255;
    const rim=1-smooth(0,.07,Math.min(u,1-u,v,1-v));
    const tone=clamp(.24+luma*1.05+rim*.25);
    [38+122*tone,104+145*tone,158+97*tone].forEach((light,c)=>{source[i+c]=mix(source[i+c],light,ink);});
  }
}
await mkdir('public/ar/reading',{recursive:true});
await mkdir('tmp/projection',{recursive:true});
for (const [pose, file] of Object.entries(artwork)) {
  const source = await sharp(path.join(game, 'images/iskin', file)).ensureAlpha().resize(380,570).raw().toBuffer();
  if (pose==='closing') lightFolio(source);
  const body=Buffer.alloc(width*height*4);
  for(let y=0;y<570;y++)for(let x=0;x<380;x++) {
    const from=(y*380+x)*4, to=((y+24)*width+x+24)*4;
    source.copy(body,to,from,from+4);
  }
  const out=Buffer.from(body), t=0;
  const alphaAt=(u,v)=>body[(Math.floor(clamp(v)* (height-1))*width+Math.floor(clamp(u)*(width-1)))*4+3]/255;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const uvx=x/width, uvy=y/height, i=(y*width+x)*4;
    let a=body[i+3]/255, rgb=[body[i]/255,body[i+1]/255,body[i+2]/255];
    if(uvy>.65) {
      const depth=smooth(.65,.99,uvy), gather=mix(1,.4,depth);
      let tx=.5+(uvx-.5)/gather+depth*(.014*Math.sin(uvy*17-t*.55)+.009*Math.sin(uvx*21+uvy*12));
      tx+=.012*depth*Math.sin(tx*26+uvy*12-.45*t);
      const lane=tx*43, variation=fract(Math.sin(Math.floor(lane)*57.13)*4375.37), finish=mix(.895,.997,variation);
      const life=1-smooth(finish-.047,finish,uvy), distance=Math.abs(fract(lane)-.5);
      const warp=Math.exp(-distance*distance*46), weft=Math.pow(.5+.5*Math.cos((uvy*130+tx*26-t*.42)*Math.PI*2),5);
      const envelope=alphaAt(clamp(tx,.001,.999),Math.min(uvy,.685))*life*smooth(.65,.745,uvy);
      const weave=envelope*(warp*(.63+.23*variation)+weft*(1-depth)*.23);
      const pulse=.5+.5*Math.cos(uvy*31-t*1.15+Math.floor(lane)*.39), release=smooth(.675,.875,uvy);
      const silk=[mix(.12,.51,.42*variation+.45*pulse),mix(.39,.96,.42*variation+.45*pulse),mix(.96,1,.42*variation+.45*pulse)];
      a*=1-release;
      const thread=clamp(weave*(.88+.25*pulse),0,.98);
      const resultAlpha=a+(1-a)*thread;
      rgb=rgb.map((value,c)=>resultAlpha ? (value*a*(1-thread)+silk[c]*thread)/resultAlpha : 0);
      a=resultAlpha;
    }
    let rings=0;
    for(let k=0;k<2;k++) {
      const dx=uvx-.5, dy=uvy-(.736+.093*k+.016*Math.sin(t*.75+k))+dx*(.092-.035*k);
      const ex=dx/(.445-.064*k), ey=dy/(.048+.012*k), distance=Math.abs(Math.hypot(ex,ey)-1);
      rings+=mix(1-a,1,smooth(-.22,.22,ey))*(.65+.35*Math.sin(Math.atan2(ey,ex)-t*.95+k))*(Math.exp(-distance*37)+.34*Math.exp(-distance*6.5));
    }
    const light=clamp(rings*.84,0,.94), finalAlpha=a+(1-a)*light;
    for(let c=0;c<3;c++)out[i+c]=255*clamp(finalAlpha ? (rgb[c]*a*(1-light)+[.21,.93,1][c]*light)/finalAlpha : 0);
    out[i+3]=255*finalAlpha;
  }
  await sharp(out,{raw:{width,height,channels:4}}).png({palette:true,colours:256,quality:90,effort:8}).toFile(`tmp/projection/${pose}.png`);
  if (pose!=='reading') await sharp(`tmp/projection/${pose}.png`).resize({width:350})
    .webp({quality:80,alphaQuality:75,effort:6}).toFile(`public/ar/reading/${pose}.webp`);
  if(pose==='reading')await sharp(out,{raw:{width,height,channels:4}}).webp({quality:84}).toFile('public/characters/iskin-projection-reading.webp');
}
console.log('Exported six registered game poses and a static poster.');
