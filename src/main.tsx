import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { iskinArPath, iskinProjectionPath } from './utils/iskinProjectionUrl.ts';

// Route-level chunks keep the QR-сцена лёгкой: на телефоне не загружается главная страница.
// eslint-disable-next-line react-refresh/only-export-components
const App = lazy(() => import('./App.tsx'));
// eslint-disable-next-line react-refresh/only-export-components
const IskinProjectionPage = lazy(() => import('./components/IskinProjectionPage.tsx'));
// eslint-disable-next-line react-refresh/only-export-components
const IskinArPage = lazy(() => import('./components/IskinArPage.tsx'));

const normalizedPathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
const isProjectionRoute = normalizedPathname === iskinProjectionPath;
const isArRoute = normalizedPathname === iskinArPath;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      {isArRoute ? <IskinArPage /> : isProjectionRoute ? <IskinProjectionPage /> : <App />}
    </Suspense>
  </StrictMode>
);
