import { copyFile, mkdir } from 'node:fs/promises';
// Direct links and printed QR codes also work on static hosting without SPA rewrites.
for (const route of ['iskin-ar', 'iskin-projection', 'book-oracle']) {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile('dist/index.html', `dist/${route}/index.html`);
}
console.log('Prepared direct entry points for AR, legacy QR links and the Book Oracle.');
