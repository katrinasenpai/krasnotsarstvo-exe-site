import { pageTags, pages, siteOrigin } from './sitePages';

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
export function renderPageHead(page: typeof pages[number]) {
  const tags = Object.entries(pageTags(page)).map(([key, value]) =>
    `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escape(value)}">`);
  return [`<title>${escape(page.title)}</title>`, `<link rel="canonical" href="${siteOrigin}${page.path}">`, ...tags].join('\n    ');
}
