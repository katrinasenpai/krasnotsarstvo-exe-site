import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { locationsData, LocationId } from '../data/locations';
export function LocationModal({ cardId, onClose }: { cardId: LocationId; onClose: () => void }) {
  const [view, setView] = useState<'fantasy' | 'real'>('fantasy');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const location = locationsData[cardId];
  const info = view === 'real' ? location.real_info : location.fantasy_info;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialogRef.current?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return createPortal(<dialog ref={dialogRef} aria-labelledby="atlas-place-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} className="atlas-dialog">
    <div className="atlas-dialog__inner">
      <button type="button" onClick={onClose} className="atlas-dialog__close" aria-label="Закрыть карточку">×</button>
      <p className="atlas-dialog__eyebrow">АТЛАС КРАСНОЦАРСТВА</p><h2 id="atlas-place-title">{location.title}</h2>
      <div className="atlas-dialog__tabs" aria-label="Сторона карточки">
        <button type="button" onClick={() => setView('fantasy')} aria-pressed={view === 'fantasy'}>КрасноЦарство</button>
        <button type="button" onClick={() => setView('real')} aria-pressed={view === 'real'}>Петербург</button>
      </div>
      <div className="atlas-dialog__body"><img key={info.image} src={info.image} alt={info.title} /><div><h3>{info.title}</h3><p>{info.description}</p></div></div>
    </div>
  </dialog>, document.body);
}
