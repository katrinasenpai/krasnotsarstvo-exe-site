import { ArrowLeft, Box, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import '@google/model-viewer';
import iskinProjection from '../assets/images/iskin-states/iskin-projection.webp';
import './IskinArPage.css';

const arModel = '/ar/iskin-projection-billboard.glb';
const quickLookModel = '/ar/iskin-projection-billboard.usdz';

function createSceneViewerIntent(modelUrl: string, fallbackUrl: string) {
  const query = [
    `file=${encodeURIComponent(modelUrl)}`,
    'mode=ar_only',
    `title=${encodeURIComponent('Искин — голографическая проекция')}`,
    'resizable=false',
  ].join('&');

  return `intent://arvr.google.com/scene-viewer/1.0?${query}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end;`;
}

/**
 * Первый AR-пилот: не 3D-аватар, а 2D-проекция на прозрачной вертикальной плоскости.
 * На Android кнопка явно вызывает Scene Viewer / ARCore; на iOS остаётся нативный Quick Look.
 */
export default function IskinArPage() {
  const isSecure = useMemo(() => window.isSecureContext, []);
  const isAndroid = useMemo(() => /android/i.test(window.navigator.userAgent), []);
  const sceneViewerIntent = useMemo(() => {
    const modelUrl = new URL(arModel, window.location.origin).toString();
    const fallbackUrl = new URL('/iskin-ar?scene-viewer=unavailable', window.location.origin).toString();
    return createSceneViewerIntent(modelUrl, fallbackUrl);
  }, []);
  const isSceneViewerFallback = new URLSearchParams(window.location.search).get('scene-viewer') === 'unavailable';

  return (
    <main className="iskin-ar-page">
      <a className="iskin-ar-page__back" href="/iskin-projection" aria-label="Вернуться к проекции Искина">
        <ArrowLeft size={18} aria-hidden="true" />
        К проекции Искина
      </a>

      <section className="iskin-ar-page__content" aria-labelledby="iskin-ar-title">
        <p className="iskin-ar-page__eyebrow">
          <Sparkles size={15} aria-hidden="true" />
          AR-ПИЛОТ · 2D ПРОЕКЦИЯ
        </p>
        <h1 id="iskin-ar-title">Поставьте Искина в пространство</h1>
        <p className="iskin-ar-page__lead">
          Перед вами вертикальная прозрачная плоскость с голографическим 2D-образом Искина,
          а не полноценная 3D-модель персонажа.
        </p>

        <div className="iskin-ar-page__viewer-wrap">
          <model-viewer
            className="iskin-ar-page__viewer"
            src={arModel}
            ios-src={quickLookModel}
            alt="Вертикальная голографическая 2D-проекция Искина для размещения в помещении"
            ar=""
            ar-modes="scene-viewer webxr quick-look"
            ar-placement="floor"
            ar-scale="fixed"
            quick-look-browsers="safari chrome"
            camera-controls=""
            camera-orbit="0deg 75deg 2.8m"
            camera-target="0m 0.86m 0m"
            field-of-view="32deg"
            shadow-intensity="0"
            environment-image="neutral"
            exposure="1.15"
            interaction-prompt="auto"
            touch-action="pan-y"
            loading="eager"
          >
            <img slot="poster" src={iskinProjection} alt="" aria-hidden="true" />
            {isAndroid ? (
              <span slot="ar-button" className="iskin-ar-page__hidden-ar-button" aria-hidden="true" />
            ) : (
              <button
                className="iskin-ar-page__ar-button"
                slot="ar-button"
                type="button"
                disabled={!isSecure}
                aria-describedby="iskin-ar-security-note"
              >
                <Camera size={18} aria-hidden="true" />
                Посмотреть в пространстве
              </button>
            )}
          </model-viewer>
        </div>

        {isAndroid && isSecure && (
          <a className="iskin-ar-page__scene-viewer-link" href={sceneViewerIntent}>
            <Camera size={18} aria-hidden="true" />
            Посмотреть в пространстве
          </a>
        )}

        <p id="iskin-ar-security-note" className={`iskin-ar-page__security ${isSecure ? 'is-ready' : ''}`}>
          <ShieldCheck size={17} aria-hidden="true" />
          {isAndroid && isSecure
            ? 'Android обнаружен: кнопка запускает нативный Scene Viewer через ARCore. Если ARCore недоступен, откроется этот веб-предпросмотр.'
            : isSecure
            ? 'Защищённое соединение обнаружено: кнопка передаст модель в AR-режим, если он поддерживается устройством.'
            : 'Это локальный предпросмотр модели. Запуск камеры и AR доступен только по опубликованному HTTPS-адресу.'}
        </p>

        {isSceneViewerFallback && (
          <p className="iskin-ar-page__scene-viewer-fallback" role="status">
            Scene Viewer не запущен. Обновите Google Play Services for AR и повторите попытку в Chrome.
          </p>
        )}

        <div className="iskin-ar-page__facts" aria-label="Возможности AR-пилота">
          <p><Box size={17} aria-hidden="true" /> Прозрачный 2D-билборд высотой 1,72 м, закреплённый у пола.</p>
          <p><Camera size={17} aria-hidden="true" /> Android: Scene Viewer / ARCore; iPhone/iPad: Quick Look.</p>
        </div>

        <details className="iskin-ar-page__fallback">
          <summary>Если AR не запускается</summary>
          <p>
            Остаётся интерактивный предпросмотр модели на этой странице. Для AR откройте её в
            Chrome на Android или Safari на iPhone/iPad по HTTPS и разрешите доступ к камере.
          </p>
        </details>
      </section>
    </main>
  );
}
