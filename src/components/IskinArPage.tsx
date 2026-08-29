import { ArrowLeft, Box, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import '@google/model-viewer';
import iskinProjection from '../assets/images/iskin-states/iskin-projection.webp';
import iskinArAdjustMonocle from '../assets/images/iskin-ar-sequence/iskin-ar-adjust-monocle.png';
import iskinArIdle from '../assets/images/iskin-ar-sequence/iskin-ar-idle.png';
import iskinArResting from '../assets/images/iskin-ar-sequence/iskin-ar-resting.png';
import iskinArThinking from '../assets/images/iskin-ar-sequence/iskin-ar-thinking.png';
import './IskinArPage.css';

const arModel = '/ar/iskin-projection-billboard.glb';
const quickLookModel = '/ar/iskin-projection-billboard.usdz';
const posePreview = [
  { id: 'idle', src: iskinArIdle },
  { id: 'thinking', src: iskinArThinking },
  { id: 'adjust-monocle', src: iskinArAdjustMonocle },
  { id: 'resting', src: iskinArResting },
] as const;

type NavigatorWithClientHints = Navigator & {
  userAgentData?: { platform?: string };
};

function isAndroidDevice() {
  const navigatorWithClientHints = navigator as NavigatorWithClientHints;
  return /android/i.test(navigator.userAgent) || navigatorWithClientHints.userAgentData?.platform === 'Android';
}

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
 * Голографическая 2D-проекция на прозрачной вертикальной плоскости.
 * В нативном AR доступен короткий loop спокойных 2D-поз; сложные сцены остаются на канале.
 * На Android кнопка явно вызывает Scene Viewer / ARCore; на iOS остаётся нативный Quick Look.
 */
export default function IskinArPage() {
  const isSecure = useMemo(() => window.isSecureContext, []);
  const isAndroid = useMemo(isAndroidDevice, []);
  const sceneViewerIntent = useMemo(() => {
    const modelUrl = new URL(arModel, window.location.origin).toString();
    const fallbackUrl = new URL('/iskin-ar?scene-viewer=unavailable', window.location.origin).toString();
    return createSceneViewerIntent(modelUrl, fallbackUrl);
  }, []);
  const isSceneViewerFallback = new URLSearchParams(window.location.search).get('scene-viewer') === 'unavailable';
  const [launchMessage, setLaunchMessage] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  const launchSceneViewer = () => {
    if (!isSecure) {
      setLaunchMessage('Откройте страницу по защищённому адресу сайта, чтобы разместить проекцию в комнате.');
      return;
    }

    setLaunchMessage('Открываем пространство Искина…');
    window.location.assign(sceneViewerIntent);
    window.setTimeout(() => {
      setLaunchMessage('Если камера не открылась, обновите Google Play Services for AR и Chrome, затем попробуйте снова.');
    }, 1600);
  };

  return (
    <main className="iskin-ar-page">
      <a className="iskin-ar-page__back" href="/iskin-projection" aria-label="Вернуться к голографическому каналу Искина">
        <ArrowLeft size={18} aria-hidden="true" />
        К голографическому каналу
      </a>

      <section className="iskin-ar-page__content" aria-labelledby="iskin-ar-title">
        <p className="iskin-ar-page__eyebrow">
          <Sparkles size={15} aria-hidden="true" />
          ПРОЕКЦИЯ В ПРОСТРАНСТВЕ
        </p>
        <h1 id="iskin-ar-title">Поместите Искина рядом</h1>
        <p className="iskin-ar-page__lead">
          Здесь используется 2D-голограмма Искина: она мягко парит и меняет спокойные позы, а сцены с книгой, шляпой и задачами остаются на голографическом канале.
        </p>

        <div className="iskin-ar-page__viewer-wrap">
          <div className={`iskin-ar-page__pose-preview ${modelLoaded ? 'is-hidden' : ''}`} aria-hidden="true">
            {posePreview.map((pose) => (
              <img key={pose.id} className={`iskin-ar-page__pose is-${pose.id}`} src={pose.src} alt="" />
            ))}
          </div>
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
            autoplay=""
            animation-name="Holographic pose sequence loop"
            onLoad={(event) => {
              // React также получает load от poster-изображения; скрываем резерв только после load самого model-viewer.
              if (event.target === event.currentTarget) setModelLoaded(true);
            }}
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

        {isAndroid && (
          <button
            className="iskin-ar-page__scene-viewer-button"
            type="button"
            onClick={launchSceneViewer}
            aria-describedby="iskin-ar-security-note"
          >
            <Camera size={18} aria-hidden="true" />
            Разместить проекцию
          </button>
        )}

        <p id="iskin-ar-security-note" className={`iskin-ar-page__security ${isSecure ? 'is-ready' : ''}`}>
          <ShieldCheck size={17} aria-hidden="true" />
          {isAndroid && isSecure
            ? 'Кнопка откроет камеру и позволит разместить мягко парящую голографическую проекцию Искина на полу.'
            : isSecure
            ? 'Защищённое соединение обнаружено: кнопка передаст модель в AR-режим, если он поддерживается устройством.'
            : 'Откройте страницу на сайте по защищённому адресу, чтобы разместить проекцию в комнате.'}
        </p>

        {launchMessage && !isSceneViewerFallback && (
          <p className="iskin-ar-page__scene-viewer-fallback" role="status">
            {launchMessage}
          </p>
        )}

        {isSceneViewerFallback && (
          <p className="iskin-ar-page__scene-viewer-fallback" role="status">
            Не удалось открыть режим размещения. Обновите Google Play Services for AR и Chrome, затем попробуйте снова.
          </p>
        )}

        <div className="iskin-ar-page__facts" aria-label="Возможности проекции в пространстве">
          <p><Box size={17} aria-hidden="true" /> Голографическая проекция Искина высотой 1,72 м закрепляется у пола, мягко парит и проходит короткий цикл поз.</p>
          <p><Camera size={17} aria-hidden="true" /> На Android откроется режим размещения, на iPhone/iPad — Quick Look.</p>
        </div>

        <details className="iskin-ar-page__fallback">
          <summary>Нужна помощь с размещением?</summary>
          <p>
            Откройте страницу в Chrome на Android или Safari на iPhone/iPad по HTTPS и разрешите доступ к камере.
            Если режим размещения не открылся, обновите Google Play Services for AR.
          </p>
        </details>
      </section>
    </main>
  );
}
