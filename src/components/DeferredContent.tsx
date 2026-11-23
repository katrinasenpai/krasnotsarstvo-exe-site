import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

function useNearViewport() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) { setReady(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, {rootMargin:'500px'});
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return {ref, ready};
}

export function DeferredContent({children, height=600}: {children:ReactNode; height?:number}) {
  const {ref, ready} = useNearViewport();
  const fallback = <div style={{minHeight:height}} className="section-loading" role="status">Открываем следующую страницу…</div>;
  return <div ref={ref}>{ready ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}</div>;
}

export function SceneArtwork({src, mobile}: {src:string; mobile:string}) {
  const {ref, ready} = useNearViewport();
  return <div ref={ref} className="scene-artwork" aria-hidden="true">{ready && <picture><source media="(max-width: 700px)" srcSet={mobile} /><img src={src} alt="" decoding="async" /></picture>}</div>;
}
