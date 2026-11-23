import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { poses } from '../src/data/projection-motion.mjs';
import { createGlb } from './projection-glb.mjs';
import { createUsda } from './projection-usd.mjs';
import { createUsdz } from './usdz-archive.mjs';

const leaf = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="192" height="56" viewBox="0 0 192 56">
  <defs><linearGradient id="paper"><stop stop-color="#4388c7"/><stop offset=".45" stop-color="#96e7ff"/><stop offset="1" stop-color="#ddffff"/></linearGradient></defs>
  <rect x="1" y="1" width="190" height="54" rx="3" fill="url(#paper)" fill-opacity=".87" stroke="#edffff" stroke-width="2"/>
  <path d="M18 14h137m-137 9h147m-147 9h113m-113 9h130" fill="none" stroke="#31699d" stroke-width="2" opacity=".78"/>
</svg>`);
const textures = await Promise.all(poses.map(async name=>({name,png:await readFile('tmp/projection/'+name+'.png')})));
textures.push({name:'Leaf',png:await sharp(leaf).png().toBuffer()});

const scratch = await mkdtemp(join(tmpdir(),'iskin-usd-'));
try {
  const ascii = join(scratch,'projection.usda'), crate = join(scratch,'projection.usdc');
  await writeFile(ascii,createUsda());
  if (process.env.BLENDER_EXE) {
    execFileSync(process.env.BLENDER_EXE,['-b','--factory-startup','--python-exit-code','1','--python-expr',
      'import sys; from pxr import Sdf; assert Sdf.Layer.FindOrOpen(sys.argv[-2]).Export(sys.argv[-1])','--',ascii,crate],{stdio:'inherit'});
  } else {
    execFileSync('usdcat',[ascii,'-o',crate],{stdio:'inherit'});
  }
  const glb=createGlb(textures);
  const usdz=createUsdz([['projection.usdc',await readFile(crate)],...textures.map(({name,png})=>['textures/'+name+'.png',png])]);
  const base='public/ar/iskin-projection-billboard';
  await writeFile(base+'.glb',glb);
  await writeFile(base+'.usdz',usdz);
  console.log('Generated native projection. GLB '+glb.length+' bytes, USDZ '+usdz.length+' bytes.');
} finally {
  await rm(scratch,{recursive:true,force:true});
}
