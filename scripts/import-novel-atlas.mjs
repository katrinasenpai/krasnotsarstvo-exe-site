// Explicit, read-only snapshot of the approved game atlas. No game code is executed.
import { readFile, writeFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const game = path.resolve(root, '../game/КрасноЦарство.exe/game');
const places = JSON.parse(await readFile(path.join(game, 'world_atlas.json'), 'utf8'));
const cards = {};
for (const file of await readdir(path.join(game, 'cards'))) {
  if (!file.endsWith('.rpy')) continue;
  const text = await readFile(path.join(game, 'cards', file), 'utf8');
  const match = text.match(/location_cards\["([^"]+)"\]\s*=\s*(\{[\s\S]*?\n    \})/);
  if (!match) continue;
  const literal = match[2].trim().replace(/"""([\s\S]*?)"""/g, (_, value) => JSON.stringify(value)).replace(/,\s*([}\]])/g, '$1');
  cards[match[1]] = JSON.parse(literal);
}
const assets = [];
const snapshot = [];
for (const place of places) {
  const key = place.id;
  const card = place.tale ? {
    real_info: { title: place.real, description: place.real_text, image: `images/cards/${key}_real.jpg` },
    fantasy_info: { title: place.title, description: place.tale, image: place.fantasy_image || `images/cards/${key}_fantasy.jpg` },
  } : cards[key];
  if (!card) throw new Error(`Missing card: ${key}`);
  const item = Object.fromEntries(['id', 'library', 'alias', 'title', 'real', 'latitude', 'longitude', 'hint'].map(k => [k, place[k]]));
  item.offset = place.offset || [0, 0];
  item.detail_offset = place.detail_offset || [0, 0];
  item.encounter = place.encounter || null;
  item.landmark = `/atlas/landmarks/${key}.webp`;
  assets.push({source: `images/map/landmarks/${key}.png`, target: `public/atlas/landmarks/${key}.webp`, width: 168});
  for (const side of ['real', 'fantasy']) {
    const info = card[`${side}_info`];
    await access(path.join(game, info.image));
    item[`${side}_info`] = {
      title: side === 'real' ? place.real : info.title,
      description: side === 'real' ? place.real_text : info.description,
      image: `/atlas/cards/${key}_${side}.webp`,
      mobileImage: `/atlas/cards/${key}_${side}-small.webp`,
      links: side === 'real' ? (place.real_links || []).map(url => ({ label: /^https:\/\/vk\.(ru|com)\//.test(url) ? 'ВКонтакте' : 'Краснакарта', url })) : [],
    };
    assets.push({ source: info.image, target: `public/atlas/cards/${key}_${side}.webp`, width: 1280 });
    assets.push({ source: info.image, target: `public/atlas/cards/${key}_${side}-small.webp`, width: 640 });
  }
  snapshot.push(item);
}
await writeFile(path.join(root, 'src/data/atlas.json'), JSON.stringify(snapshot, null, 2) + '\n');
await writeFile(path.join(root, 'scripts/atlas-assets.json'), JSON.stringify(assets, null, 2) + '\n');
await writeFile(path.join(root, 'src/data/atlas-summary.json'), JSON.stringify({ places: snapshot.length, libraries: snapshot.filter(p => p.library).length }) + '\n');
console.log(`Exported ${snapshot.length} locations and ${assets.length} asset references.`);
