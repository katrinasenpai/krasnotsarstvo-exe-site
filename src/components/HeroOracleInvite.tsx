import { useState, type CSSProperties } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import oracleCardBack from '../assets/images/oracle-deck/oracle-card-back.webp';
import { oracleCards } from '../data/bookOracle';
import { preloadOracle } from '../utils/oracleRoute';
import './HeroOracleInvite.css';

const glimpses = [
  { card: oracleCards[0], line: 'Первая страница редко объясняет всё сразу. Иногда достаточно открыть её.', pose: 'wry' },
  { card: oracleCards[9], line: 'Вопрос уже где-то рядом. Попробуйте прислушаться к тому, что осталось между строк.', pose: 'thinking' },
  { card: oracleCards[17], line: 'Любопытство зафиксировано. Это хорошее начало для разговора с книгой.', pose: 'wry' },
];

export function HeroOracleInvite() {
  const [selected, setSelected] = useState<number | null>(null);
  const glimpse = selected === null ? null : glimpses[selected];

  return (
    <section id="chronocards" className="oracle-teaser" aria-labelledby="hero-oracle-title">
      <div className="oracle-teaser__mist" aria-hidden="true" />
      <div className="container oracle-teaser__stage">
        <div className="oracle-teaser__guide">
          <div className="oracle-teaser__halo" aria-hidden="true" />
          <img src={`/characters/iskin-${glimpse?.pose ?? 'wry'}.webp`} alt="Искин приглашает познакомиться с хронокартами" loading="lazy" decoding="async" />
          <p className="oracle-teaser__signature"><strong>Искин</strong><span>Толкователь хронокарт</span></p>
        </div>
        <div className="oracle-teaser__copy">
          <p className="oracle-teaser__eyebrow"><Sparkles size={17} aria-hidden="true" /> ХРОНОКАРТЫ</p>
          <h2 id="hero-oracle-title">У каждой карты<br />есть что рассказать</h2>
          <p className="oracle-teaser__intro">Задайте вопрос Книжному оракулу. Три карты свяжут след прошлого, ключ настоящего и дорогу впереди.</p>
          <div className="oracle-teaser__voice" aria-live="polite">
            <span>ИСКИН</span>
            <p>{glimpse?.line ?? 'Поток стабилен. Почти. Коснитесь карты, а я попробую прочитать то, что она прячет.'}</p>
          </div>
          <a className="oracle-teaser__cta" href="/book-oracle" onPointerEnter={() => { void preloadOracle().catch(() => {}); }} onFocus={() => { void preloadOracle().catch(() => {}); }}>
            Открыть Книжный оракул <ArrowUpRight size={21} aria-hidden="true" />
          </a>
          <p className="oracle-teaser__note">22 аркана · 3 карты · 1 история</p>
        </div>
        <div className="oracle-teaser__deck" role="group" aria-label="Познакомиться с хронокартами">
          <div className="oracle-teaser__fan">
            {glimpses.map(({ card }, index) => (
              <button key={card.id} type="button" className={`oracle-teaser__card ${selected === index ? 'is-open' : ''}`} style={{ '--position': index - 1 } as CSSProperties}
                aria-pressed={selected === index} aria-label={selected === index ? `Закрыть карту «${card.title}»` : `Открыть хронокарту ${index + 1}`}
                onClick={() => setSelected(selected === index ? null : index)}>
                <span className="oracle-teaser__card-inner">
                  <img className="oracle-teaser__card-back" src={oracleCardBack} alt="" loading="lazy" />
                  <span className="oracle-teaser__card-face"><img src={card.image} alt="" loading="lazy" /><strong>{card.title}</strong></span>
                </span>
              </button>
            ))}
          </div>
          <p className="oracle-teaser__hint">Коснитесь любой карты</p>
        </div>
      </div>
    </section>
  );
}
