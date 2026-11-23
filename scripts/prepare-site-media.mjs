// Website-only exports. Game originals are never changed.
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root = process.cwd();
const game = path.resolve(root, '../game/КрасноЦарство.exe/game');
const assets = JSON.parse(await readFile('scripts/atlas-assets.json', 'utf8'));
assets.push(
  {source:'images/map/map_krascarsvo.jpg', target:'public/atlas/map.webp', width:1920},
  {source:'images/library_post/ledger.webp', target:'public/atlas/binding.webp', width:1600},
  {source:'images/map/atlas_front_cover.webp', target:'public/atlas/cover.webp', width:420},
);
for (const asset of assets) {
  await mkdir(path.dirname(asset.target), {recursive:true});
  await sharp(path.join(game, asset.source)).resize({width:asset.width, withoutEnlargement:true}).webp({quality:78, effort:5}).toFile(asset.target);
}
const scenes = ['bg/hall_knowledge.jpg','bg/artifact_store.jpg','bg/harbor.jpg','chapter1/workshop_threshold.webp','chapter1/sleeping_gorynych.png'];
for (const [index, source] of scenes.entries()) {
  await sharp(path.join(game,'images',source)).resize({width:1920}).webp({quality:78}).toFile(`src/assets/backgrounds/bg${index+1}.webp`);
  await sharp(path.join(game,'images',source)).resize({width:800}).webp({quality:73}).toFile(`src/assets/backgrounds/bg${index+1}-mobile.webp`);
}
await sharp(path.join(game,'gui/library/reading_room.webp')).resize({width:1920}).webp({quality:80}).toFile('src/assets/backgrounds/hero-bg.webp');
await sharp(path.join(game,'gui/library/reading_room.webp')).resize({width:960}).webp({quality:76}).toFile('src/assets/backgrounds/hero-bg-mobile.webp');
for (let i=1;i<=11;i++) {
  await sharp(`src/assets/images/gallery-${i}.webp`).resize({width:640}).webp({quality:76}).toFile(`src/assets/images/gallery-${i}-thumb.webp`);
}
console.log(`Prepared ${assets.length} atlas assets, responsive scenes and 11 gallery thumbnails.`);
