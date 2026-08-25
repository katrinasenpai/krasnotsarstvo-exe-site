import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  BookOpen,
  CircleOff,
  Eye,
  LayoutPanelTop,
  ScanLine,
  Sparkles,
} from 'lucide-react';
import iskinPortrait from '../assets/images/iskin.webp';
import iskinFocused from '../assets/images/iskin-states/iskin-focused.webp';
import iskinHat from '../assets/images/iskin-states/iskin-hat.webp';
import iskinIndignant from '../assets/images/iskin-states/iskin-indignant.webp';
import iskinNoMonocle from '../assets/images/iskin-states/iskin-no-monocle.webp';
import iskinProjection from '../assets/images/iskin-states/iskin-projection.webp';
import iskinReading from '../assets/images/iskin-states/iskin-reading.webp';
import iskinWarm from '../assets/images/iskin-states/iskin-warm.webp';
import { getIskinProjectionUrl } from '../utils/iskinProjectionUrl';
import './IskinWidget.css';

export type IskinEmotion = 'calm' | 'warm' | 'focused' | 'indignant';
export type IskinAction = 'monocle' | 'hat' | 'panel' | 'book' | 'projection';

export type IskinScene = {
  emotion: IskinEmotion;
  monocle: boolean;
  hat: boolean;
  panel: boolean;
  book: boolean;
  projection: boolean;
};

type IskinWidgetProps = {
  className?: string;
  onSceneChange?: (scene: IskinScene, source: IskinEmotion | IskinAction) => void;
};

const emotionLabels: Record<IskinEmotion, string> = {
  calm: 'Спокоен',
  warm: 'Доброжелателен',
  focused: 'Сосредоточен',
  indignant: 'Возмущён',
};

const emotionDescriptions: Record<IskinEmotion, string> = {
  calm: 'Искин готов сопровождать вас по КрасноЦарству.',
  warm: 'Искин одобрительно кивает: запрос принят.',
  focused: 'Искин просматривает магико-информационные потоки.',
  indignant: 'Искин явно не согласен с текущим ходом событий.',
};

const emotionOrder: IskinEmotion[] = ['calm', 'warm', 'focused', 'indignant'];

const emotionPortraits: Record<IskinEmotion, { src: string; alt: string }> = {
  calm: { src: iskinPortrait, alt: 'Искин в спокойном состоянии' },
  warm: { src: iskinWarm, alt: 'Искин с дружелюбной улыбкой' },
  focused: { src: iskinFocused, alt: 'Искин сосредоточенно изучает запрос' },
  indignant: { src: iskinIndignant, alt: 'Искин возмущённо возражает' },
};

const initialScene: IskinScene = {
  emotion: 'calm',
  monocle: true,
  hat: false,
  panel: false,
  book: false,
  projection: false,
};

/**
 * Интерактивная сцена без привязки к странице: позже её можно связать с AR/QR-событиями.
 * Каждый режим использует цельный 2D-кадр персонажа, поэтому QR/AR-адаптер сможет
 * переиспользовать те же состояния без накладывания декоративных заменителей.
 */
export function IskinWidget({ className = '', onSceneChange }: IskinWidgetProps) {
  const [scene, setScene] = useState<IskinScene>(initialScene);
  const projectionLink = getIskinProjectionUrl();

  const commitScene = (patch: Partial<IskinScene>, source: IskinEmotion | IskinAction) => {
    const nextScene = { ...scene, ...patch };
    setScene(nextScene);
    onSceneChange?.(nextScene, source);
  };

  const selectEmotion = (emotion: IskinEmotion) => {
    commitScene({ emotion, monocle: true, hat: false, book: false, projection: false }, emotion);
  };

  const toggleAction = (action: IskinAction) => {
    if (action === 'panel') {
      commitScene({ panel: !scene.panel }, action);
      return;
    }

    if (action === 'monocle') {
      commitScene(
        scene.monocle
          ? { monocle: false, hat: false, book: false, projection: false }
          : { monocle: true },
        action,
      );
      return;
    }

    const isEnabled = scene[action];
    commitScene(
      isEnabled
        ? { [action]: false }
        : { [action]: true, monocle: true, hat: action === 'hat', book: action === 'book', projection: action === 'projection' },
      action,
    );
  };

  const portrait = scene.projection
    ? {
        src: iskinProjection,
        alt: 'Искин в целостной голографической проекции, растворяющейся ниже пояса',
        state: 'projection',
        description: 'Искин активировал цельную голографическую проекцию.',
      }
    : scene.book
      ? {
          src: iskinReading,
          alt: 'Искин читает книгу, держа её обеими руками',
          state: 'reading',
          description: 'Искин читает и сверяет записи в архиве.',
        }
      : scene.hat
        ? {
            src: iskinHat,
            alt: 'Искин в чёрной остроконечной магической шляпе',
            state: 'hat',
            description: 'Искин надел магическую шляпу.',
          }
        : !scene.monocle
          ? {
              src: iskinNoMonocle,
              alt: 'Искин держит снятый монокль в руке',
              state: 'no-monocle',
              description: 'Искин снял монокль и держит его в руке.',
            }
          : {
              ...emotionPortraits[scene.emotion],
              state: scene.emotion,
              description: emotionDescriptions[scene.emotion],
            };

  return (
    <section
      className={`iskin-widget ${className}`}
      aria-labelledby="iskin-console-title"
    >
      <div className="iskin-widget__intro">
        <span className="iskin-widget__eyebrow">
          <Sparkles size={16} aria-hidden="true" /> ЦИФРОВОЙ ГИД
        </span>
        <h3 id="iskin-console-title">КОНСОЛЬ ИСКИНА</h3>
        <p>
          Выберите настроение или действие. Каждый режим меняет сам 2D-аватар Искина и
          остаётся готовым к будущим QR- и AR-сценариям.
        </p>

        <div className="iskin-widget__controls">
          <div className="iskin-widget__control-group" aria-label="Эмоция Искина">
            <span className="iskin-widget__group-label">Эмоция</span>
            <div className="iskin-widget__button-grid iskin-widget__button-grid--emotion">
              {emotionOrder.map((emotion) => (
                <button
                  className="iskin-widget__button"
                  type="button"
                  key={emotion}
                  aria-pressed={scene.emotion === emotion}
                  onClick={() => selectEmotion(emotion)}
                >
                  {emotionLabels[emotion]}
                </button>
              ))}
            </div>
          </div>

          <div className="iskin-widget__control-group" aria-label="Действия Искина">
            <span className="iskin-widget__group-label">Действия</span>
            <div className="iskin-widget__button-grid">
              <button
                className="iskin-widget__button"
                type="button"
                aria-pressed={!scene.monocle}
                onClick={() => toggleAction('monocle')}
              >
                {scene.monocle ? <CircleOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                {scene.monocle ? 'Снять монокль' : 'Надеть монокль'}
              </button>
              <button
                className="iskin-widget__button"
                type="button"
                aria-pressed={scene.hat}
                onClick={() => toggleAction('hat')}
              >
                <Sparkles size={16} aria-hidden="true" />
                {scene.hat ? 'Снять шляпу' : 'Надеть шляпу'}
              </button>
              <button
                className="iskin-widget__button"
                type="button"
                aria-pressed={scene.panel}
                onClick={() => toggleAction('panel')}
              >
                <LayoutPanelTop size={16} aria-hidden="true" />
                {scene.panel ? 'Скрыть задачи' : 'Открыть задачи'}
              </button>
              <button
                className="iskin-widget__button"
                type="button"
                aria-pressed={scene.book}
                onClick={() => toggleAction('book')}
              >
                <BookOpen size={16} aria-hidden="true" />
                {scene.book ? 'Закрыть книгу' : 'Читать книгу'}
              </button>
              <button
                className="iskin-widget__button"
                type="button"
                aria-pressed={scene.projection}
                onClick={() => toggleAction('projection')}
              >
                <ScanLine size={16} aria-hidden="true" />
                {scene.projection ? 'Завершить проекцию' : 'Режим проекции'}
              </button>
            </div>
          </div>
        </div>

        <output className="iskin-widget__status" aria-live="polite">
          {portrait.description}
        </output>

        <aside className="iskin-widget__qr" aria-labelledby="iskin-qr-title">
          <div>
            <span className="iskin-widget__group-label">QR-проверка</span>
            <h4 id="iskin-qr-title">Открыть проекцию на телефоне</h4>
            {projectionLink.isNetworkAddress ? (
              <p>Наведите камеру телефона на код: откроется лёгкая мобильная сцена Искина.</p>
            ) : (
              <p>
                Откройте сайт по LAN-адресу компьютера или задайте <code>VITE_ISKIN_QR_BASE_URL</code> —
                тогда QR станет доступен телефону.
              </p>
            )}
          </div>
          {projectionLink.isNetworkAddress && (
            <div className="iskin-widget__qr-code">
              <QRCodeSVG
                value={projectionLink.url}
                size={132}
                level="M"
                includeMargin
                bgColor="#eefeff"
                fgColor="#071226"
                title="QR-код для мобильной проекции Искина"
              />
              <span>{projectionLink.url}</span>
            </div>
          )}
        </aside>
      </div>

      <div className="iskin-stage" data-pose={portrait.state}>
        <div className="iskin-stage__glow" aria-hidden="true" />
        <img
          className={`iskin-stage__portrait iskin-stage__portrait--${portrait.state}`}
          src={portrait.src}
          alt={portrait.alt}
          decoding="async"
        />

        {scene.panel && (
          <div className="iskin-task-panel" aria-label="Голографическая панель задач Искина">
            <div className="iskin-task-panel__topline">
              <span>ЗАДАЧИ · СИНХРОНИЗАЦИЯ</span>
              <span>98%</span>
            </div>
            <ul>
              <li><i />Найти утраченную главу</li>
              <li><i />Стабилизировать портал</li>
              <li><i />Защитить архив памяти</li>
            </ul>
          </div>
        )}

        <output className="iskin-stage__caption" aria-live="polite">
          {portrait.description}
        </output>
      </div>
    </section>
  );
}
