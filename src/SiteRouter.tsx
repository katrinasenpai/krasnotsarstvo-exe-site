import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { OracleFog, type FogPhase } from './components/OracleFog';
import { preloadOracle } from './utils/oracleRoute';
import { bookOraclePath, iskinArPath, iskinProjectionPath } from './utils/iskinProjectionUrl';

const App = lazy(() => import('./App'));
const IskinArPage = lazy(() => import('./components/IskinArPage'));
const BookOraclePage = lazy(preloadOracle);
const normalize = (pathname: string) => pathname.replace(/^\/+|\/+$/g, '');
const isOracle = (pathname: string) => normalize(pathname) === bookOraclePath;
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function RouteFailure() {
  return <div className="route-error" role="alert"><p>Страница пока не открылась. Попробуйте загрузить её ещё раз.</p><a href="/book-oracle">Повторить загрузку оракула</a></div>;
}

class RouteBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? <RouteFailure /> : this.props.children; }
}

// Reveal the scene once its initial portraits and cards have decoded, with a
// bounded wait so a failed image request cannot trap the visitor in the fog.
function OracleScene({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    let cancelled = false;
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('.book-oracle-page img'));
    void Promise.race([Promise.allSettled(images.map((image) => image.decode())), wait(4500)])
      .then(() => { if (!cancelled) onReady(); });
    return () => { cancelled = true; };
  }, [onReady]);
  return <BookOraclePage />;
}

export default function SiteRouter() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [fog, setFog] = useState<FogPhase | null>(isOracle(window.location.pathname) ? 'waiting' : null);
  const [failed, setFailed] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const sequence = useRef(0);
  const busy = useRef(!!fog);
  const revealTimer = useRef<number>();
  const coveringStarted = useRef(performance.now());

  const clearFog = useCallback(() => {
    window.clearTimeout(revealTimer.current);
    busy.current = false;
    setFog(null);
  }, []);

  const reveal = useCallback(() => {
    const current = sequence.current;
    const minimum = reducedMotion() ? 0 : Math.max(0, 700 - (performance.now() - coveringStarted.current));
    window.clearTimeout(revealTimer.current);
    revealTimer.current = window.setTimeout(() => {
      if (sequence.current !== current) return;
      setFog('revealing');
      revealTimer.current = window.setTimeout(() => {
        if (sequence.current !== current) return;
        clearFog();
        // Inert is removed before focus, independently of React's next paint.
        if (pageRef.current) pageRef.current.inert = false;
        const title = document.getElementById('book-oracle-title');
        title?.setAttribute('tabindex', '-1');
        title?.focus({ preventScroll: true });
      }, reducedMotion() ? 0 : 1100);
    }, minimum);
  }, [clearFog]);

  useEffect(() => {
    if (pageRef.current) pageRef.current.inert = !!fog;
  }, [fog]);

  const fogVisible = fog !== null;
  useEffect(() => {
    if (!fogVisible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [fogVisible]);

  useEffect(() => {
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin || !isOracle(url.pathname) || isOracle(window.location.pathname)) return;
      event.preventDefault();
      if (busy.current) return;
      busy.current = true;
      const current = ++sequence.current;
      coveringStarted.current = performance.now();
      setFailed(false);
      setFog('covering');
      void Promise.all([preloadOracle(), wait(reducedMotion() ? 0 : 700)]).then(() => {
        if (current !== sequence.current) return;
        window.history.pushState(null, '', url.pathname + url.search + url.hash);
        setFog('waiting');
        setPathname(url.pathname);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }).catch(() => {
        if (current !== sequence.current) return;
        clearFog();
        setFailed(true);
      });
    };
    const restore = () => {
      sequence.current += 1;
      window.clearTimeout(revealTimer.current);
      setFailed(false);
      const oracle = isOracle(window.location.pathname);
      busy.current = oracle;
      coveringStarted.current = performance.now();
      setFog(oracle ? 'waiting' : null);
      setPathname(window.location.pathname);
    };
    document.addEventListener('click', navigate);
    window.addEventListener('popstate', restore);
    return () => {
      sequence.current += 1;
      window.clearTimeout(revealTimer.current);
      document.removeEventListener('click', navigate);
      window.removeEventListener('popstate', restore);
    };
  }, [clearFog]);

  const normalized = normalize(pathname);
  const ar = normalized === iskinArPath || normalized === iskinProjectionPath;
  useEffect(() => {
    if (normalize(pathname) === iskinProjectionPath) {
      window.history.replaceState(null, '', '/iskin-ar' + window.location.search + window.location.hash);
    }
  }, [pathname]);

  return <>
    <div ref={pageRef} aria-hidden={fogVisible || undefined}>
      <RouteBoundary key={pathname} onError={clearFog}>
        <Suspense fallback={null}>
          {ar ? <IskinArPage /> : isOracle(pathname) ? <OracleScene onReady={reveal} /> : <App />}
        </Suspense>
      </RouteBoundary>
    </div>
    {fog && <OracleFog phase={fog} />}
    {failed && <RouteFailure />}
  </>;
}
