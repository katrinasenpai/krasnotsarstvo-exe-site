import { Camera, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { preloadOracle } from '../utils/oracleRoute';
import { getIskinArUrl } from '../utils/iskinProjectionUrl';
import './HeroOracleInvite.css';
import { IskinProjection } from './IskinProjection';

const prepareVisit = () => { void preloadOracle().catch(() => {}); };

export function HeroOracleInvite() {
  const arLink = getIskinArUrl();
  return <section id="iskin" className="oracle-teaser" aria-labelledby="hero-oracle-title">
    <span id="chronocards" className="oracle-teaser__anchor" aria-hidden="true" />
    <div className="container oracle-teaser__stage">
      <div className="oracle-teaser__guide">
        <div className="oracle-teaser__halo" aria-hidden="true" />
        <IskinProjection />
        <p className="oracle-teaser__signature"><strong>Искин</strong><span>Искусственный интеллект</span></p>
      </div>
      <div className="oracle-teaser__copy">
        <p className="oracle-teaser__eyebrow"><Sparkles size={17} aria-hidden="true" /> ИСКИН РЯДОМ</p>
        <h2 id="hero-oracle-title">Пойдём к гадалке?</h2>
        <p className="oracle-teaser__intro">За туманом, в шатре при свечах, вас ждёт хранительница хронокарт. Вытяните три карты и выберите одну, к которой она подберёт книгу.</p>
        <div className="oracle-teaser__voice"><span>ИСКИН</span><p>«Покажу дорогу к гадалке. Хронокарты у неё. Какую книгу взять в путь, решишь после расклада».</p></div>
        <a className="oracle-teaser__cta" href="/book-oracle" onPointerEnter={prepareVisit} onFocus={prepareVisit}>Пойти к гадалке</a>
        <p className="oracle-teaser__note">22 хронокарты · 3 вопроса · книга в дорогу</p>
      </div>
      <a className="oracle-teaser__destination" href="/book-oracle" onPointerEnter={prepareVisit} onFocus={prepareVisit} aria-label="Войти в шатёр гадалки">
        <img className="oracle-teaser__tent" src="/chronocards/tent.webp" alt="" loading="lazy" />
        <img className="oracle-teaser__seer" src="/chronocards/seer-welcome.webp" alt="Гадалка с колодой хронокарт" loading="lazy" />
        <span>Шатёр гадалки<small>Войти</small></span>
      </a>
      <aside className="oracle-teaser__ar" aria-labelledby="iskin-ar-invite-title">
        <div className="oracle-teaser__ar-copy">
          <h3 id="iskin-ar-invite-title"><Camera size={24} aria-hidden="true" /> Искин в вашем мире</h3>
          <p>Пригласите Искина в своё пространство через камеру телефона.</p>
          <a href="/iskin-ar"><Camera size={20} aria-hidden="true" /> Вызвать Искина в AR</a>
          <small>Дополненная реальность · Android и iPhone с поддержкой AR.</small>
        </div>
        <div className="oracle-teaser__qr"><QRCodeSVG value={arLink.url} size={112} bgColor="#f3e6c8" fgColor="#142632" marginSize={2} title="Искин в дополненной реальности" /><p>Наведите камеру телефона</p></div>
      </aside>
    </div>
  </section>;
}
