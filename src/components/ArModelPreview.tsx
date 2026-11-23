import '@google/model-viewer';
import { useEffect, useRef, useState } from 'react';
import type { ModelViewerElement } from '@google/model-viewer';
import { arModel, quickLookModel } from '../utils/arAssets';
export default function ArModelPreview() {
  const ref=useRef<ModelViewerElement>(null);
  const [error,setError]=useState(false);
  useEffect(()=>{
    const viewer=ref.current;
    const fail=()=>setError(true);
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible=true;
    const sync=()=>{if(document.hidden||!visible||motion.matches)viewer?.pause();else viewer?.play();};
    const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);sync();});
    if(viewer)observer.observe(viewer);
    viewer?.addEventListener('error',fail);viewer?.addEventListener('load',sync);
    document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
    return()=>{observer.disconnect();viewer?.removeEventListener('error',fail);viewer?.removeEventListener('load',sync);document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);};
  },[]);
  if(error)return <p className="iskin-ar-page__loading" role="alert">Не удалось загрузить проекцию. Обновите страницу или попробуйте открыть её на телефоне.</p>;
  return <model-viewer ref={ref} class="iskin-ar-page__viewer" src={arModel} ios-src={quickLookModel}
    alt="Искин в потоке голубого света перелистывает виртуальную книгу"
    ar="" ar-modes="scene-viewer webxr quick-look" ar-placement="floor" ar-scale="fixed" quick-look-browsers="safari chrome"
    camera-controls="" camera-orbit="0deg 90deg 2.6m" camera-target="0m 0.58m 0m" field-of-view="32deg"
    shadow-intensity="0" exposure="1" touch-action="pan-y" loading="eager" animation-name="Reading the virtual book">
    <img slot="poster" src="/characters/iskin-projection-reading.webp" alt="" />
    <button type="button" slot="ar-button" className="iskin-ar-page__ar-button">Вызвать Искина в камере</button>
  </model-viewer>;
}
