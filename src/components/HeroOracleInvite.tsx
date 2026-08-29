import { BookOpen, Sparkles } from 'lucide-react';
import iskinHat from '../assets/images/iskin-states/iskin-hat.webp';
import './HeroOracleInvite.css';

/** Небольшой дополнительный вход в Оракул, не заменяющий основной бренд hero. */
export function HeroOracleInvite() {
  return (
    <aside className="hero-oracle-invite" aria-labelledby="hero-oracle-title">
      <div className="hero-oracle-invite__iskin" aria-hidden="true">
        <img src={iskinHat} alt="" decoding="async" />
      </div>

      <div className="hero-oracle-invite__dialog">
        <p className="hero-oracle-invite__eyebrow"><Sparkles size={14} aria-hidden="true" /> ХРОНОКАРТЫ · КНИЖНЫЙ ОРАКУЛ</p>
        <h2 id="hero-oracle-title">Магико-информационный поток стабилен. Почти.</h2>
        <p>Хотите задать вопрос уникальной колоде КрасноЦарства? Я расшифрую три карты — если поток снова ничего не перепутал.</p>
        <a className="hero-oracle-invite__cta" href="/book-oracle">
          <BookOpen size={18} aria-hidden="true" />
          Спросить Книжный оракул
        </a>
      </div>
    </aside>
  );
}
