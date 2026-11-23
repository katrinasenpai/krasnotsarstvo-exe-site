import { renderToStaticMarkup } from 'react-dom/server';
import App from './App';
import IskinArPage from './components/IskinArPage';
import BookOraclePage from './components/BookOraclePage';
import { pages } from './data/sitePages';
export { pages, siteOrigin, pageTags } from './data/sitePages';
export { renderPageHead } from './data/renderPageHead';

export function renderPage(path: string) {
  if (path === pages[1].path) return renderToStaticMarkup(<IskinArPage />);
  if (path === pages[2].path) return renderToStaticMarkup(<BookOraclePage />);
  return renderToStaticMarkup(<App />);
}
