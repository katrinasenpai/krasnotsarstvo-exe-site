import { ArrowLeft, BookOpen, Briefcase, Crown, Glasses, ScanLine, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import iskinFocused from '../assets/images/iskin-states/iskin-focused.webp';
import iskinHat from '../assets/images/iskin-states/iskin-hat.webp';
import iskinNoMonocle from '../assets/images/iskin-states/iskin-no-monocle.webp';
import iskinProjection from '../assets/images/iskin-states/iskin-projection.webp';
import iskinReading from '../assets/images/iskin-states/iskin-reading.webp';
import { playIskinProjectionSignal } from '../utils/iskinProjectionSound';
import './IskinProjectionPage.css';

type ChannelAction = 'idle' | 'book' | 'tasks' | 'hat' | 'monocle';

const channelScenes: Record<ChannelAction, { src: string; alt: string; status: string; label: string }> = {
  idle: {
    src: iskinProjection,
    alt: 'Искин в цельной бирюзовой голографической проекции',
    status: 'Канал стабилен. Искин слушает и собирает свет вокруг себя.',
    label: 'Ожидание',
  },
  book: {
    src: iskinReading,
    alt: 'Искин читает раскрытую книгу, удерживая её обеими руками',
    status: 'Искин сверяется с книгой и ищет утерянную строку.',
    label: 'Книга',
  },
  tasks: {
    src: iskinFocused,
    alt: 'Искин сосредоточенно смотрит на голографическую панель задач',
    status: 'Искин выстраивает маршрут между архивами и порталами.',
    label: 'Задачи',
  },
  hat: {
    src: iskinHat,
    alt: 'Искин в чёрной остроконечной магической шляпе',
    status: 'Искин надел магическую шляпу и готов открыть редкую страницу.',
    label: 'Шляпа',
  },
  monocle: {
    src: iskinNoMonocle,
    alt: 'Искин снял монокль и держит его в руке',
    status: 'Искин снял монокль и рассматривает найденный след.',
    label: 'Монокль',
  },
};

const actionControls: Array<{ id: Exclude<ChannelAction, 'idle'>; icon: typeof BookOpen }> = [
  { id: 'book', icon: BookOpen },
  { id: 'tasks', icon: Briefcase },
  { id: 'hat', icon: Crown },
  { id: 'monocle', icon: Glasses },
];

/** Shared mobile destination for both the QR code and the website action. */
export default function IskinProjectionPage() {
  const [activated, setActivated] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [action, setAction] = useState<ChannelAction>('idle');
  const [sceneVersion, setSceneVersion] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const scene = channelScenes[action];

  const clearReturnTimer = () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  const selectAction = (nextAction: ChannelAction) => {
    clearReturnTimer();
    setAction(nextAction);
    setSceneVersion((version) => version + 1);

    if (nextAction !== 'idle') {
      timeoutRef.current = window.setTimeout(() => {
        setAction('idle');
        setSceneVersion((version) => version + 1);
      }, 6200);
    }
  };

  const activateProjection = () => {
    setActivated(true);
    selectAction('idle');
    if (soundEnabled) playIskinProjectionSignal();
  };

  return (
    <main className="iskin-channel-page">
      <a className="iskin-channel-page__back" href="/" aria-label="Перейти на сайт КрасноЦарства">
        <ArrowLeft size={18} aria-hidden="true" />
        Перейти на сайт КрасноЦарства
      </a>

      <section className="iskin-channel-page__content" aria-labelledby="iskin-channel-title">
        <p className="iskin-channel-page__signal"><Sparkles size={15} aria-hidden="true" /> ГОЛОГРАФИЧЕСКИЙ КАНАЛ ИСКИНА</p>
        <h1 id="iskin-channel-title">Искин на связи</h1>
        <p className="iskin-channel-page__lead">Проекция синхронизирована. Выберите действие, а Искин ответит цельной сценой.</p>

        <div className={`iskin-channel-page__stage ${activated ? 'is-active' : ''}`} data-action={action}>
          <div className="iskin-channel-page__beam" aria-hidden="true" />
          <div className="iskin-channel-page__noise" aria-hidden="true" />
          <div className="iskin-channel-page__halo" aria-hidden="true" />
          {activated ? (
            <>
              <img
                key={`${action}-${sceneVersion}`}
                className="iskin-channel-page__portrait"
                src={scene.src}
                alt={scene.alt}
                decoding="async"
              />
              {action === 'tasks' && (
                <div className="iskin-channel-page__task-panel" aria-label="Голографическая панель задач Искина">
                  <span>АРХИВНЫЕ ЗАДАЧИ</span>
                  <p>Собрать фрагменты</p>
                  <p>Настроить проход</p>
                  <p>Вернуть строку</p>
                </div>
              )}
            </>
          ) : (
            <div className="iskin-channel-page__dormant" aria-hidden="true"><ScanLine size={42} /></div>
          )}
        </div>

        {!activated ? (
          <button className="iskin-channel-page__activate" type="button" onClick={activateProjection}>
            <Sparkles size={18} aria-hidden="true" />
            Активировать проекцию
          </button>
        ) : (
          <>
            <p className="iskin-channel-page__status" aria-live="polite">{scene.status}</p>
            <div className="iskin-channel-page__actions" aria-label="Действия Искина">
              {actionControls.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={action === id ? 'is-selected' : ''}
                  onClick={() => selectAction(id)}
                  aria-pressed={action === id}
                >
                  <Icon size={17} aria-hidden="true" />
                  {channelScenes[id].label}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="iskin-channel-page__links">
          <a href="/#quiz"><Sparkles size={16} aria-hidden="true" /> Узнать, кто ты из КрасноЦарства</a>
          <a href="/book-oracle"><BookOpen size={16} aria-hidden="true" /> Книжный оракул</a>
          <a href="/iskin-ar"><ScanLine size={16} aria-hidden="true" /> Разместить проекцию в пространстве</a>
        </div>

        <button
          className="iskin-channel-page__sound"
          type="button"
          onClick={() => setSoundEnabled((enabled) => !enabled)}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
          {soundEnabled ? 'Звук включён' : 'Без звука'}
        </button>
        <p className="iskin-channel-page__note">Анимированный свет остаётся здесь, на канале. В режиме размещения в пространстве проекция статична.</p>
      </section>
    </main>
  );
}
