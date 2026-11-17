import snapshot from './atlas.json';
export const atlasPlaces = snapshot;
export type Location = typeof snapshot[number];
export type LocationId = string;
export const locationsData = Object.fromEntries(snapshot.map(place => [place.id, place]));
// Same projection and hand-tuned offsets as the approved Ren'Py atlas.
export function atlasPoint(place: Location, detail = false) {
  let x = Math.round(645 + (place.longitude - 30.3942814) * 6130);
  let y = Math.round(51 + (60.0409456 - place.latitude) * 7700);
  if (detail) { x = Math.round((x - 560) * 1.75 + 497); y = Math.round((y - 545) * 1.75 + 144); }
  const [dx, dy] = detail ? place.detail_offset : place.offset;
  return { x, y, px: x + dx, py: y + dy, visible: x >= 500 && x <= 1885 && y >= 80 && y <= 1040 };
}
