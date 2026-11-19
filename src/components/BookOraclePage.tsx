import { BookOpen, Copy, RotateCcw, Shuffle } from 'lucide-react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { cardBack, chronocards, chronicleReducer, createChronicleState, positions, questions, readingPrompts, shuffleRemaining } from '../data/chronocards';
import './BookOraclePage.css';

export default function BookOraclePage() {
  const [state, dispatch] = useReducer(chronicleReducer, undefined, createChronicleState);
  const [notice, setNotice] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const cardButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const firstRender = useRef(true);
  const { phase, hand, spread, position, shuffles } = state;
  const current = chronocards[spread[position]];
  const remaining = hand.filter(card => !spread.includes(card));
  const pose = phase === 'read' || phase === 'book' ? 'read' : spread.length || shuffles ? 'deal' : 'welcome';
  const title = phase === 'choose' ? positions[spread.length] : phase === 'select' ? 'Какой карте доверить закладку?' : phase === 'book' ? 'Книга в дорогу' : positions[position];

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    heading.current?.focus({ preventScroll: true });
    setNotice('');
  }, [phase, spread.length]);

  const reset = () => dispatch({ type: 'reset', hand: createChronicleState().hand });
  const copy = async () => {
    if (phase !== 'book' || !current) return;
    const text = ['Хронокарты КрасноЦарства. Шатёр гадалки', ...spread.map((number, index) => `${positions[index]}: ${chronocards[number].title}. ${chronocards[number].reading[index]}`),
      `Карта для чтения: ${current.title}. Книга: «${current.book[0]}», ${current.book[1]}. ${current.book[2]}`, readingPrompts[position]].join('\n\n');
    try { await navigator.clipboard.writeText(text); setNotice('Расклад и книга скопированы.'); }
    catch { setNotice('Не удалось скопировать. Текст можно выделить на странице.'); }
  };

  return <main className={`book-oracle-page is-${phase}`}>
    <img className="book-oracle-page__background" src="/chronocards/tent.webp" alt="" />
    <a className="book-oracle-page__back" href="/#iskin">Вернуться к Искину</a>
    <header className="book-oracle-page__heading">
      <p>ХРОНОКАРТЫ КРАСНОЦАРСТВА</p>
      <h1 id="book-oracle-title">Шатёр гадалки</h1>
      <p>Три карты о прошлом, настоящем и будущем, которое ещё можно изменить.</p>
    </header>
    <div className="book-oracle-page__stage">
      <aside className="book-oracle-page__seer" aria-label="Гадалка">
        <img src={`/chronocards/seer-${pose}.webp`} alt="Гадалка с синими косами и колодой хронокарт" decoding="async" />
        <div><strong>Гадалка</strong><p>«После выбери одну. Я подберу к ней книгу. А уж какую строчку взять в дорогу, решишь по пути».</p></div>
      </aside>
      <section className="book-oracle-page__table" aria-labelledby="oracle-step-title">
        <p className="book-oracle-page__eyebrow">{phase === 'choose' ? `Карта ${spread.length + 1} из 3` : phase === 'book' ? 'Ваша закладка' : 'Расклад'}</p>
        <h2 id="oracle-step-title" ref={heading} tabIndex={-1}>{title}</h2>
        {phase === 'choose' && <>
          <p className="book-oracle-page__question">{questions[spread.length]}</p>
          <p className="book-oracle-page__hint">Выберите карту. Можно нажать на неё или перейти стрелками и выбрать пробелом.</p>
          <div className="book-oracle-page__deck-tools">
            <button type="button" className="oracle-secondary" onClick={() => dispatch({ type: 'shuffle', hand: shuffleRemaining(hand, spread) })}><Shuffle size={17} /> Перетасовать</button>
            <span role="status">{shuffles ? 'Колода перетасована. ' : ''}Осталось {remaining.length} из 22</span>
          </div>
          <div key={shuffles} className={`book-oracle-page__deck${shuffles ? ' is-shuffled' : ''}`} role="group" aria-label="Закрытые хронокарты">
            {hand.map((number, slot) => spread.includes(number) ? <span key={number} className="oracle-deck-space" aria-hidden="true" /> : <button
              type="button" key={number} ref={element => { cardButtons.current[number] = element; }}
              aria-label={`Выбрать закрытую карту ${slot + 1}`} onClick={() => dispatch({ type: 'draw', card: number })}
              onKeyDown={event => {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();
                const index = remaining.indexOf(number);
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? remaining.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + remaining.length) % remaining.length;
                cardButtons.current[remaining[next]]?.focus();
              }}><img src={cardBack} alt="" /></button>)}
          </div>
          {spread.length > 0 && <div className="book-oracle-page__seen" aria-label="Уже открытые карты">{spread.map((number, index) => <div key={number}><img src={chronocards[number].image} alt="" /><p><span>{positions[index]}</span>{chronocards[number].title}</p></div>)}</div>}
        </>}
        {phase === 'read' && current && <>
          <div className="book-oracle-page__reading" key={current.id}>
            <img className="oracle-card-art" src={current.image} alt={`Хронокарта «${current.title}»`} />
            <div><h3>{current.title}</h3><p>{current.reading[position]}</p></div>
          </div>
          <button type="button" className="oracle-primary" onClick={() => dispatch({ type: 'next' })}>{spread.length < 3 ? 'Открыть следующую карту' : 'Выбрать карту для чтения'}</button>
        </>}
        {phase === 'select' && <>
          <p className="book-oracle-page__question">Выберите вопрос, с которым откроете книгу.</p>
          <div className="book-oracle-page__selection">{spread.map((number, index) => <button type="button" key={number} onClick={() => dispatch({ type: 'book', position: index })} aria-label={`Выбрать «${chronocards[number].title}» для чтения`}>
            <img src={chronocards[number].image} alt="" /><span>{positions[index]}</span><strong>{chronocards[number].title}</strong>
          </button>)}</div>
        </>}
        {phase === 'book' && current && <>
          <div className="book-oracle-page__reading" key={current.id}>
            <img className="oracle-card-art" src={current.image} alt={`Хронокарта «${current.title}»`} />
            <div><p className="book-oracle-page__eyebrow"><BookOpen size={16} /> {current.title}</p><h3>{current.book[0]}</h3><p className="book-oracle-page__author">{current.book[1]}</p><p>{current.book[2]}</p><p className="book-oracle-page__prompt">{readingPrompts[position]}</p></div>
          </div>
          <div className="book-oracle-page__actions">
            <button type="button" className="oracle-primary" onClick={copy}><Copy size={17} /> Сохранить текст расклада</button>
            <button type="button" className="oracle-secondary" onClick={() => dispatch({ type: 'select' })}>Выбрать другую карту</button>
          </div>
          <p className="book-oracle-page__notice" role="status">{notice}</p>
        </>}
        {spread.length > 0 && <button type="button" className="oracle-restart" onClick={reset}><RotateCcw size={15} /> Разложить заново</button>}
      </section>
    </div>
  </main>;
}
