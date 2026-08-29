import { ArrowLeft, BookOpen, Copy, Share2, Sparkles } from 'lucide-react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import iskinHat from '../assets/images/iskin-states/iskin-hat.webp';
import oracleCardBack from '../assets/images/oracle-deck/oracle-card-back.webp';
import {
  createOracleReading,
  drawOracleCards,
  oracleCards,
  oraclePositionLabels,
  type OracleCard,
  type OraclePosition,
  type OracleReading,
} from '../data/bookOracle';
import './BookOraclePage.css';

type OraclePhase = 'ready' | 'drawing' | 'reading';

const positions: OraclePosition[] = ['past', 'present', 'future'];

export default function BookOraclePage() {
  const [phase, setPhase] = useState<OraclePhase>('ready');
  const [cards, setCards] = useState<OracleCard[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [reading, setReading] = useState<OracleReading | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [ritualStatus, setRitualStatus] = useState('Магико-информационный поток ждёт вопроса.');
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const resetReading = () => {
    clearTimers();
    setPhase('ready');
    setCards([]);
    setRevealedCount(0);
    setReading(null);
    setNotice(null);
    setRitualStatus('Магико-информационный поток ждёт вопроса.');
  };

  const startReading = () => {
    if (phase === 'drawing') return;

    clearTimers();
    const nextCards = drawOracleCards();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timings = reducedMotion ? [260, 620, 980, 1450] : [700, 1600, 2550, 3650];

    setCards(nextCards);
    setReading(null);
    setNotice(null);
    setRevealedCount(0);
    setPhase('drawing');
    setRitualStatus('Искин переворачивает первую карту…');

    timersRef.current = [
      window.setTimeout(() => {
        setRevealedCount(1);
        setRitualStatus('След прошлого проявился. Искин читает вторую карту…');
      }, timings[0]),
      window.setTimeout(() => {
        setRevealedCount(2);
        setRitualStatus('Ключ настоящего найден. Осталась дорога впереди…');
      }, timings[1]),
      window.setTimeout(() => {
        setRevealedCount(3);
        setRitualStatus('Три карты легли рядом. Книга собирает их общий мотив…');
      }, timings[2]),
      window.setTimeout(() => {
        setReading(createOracleReading(nextCards));
        setPhase('reading');
        setRitualStatus('Расклад готов.');
        timersRef.current = [];
      }, timings[3]),
    ];
  };

  const shareText = reading
    ? [
      'Книжный оракул КрасноЦарства',
      ...reading.entries.map(({ card, interpretation, position }) => `${oraclePositionLabels[position]}: ${card.number} «${card.title}» — ${interpretation}`),
      `Общий мотив: ${reading.summary}`,
      `Книга к раскладу: «${reading.book.title}», ${reading.book.author}. ${reading.book.why} Рекомендация выбрана картой «${reading.book.sourceCard}».`,
      'Это игровой ритуал, а не предсказание реальности.',
    ].join('\n\n')
    : '';

  const copyReading = async () => {
    if (!reading) return;
    try {
      await navigator.clipboard.writeText(shareText);
      setNotice('Расклад скопирован.');
    } catch {
      setNotice('Не удалось скопировать текст — его можно выделить вручную.');
    }
  };

  const shareReading = async () => {
    if (!reading) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Книжный оракул КрасноЦарства', text: shareText });
        setNotice('Расклад отправлен.');
      } catch {
        // Closing the native sharing panel is an expected cancellation.
      }
      return;
    }
    await copyReading();
  };

  const displayedCards = cards.length === 3 ? cards : oracleCards.slice(0, 3);

  return (
    <main className={`book-oracle-page is-${phase}`}>
      <a className="book-oracle-page__back" href="/iskin-projection">
        <ArrowLeft size={18} aria-hidden="true" />
        К голографическому каналу
      </a>

      <section className="book-oracle-page__content" aria-labelledby="book-oracle-title">
        <header className="book-oracle-page__heading">
          <p className="book-oracle-page__eyebrow"><Sparkles size={15} aria-hidden="true" /> КНИЖНЫЙ ОРАКУЛ</p>
          <h1 id="book-oracle-title">Синхронизация с магико-информационным потоком</h1>
          <p>Перед вами уникальная колода из 22 карт, разработанная Архимагом и его Подмастерьем. Архимаг отвечал за смыслы, Подмастерье — предположительно за сбои. Искин создан управлять магико-информационными потоками сети библиотек, поэтому Проклятие Забвения, даже когда путает данные и оставляет артефакты, не мешает ему извлекать полезные намёки.</p>
        </header>

        <div className="book-oracle-page__ritual" aria-busy={phase === 'drawing'}>
          <aside className="book-oracle-page__guide" aria-label="Искин ведёт ритуал">
            <div className="book-oracle-page__guide-glow" aria-hidden="true" />
            <img src={iskinHat} alt="Искин в чёрной остроконечной магической шляпе ведёт Книжный оракул" />
            <p>«Мысленно сформулируйте вопрос. Я расшифрую три карты спокойно и буквально. Подмастерье добрый; если его формулы мерцают, это не заговор, а почерк».</p>
          </aside>

          <section className="book-oracle-page__table" aria-label="Расклад из трёх карт">
            <div className="book-oracle-page__runes" aria-hidden="true">✦ · ⟡ · ✦</div>
            <p className="book-oracle-page__prompt">{phase === 'ready' ? 'Мысленно сформулируйте вопрос и нажмите «Сделать расклад». Искин расшифрует три карты — если Подмастерье снова ничего не перепутал.' : ritualStatus}</p>
            <p className="book-oracle-page__live-status" aria-live="polite">{ritualStatus}</p>

            <div className="book-oracle-page__cards">
              {displayedCards.map((card, index) => {
                const position = positions[index];
                const isRevealed = phase === 'reading' || revealedCount > index;
                const cardStyle = { '--card-index': index } as CSSProperties;

                return (
                  <article
                    key={`${card.id}-${index}`}
                    className={`book-oracle-page__card ${isRevealed ? 'is-revealed' : ''}`}
                    style={cardStyle}
                    aria-label={isRevealed ? `${oraclePositionLabels[position]}: ${card.title}` : `${oraclePositionLabels[position]}: закрытая карта`}
                  >
                    <div className="book-oracle-page__card-inner">
                      <img className="book-oracle-page__card-back" src={oracleCardBack} alt="" />
                      <img className="book-oracle-page__card-face" src={card.image} alt="" />
                      <div className="book-oracle-page__card-label" aria-hidden="true">
                        <span>{String(card.number).padStart(2, '0')} · АРКАН ПОТОКА</span>
                        <strong>{card.title}</strong>
                      </div>
                    </div>
                    <p>{oraclePositionLabels[position]}</p>
                  </article>
                );
              })}
            </div>

            {phase === 'ready' && (
              <button className="book-oracle-page__primary" type="button" onClick={startReading}>
                <Sparkles size={18} aria-hidden="true" />
                Сделать расклад
              </button>
            )}
            {phase === 'drawing' && (
              <button className="book-oracle-page__primary is-waiting" type="button" disabled>
                <Sparkles size={18} aria-hidden="true" />
                Книга раскрывает расклад…
              </button>
            )}
          </section>
        </div>

        {reading && (
          <section className="book-oracle-page__reading" aria-labelledby="oracle-reading-title">
            <p className="book-oracle-page__result-kicker">РАСКЛАД СОБРАН</p>
            <h2 id="oracle-reading-title">Слово Книжного оракула</h2>
            <div className="book-oracle-page__interpretations">
              {reading.entries.map(({ card, interpretation, position }) => {
                return (
                  <article key={card.id}>
                    <p>{oraclePositionLabels[position]}</p>
                    <h3>{card.number} · {card.title}</h3>
                    <em>Символ: {card.symbol}</em>
                    <span>{interpretation}</span>
                  </article>
                );
              })}
            </div>

            <div className="book-oracle-page__summary">
              <Sparkles size={19} aria-hidden="true" />
              <p>{reading.summary}</p>
            </div>

            <section className="book-oracle-page__book" aria-label="Книга к раскладу">
              <BookOpen size={23} aria-hidden="true" />
              <div>
                <p>КНИГА К РАСКЛАДУ</p>
                <h3>«{reading.book.title}»</h3>
                <strong>{reading.book.author}</strong>
                <span>{reading.book.why}</span>
                <small>Рекомендация карты «{reading.book.sourceCard}» ({oraclePositionLabels[reading.book.sourcePosition]}).</small>
              </div>
            </section>

            <div className="book-oracle-page__reading-actions">
              <button className="book-oracle-page__primary" type="button" onClick={resetReading}>
                <Sparkles size={17} aria-hidden="true" />
                Новый расклад
              </button>
              <div className="book-oracle-page__sharing" aria-label="Поделиться раскладом">
                <button type="button" onClick={copyReading}><Copy size={16} aria-hidden="true" /> Скопировать</button>
                <button type="button" onClick={shareReading}><Share2 size={16} aria-hidden="true" /> Поделиться</button>
              </div>
            </div>
            {notice && <p className="book-oracle-page__notice" role="status">{notice}</p>}
          </section>
        )}
      </section>
    </main>
  );
}
