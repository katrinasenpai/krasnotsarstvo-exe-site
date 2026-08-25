import { ArrowLeft, Box, Radio, Sparkles } from 'lucide-react';
import iskinProjection from '../assets/images/iskin-states/iskin-projection.webp';
import './IskinProjectionPage.css';

/** Лёгкая самостоятельная сцена для перехода к проекции Искина. */
export default function IskinProjectionPage() {
  return (
    <main className="iskin-projection-page">
      <a className="iskin-projection-page__back" href="/" aria-label="Вернуться на сайт КрасноЦарства">
        <ArrowLeft size={18} aria-hidden="true" />
        КрасноЦарство
      </a>

      <section className="iskin-projection-page__content" aria-labelledby="iskin-projection-title">
        <p className="iskin-projection-page__signal">
          <Radio size={15} aria-hidden="true" />
          ГОЛОГРАФИЧЕСКИЙ КАНАЛ · 01
        </p>
        <h1 id="iskin-projection-title">Искин на связи</h1>
        <p className="iskin-projection-page__lead">
          Проекция синхронизирована. Я помогу отыскать утраченные знания Красноцарства.
        </p>

        <figure className="iskin-projection-page__scene">
          <div className="iskin-projection-page__aura" aria-hidden="true" />
          <div className="iskin-projection-page__scanlines" aria-hidden="true" />
          <img
            src={iskinProjection}
            alt="Искин в бирюзовой голографической проекции, растворяющейся ниже пояса"
            decoding="async"
          />
          <figcaption>
            <Sparkles size={15} aria-hidden="true" />
            РЕЖИМ ПРОЕКЦИИ АКТИВЕН
          </figcaption>
        </figure>

        <p className="iskin-projection-page__note">
          Проекция устойчива. Откройте режим размещения, чтобы увидеть Искина в своей комнате.
        </p>
        <a className="iskin-projection-page__ar-link" href="/iskin-ar">
          <Box size={17} aria-hidden="true" />
          Открыть AR
        </a>
      </section>
    </main>
  );
}
