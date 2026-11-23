import { Camera, Smartphone } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { IskinProjection } from './IskinProjection';
import { getIskinArUrl } from '../utils/iskinProjectionUrl';
import { arModel, quickLookModel } from '../utils/arAssets';
import './IskinArPage.css';

const ArModelPreview=lazy(()=>import('./ArModelPreview'));
function sceneViewerIntent() {
  const file=new URL(arModel,window.location.origin).toString();
  const fallback=new URL('/iskin-ar?scene-viewer=unavailable',window.location.origin).toString();
  return `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(file)}&mode=ar_only&title=${encodeURIComponent('Искин читает виртуальную книгу')}&resizable=false#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(fallback)};end;`;
}
export default function IskinArPage() {
  const device = typeof window === 'undefined' ? undefined : window.navigator;
  const agent = device?.userAgent ?? '';
  const android=/android/i.test(agent);
  const apple=/iPad|iPhone|iPod/.test(agent)||(/Macintosh/.test(agent)&&(device?.maxTouchPoints ?? 0)>1);
  const secure=typeof window !== 'undefined' && window.isSecureContext;
  const [preview,setPreview]=useState(false);
  const fallback=new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search).get('scene-viewer')==='unavailable';
  return <main className="iskin-ar-page">
    <a className="iskin-ar-page__back" href="/#iskin">На сайт КрасноЦарства</a>
    <section className="iskin-ar-page__content" aria-labelledby="iskin-ar-title">
      <p className="iskin-ar-page__eyebrow">ДОПОЛНЕННАЯ РЕАЛЬНОСТЬ</p>
      <h1 id="iskin-ar-title">Искин рядом с вами</h1>
      <p className="iskin-ar-page__lead">Пока Искин сверяется с виртуальной книгой, его проекция может появиться рядом с вами. Найдите свободное место и пригласите проводника в свой мир.</p>
      <div className="iskin-ar-page__viewer-wrap">
        {preview ? <Suspense fallback={<p className="iskin-ar-page__loading" role="status">Собираем проекцию из света…</p>}><ArModelPreview /></Suspense> : <IskinProjection eager />}
      </div>
      {android&&<a className="iskin-ar-page__scene-viewer-button" href={secure?sceneViewerIntent():undefined} aria-disabled={!secure}><Camera size={22} aria-hidden="true" /> Вызвать Искина в камере</a>}
      {apple&&<a className="iskin-ar-page__scene-viewer-button" rel="ar" href={secure?quickLookModel:undefined} aria-disabled={!secure}><img src="/characters/iskin-projection-reading.webp" width="30" height="42" alt="" /> Вызвать Искина в камере</a>}
      {(android||apple)&&<p className="iskin-ar-page__security">{secure?'Наведите камеру на пол или стол, дождитесь появления поверхности и разместите проекцию.':'Для размещения откройте эту страницу на сайте по HTTPS.'}</p>}
      {!android&&!apple&&<div className="iskin-ar-page__desktop-invite"><QRCodeSVG value={getIskinArUrl().url} size={120} bgColor="#f4e7cc" fgColor="#142632" marginSize={2} /><div><h2><Smartphone size={20} aria-hidden="true" /> Откройте на телефоне</h2><p>Отсканируйте QR-код камерой смартфона. На компьютере можно рассмотреть проекцию ниже.</p></div></div>}
      {!preview&&<button type="button" className="iskin-ar-page__preview-button" onClick={()=>setPreview(true)}>Рассмотреть проекцию здесь</button>}
      {fallback&&<p className="iskin-ar-page__scene-viewer-fallback" role="status">Режим дополненной реальности не открылся. Проверьте поддержку AR устройством, откройте страницу в Chrome и обновите Google Play Services for AR.</p>}
      <details className="iskin-ar-page__fallback"><summary>Как вызвать Искина?</summary><p>На Android откройте страницу в Chrome, на iPhone или iPad в Safari. Нажмите «Вызвать Искина в камере» и разрешите доступ к камере. Устройство должно поддерживать дополненную реальность. Проекцию удобнее рассматривать спереди. Если AR недоступна, останется просмотр на этой странице.</p></details>
    </section>
  </main>;
}
