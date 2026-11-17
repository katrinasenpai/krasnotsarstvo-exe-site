// Run deliberately when refreshing the site from the author's approved novel.
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const game = path.resolve(root, '../game/КрасноЦарство.exe/game');
const atlasAssets = JSON.parse(await readFile(path.join(root, 'scripts/atlas-assets.json'), 'utf8'));
const portraits = {
  hero: 'hero/hero_normal.png', heroine: 'heroine/heroine_normal.png',
  hero2: 'hero2/hero2_normal.png', heroine2: 'heroine2/heroine2_normal.png',
  iskin: 'iskin/iskin_normal.png', apprentice: 'apprentice/apprentice_normal.png',
  'iskin-wry': 'iskin/iskin_wry.png', 'iskin-thinking': 'iskin/iskin_right.png',
  archmage: 'archmage/archmage_happy.png', merchant: 'nps/merchant_shop_normal.png',
  gorynych: 'chapter1/young_gorynych.png', cow: 'chapter1/wise_cow.png',
  rat: 'nps/big_rat_normal.png', bat: 'nps/bat_normal.png',
  pilot: 'station/pilot.png', mechanic: 'station/mechanic.png',
  fool: 'quarter/entuziastus.png', udarnikum: 'quarter/udarnikum.png',
  nastavniks: 'quarter/nastavniks.png', peredovichok: 'quarter/peredovichok.png',
  alchemist: 'nps/alchemist_normal.png', okhtenka: 'nps/ohctenka_normal.png',
};
const assets = [
  ...atlasAssets,
  { source: 'images/map/map_krascarsvo.jpg', target: 'public/atlas/map.webp', width: 1920 },
  { source: 'gui/library/reading_room.webp', target: 'src/assets/backgrounds/hero-bg.webp', width: 1920 },
  ...Object.entries(portraits).map(([name, source]) => ({ source: `images/${source}`, target: `public/characters/${name}.webp`, width: 640 })),
  ...['bg/library_parallel_2.jpg', 'chapter1/fortress_exterior.png', 'chapter1/river_firecups.png', 'quarter/hub.png', 'station/station_platform.png', 'bg/harbor.jpg', 'bg/artifact_store.jpg', 'bg/catacombs_entrance.jpg', 'bg/market.jpg', 'bg/rzhevka_lab.jpg', 'bg/magic_hall.jpg'].map((source, index) => ({ source: `images/${source}`, target: `src/assets/images/gallery-${index + 1}.webp`, width: 1440 })),
  ...['bg/hall_knowledge.jpg', 'bg/artifact_store.jpg', 'bg/harbor.jpg', 'chapter1/workshop_threshold.webp', 'chapter1/sleeping_gorynych.png'].map((source, index) => ({ source: `images/${source}`, target: `src/assets/backgrounds/bg${index + 1}.webp`, width: 1920 })),
  { source: 'gui/library/iskin_reading.webp', target: 'public/characters/iskin-reading.webp', width: 640 },
];
const scenesOnly = process.argv.includes('--site-scenes-only');
const selectedAssets = scenesOnly ? assets.filter(asset => /backgrounds\/bg[1-5]\.webp$|characters\/iskin-(wry|thinking)\.webp$/.test(asset.target)) : assets;
for (const asset of selectedAssets) {
  const dest = path.join(root, asset.target);
  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(path.join(game, asset.source)).resize({ width: asset.width, withoutEnlargement: true }).webp({ quality: 86 }).toFile(dest);
}
const poses = { idle: 'iskin_normal.png', thinking: 'iskin_right.png', 'adjust-monocle': 'iskin_left.png', resting: 'iskin-ar-resting.png' };
for (const [name, source] of scenesOnly ? [] : Object.entries(poses)) {
  await sharp(path.join(game, 'images/iskin', source))
    .resize(768, 1152, { fit: 'contain', background: '#00000000' })
    .png().toFile(path.join(root, `src/assets/images/iskin-ar-sequence/iskin-ar-${name}.png`));
}
console.log(`Prepared ${selectedAssets.length} website images${scenesOnly ? '' : ' and four AR poses'} from the main novel.`);
