import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { bookOraclePath, iskinArPath, iskinProjectionPath } from './utils/iskinProjectionUrl.ts';

// Route-level chunks keep the QR-сцена лёгкой: на телефоне не загружается главная страница.
// eslint-disable-next-line react-refresh/only-export-components
const App = lazy(() => import('./App.tsx'));
// eslint-disable-next-line react-refresh/only-export-components
const IskinArPage = lazy(() => import('./components/IskinArPage.tsx'));
// eslint-disable-next-line react-refresh/only-export-components
const BookOraclePage = lazy(() => import('./components/BookOraclePage.tsx'));

const normalizedPathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
const isProjectionRoute = normalizedPathname === iskinProjectionPath;
const isArRoute = normalizedPathname === iskinArPath || isProjectionRoute;
if (isProjectionRoute) window.history.replaceState(null, '', '/iskin-ar' + window.location.search + window.location.hash);
const isBookOracleRoute = normalizedPathname === bookOraclePath;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      {isArRoute ? <IskinArPage /> : isBookOracleRoute ? <BookOraclePage /> : <App />}
    </Suspense>
  </StrictMode>
);
