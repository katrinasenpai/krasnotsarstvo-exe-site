// Import the author's current seer scene and the two requested art updates.
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const game = path.resolve(root, '../game/КрасноЦарство.exe/game');
const images = [
  ['images/apprentice/apprentice_normal.png', 'public/characters/apprentice.webp', 640],
  ['images/quarter/hub.png', 'src/assets/images/gallery-4.webp', 1440],
  ['images/quarter/hub.png', 'public/atlas/cards/quarter_fantasy.webp', 1440],
  ['images/chronicle/tent.webp', 'public/chronocards/tent.webp', 1920],
  ...['welcome', 'deal', 'read'].map(pose => [`images/chronicle/seer_${pose}.webp`, `public/chronocards/seer-${pose}.webp`, 640]),
];
for (const [source, target, width] of images) {
  const destination = path.join(root, target);
  await mkdir(path.dirname(destination), { recursive: true });
  await sharp(path.join(game, source)).resize({ width, withoutEnlargement: true }).webp({ quality: 88 }).toFile(destination);
}
await mkdir(path.join(root, 'public/chronocards/cards'), { recursive: true });
for (let number = 0; number <= 22; number++) {
  const filename = `${String(number).padStart(2, '0')}.webp`;
  await copyFile(path.join(game, 'images/chronicle/cards', filename), path.join(root, 'public/chronocards/cards', filename));
}
const cards = JSON.parse(await readFile(path.join(game, 'chronocards.json'), 'utf8'));
if (cards.length !== 22 || new Set(cards.map(card => card.id)).size !== 22) throw new Error('Expected 22 unique chronocards.');
await writeFile(path.join(root, 'src/data/chronocards.json'), JSON.stringify(cards, null, 2) + '\n');
console.log('Imported apprentice, quarter (gallery and atlas), seer scene and all 22 cards plus their back.');
