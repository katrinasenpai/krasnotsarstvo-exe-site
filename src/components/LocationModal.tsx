import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { locationsData, LocationId } from '../data/locations';

export function LocationModal({ cardId, onClose }: { cardId: LocationId; onClose: () => void }) {
  const [view, setView] = useState<'fantasy' | 'real'>('fantasy');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  const location = locationsData[cardId];
  const info = view === 'real' ? location.real_info : location.fantasy_info;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialogRef.current?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  useEffect(() => { readingRef.current?.scrollTo({top:0}); }, [view]);
  return createPortal(<dialog ref={dialogRef} aria-labelledby="atlas-place-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} className="atlas-dialog">
    <div className="atlas-dialog__inner">
      <button type="button" onClick={onClose} className="atlas-dialog__close" aria-label="Закрыть атлас">×</button>
      <div className="atlas-dialog__plate">
        <div className="atlas-dialog__tabs" aria-label="Сторона разворота">
          <button type="button" onClick={() => setView('real')} aria-pressed={view === 'real'}>Санкт-Петербург</button>
          <button type="button" onClick={() => setView('fantasy')} aria-pressed={view === 'fantasy'}>КрасноЦарство</button>
        </div>
        <figure>
          <a href={info.image} target="_blank" rel="noreferrer" aria-label={`Рассмотреть иллюстрацию: ${info.title}`}>
            <img key={info.image} src={info.image} srcSet={`${info.mobileImage} 640w, ${info.image} 1280w`} sizes="(max-width: 700px) 90vw, 42vw" alt={info.title} decoding="async" />
          </a>
          {view === 'real' && cardId === 'gogol' && <figcaption>Проект интерьера</figcaption>}
        </figure>
        {info.links.length > 0 && <nav className="atlas-dialog__sources" aria-label="Подробнее о реальном месте">{info.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>)}</nav>}
        {view === 'fantasy' && location.encounter && <div className="atlas-dialog__encounter"><h4>Где встретить</h4><p>{location.encounter}</p></div>}
      </div>
      <div className="atlas-dialog__leaf">
        <p className="atlas-dialog__eyebrow">{location.library ? 'Библиотеки' : 'Места'} / {view === 'real' ? 'Красногвардейский район' : 'КрасноЦарство'}</p>
        <div className="atlas-dialog__reading" ref={readingRef} tabIndex={0} aria-label="История места">
          <h2 id="atlas-place-title">{info.title}</h2>
          {info.description.trim().split(/\r?\n\s*\r?\n/).map((paragraph, index) => {
            const [first, ...body] = paragraph.split(/\r?\n/);
            if (body.length && first.endsWith(':') && first.length < 46) return <section key={index}><h3>{first.slice(0,-1)}</h3><p>{body.join('\n')}</p></section>;
            if (index === 0 && !body.length && first.length < 48 && !/[.!…]$/.test(first)) return <h3 key={index}>{first}</h3>;
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
        <button type="button" onClick={onClose} className="atlas-dialog__return">К карте</button>
      </div>
    </div>
  </dialog>, document.body);
}
