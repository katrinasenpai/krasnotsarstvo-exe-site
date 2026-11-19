import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const records = JSON.parse(await readFile('src/data/chronocards.json', 'utf8'));
const require = createRequire(import.meta.url);
const loadModule = async (file, dependencies = {}) => {
  const code = ts.transpileModule(await readFile(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const context = { exports: {}, require: id => id.endsWith('.css') ? {} : dependencies[id] ?? require(id) };
  vm.runInNewContext(code, context);
  return context.exports;
};
const model = await loadModule('src/data/chronocards.ts', { './chronocards.json': records });
const { chronocards, chronicleReducer: reduce, createChronicleState: start, shuffleRemaining } = model;
assert.equal(chronocards.length, 22);
assert.equal(new Set(chronocards.map(card => card.id)).size, 22);
for (const card of chronocards) {
  assert(card.title && card.symbol);
  assert.equal(card.reading.length, 3);
  assert.equal(card.book.length, 3);
  assert(card.reading.every(Boolean) && card.book.every(Boolean));
}
for (const ref of [...chronocards.map(card => card.image), model.cardBack, '/chronocards/tent.webp', ...['welcome', 'deal', 'read'].map(pose => `/chronocards/seer-${pose}.webp`)]) assert((await stat(`public${ref}`)).size > 0, ref);

let paths = 0;
for (let a = 0; a < 22; a++) for (let b = 0; b < 22; b++) for (let c = 0; c < 22; c++) {
  if (new Set([a, b, c]).size !== 3) continue;
  let state = start();
  for (const card of [a, b, c]) {
    state = reduce(state, { type: 'draw', card });
    assert.equal(state.phase, 'read');
    assert.equal(reduce(state, { type: 'draw', card }), state, 'Cannot draw during interpretation');
    state = reduce(state, { type: 'next' });
    assert.equal(reduce(state, { type: 'draw', card }), state, 'Cannot draw the same card twice');
  }
  assert.equal(state.phase, 'select');
  assert.deepEqual([...state.spread], [a, b, c]);
  for (let position = 0; position < 3; position++) {
    const bookState = reduce(state, { type: 'book', position });
    assert.equal(bookState.phase, 'book');
    assert.equal(chronocards[bookState.spread[bookState.position]].book[0], records[[a, b, c][position]].book[0], 'Book follows visitor-selected card');
    assert.equal(reduce(bookState, { type: 'select' }).phase, 'select');
  }
  const reset = reduce(state, { type: 'reset', hand: start().hand });
  assert.equal(reset.phase, 'choose'); assert.equal(reset.spread.length, 0);
  paths++;
}
let state = start();
state = reduce(reduce(state, { type: 'draw', card: 7 }), { type: 'next' });
for (let i = 0; i < 100; i++) {
  const previous = JSON.stringify(state);
  const shuffled = shuffleRemaining(state.hand, state.spread);
  assert.equal(JSON.stringify(state), previous, 'Shuffling must not mutate state');
  assert.equal(shuffled.indexOf(7), state.hand.indexOf(7), 'Revealed card keeps its slot');
  assert.equal(new Set(shuffled).size, 22);
  assert.notEqual(shuffled.join(), state.hand.join());
  state = reduce(state, { type: 'shuffle', hand: shuffled });
  assert.deepEqual([...state.spread], [7]);
}
assert.equal(reduce(state, { type: 'draw', card: 99 }), state);
assert.equal(reduce(state, { type: 'shuffle', hand: Array(22).fill(0) }), state);
assert.equal(reduce(state, { type: 'book', position: 0 }), state);
const unchangedRandom = shuffleRemaining([0, 1, 2, 3], [0], () => .999);
assert.equal(unchangedRandom[0], 0);
assert.notEqual(unchangedRandom.join(), '0,1,2,3');
const page = await loadModule('src/components/BookOraclePage.tsx', { '../data/chronocards': model });
const html = renderToStaticMarkup(React.createElement(page.default));
assert.equal((html.match(/aria-label="Выбрать закрытую карту /g) || []).length, 22);
assert(html.includes('Шатёр гадалки') && html.includes('seer-welcome.webp'));
console.log(JSON.stringify({ cards: 22, orderedDraws: paths, bookChoicesChecked: paths * 3, preservedDrawsAfterShuffle: 100, initialPageRenders: true }, null, 2));
