import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import sharp from 'sharp';

const template = (await readFile('dist/index.html', 'utf8'))
  .replace(/<!--page-head-->[\s\S]*?<!--\/page-head-->/, '<!--page-head--><!--/page-head-->')
  .replace(/<!--static-content-->[\s\S]*?<!--\/static-content-->/, '<!--static-content--><!--/static-content-->');
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const ssr = await mkdtemp(resolve('node_modules', '.static-pages-'));
try {
  await build({ logLevel: 'warn', publicDir: false, build: {
    ssr: 'src/prerender.tsx', outDir: ssr, manifest: false, emptyOutDir: false,
    rollupOptions: { output: { entryFileNames: 'render.mjs', chunkFileNames: '[name]-[hash].mjs' } },
  } });
  const { pages, siteOrigin, renderPage, renderPageHead } = await import(pathToFileURL(join(ssr, 'render.mjs')));
  const entries = ['App', 'IskinArPage', 'BookOraclePage'];
  for (const [index, page] of pages.entries()) {
    const styles = new Set();
    const visit = key => {
      const entry = manifest[key];
      for (const dep of entry.imports ?? []) visit(dep);
      for (const css of entry.css ?? []) styles.add(css);
    };
    const routeEntry = Object.keys(manifest).find(key => manifest[key].name === entries[index] && manifest[key].isDynamicEntry);
    if (!routeEntry) throw new Error('Missing client route ' + entries[index]);
    visit(routeEntry);
    const links = [...styles].filter(css => !template.includes(css)).map(css => '<link rel="stylesheet" href="/' + css + '">');
    const html = template.replace(/<!--page-head-->[\s\S]*?<!--\/page-head-->/,
      () => '<!--page-head-->' + renderPageHead(page) + '\n' + links.join('\n') + '<!--/page-head-->')
      .replace(/<!--static-content-->[\s\S]*?<!--\/static-content-->/,
        () => '<!--static-content--><div id="static-page">' + renderPage(page.path) + '</div><!--/static-content-->');
    const directory = 'dist' + page.path;
    await mkdir(directory, {recursive:true});
    await writeFile(directory + 'index.html', html);
    if (page.path === '/iskin-ar/') {
      await mkdir('dist/iskin-projection', {recursive:true});
      await writeFile('dist/iskin-projection/index.html', html);
    }
  }
  await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: ' + siteOrigin + '/sitemap.xml\n');
  const urls = pages.map(page => '  <url><loc>' + siteOrigin + page.path + '</loc></url>');
  await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>\n');
  await mkdir('dist/social', {recursive:true});
  for (const [src, filename, fit] of [
    ['src/assets/backgrounds/hero-bg.webp','library','cover'],
    ['public/characters/iskin-projection-reading.webp','iskin','contain'],
    ['public/chronocards/tent.webp','tent','cover'],
  ]) {
    await sharp(src).resize(1200,630,{fit,background:'#102534'}).flatten({background:'#102534'}).jpeg({quality:84}).toFile('dist/social/' + filename + '.jpg');
  }
  console.log('Prepared three indexable pages, legacy QR links, social previews and sitemap.');
} finally {
  await rm(ssr, {recursive:true, force:true});
}
