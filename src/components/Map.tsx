import { useMemo, useState } from 'react';
import { Search, ZoomIn, Map as MapIcon } from 'lucide-react';
import { atlasPlaces, atlasPoint } from '../data/locations';
import { LocationModal } from './LocationModal';
import './Map.css';

export function Map() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState('rzevskaya');
  const [detail, setDetail] = useState(false);
  const [group, setGroup] = useState<'all' | 'libraries' | 'places'>('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => atlasPlaces.filter(p =>
    (group === 'all' || p.library === (group === 'libraries')) &&
    `${p.title} ${p.alias} ${p.real}`.toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru'))
  ), [group, query]);
  const focus = atlasPlaces.find(p => p.id === focusId)!;
  const points = atlasPlaces.map(place => ({ place, ...atlasPoint(place, detail) })).filter(p => p.visible);
  return <>
    <p className="atlas-intro">35 мест, 14 библиотек и две стороны каждого адреса. Выберите миниатюру на карте или найдите место в указателе.</p>
    <div className="atlas">
      <aside className="atlas__index" aria-label="Указатель атласа">
        <div className="atlas__heading"><span>АТЛАС ДВУХ МИРОВ</span><h3>Вдоль Охты</h3></div>
        <label className="atlas__search"><Search size={17} aria-hidden="true" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Название или библиотека" aria-label="Найти место" /></label>
        <div className="atlas__filters" aria-label="Тип места">
          {([['all', 'Все'], ['libraries', 'Библиотеки'], ['places', 'Места']] as const).map(([id, title]) => <button key={id} type="button" aria-pressed={group === id} onClick={() => setGroup(id)}>{title}</button>)}
        </div>
        <div className="atlas__list">
          {filtered.map(p => <button key={p.id} type="button" onMouseEnter={() => setFocusId(p.id)} onFocus={() => setFocusId(p.id)} onClick={() => setActiveId(p.id)}>
            <img src={p.landmark} alt="" loading="lazy" /><span>{p.title}<small>{p.alias}</small></span>
          </button>)}
          {!filtered.length && <p role="status">Место не найдено. Попробуйте другое название.</p>}
        </div>
        <div className="atlas__caption" aria-live="polite"><img src={focus.landmark} alt="" /><h4>{focus.title}</h4><p>{focus.hint}</p></div>
      </aside>
      <div className="atlas__sheet">
        <div className="atlas__toolbar"><button type="button" onClick={() => setDetail(!detail)} aria-pressed={detail}>{detail ? <MapIcon size={17} /> : <ZoomIn size={17} />}{detail ? 'Вся карта' : 'Увеличить юг'}</button><span>Нажмите на объект</span></div>
        <div className="atlas__scroll" tabIndex={0} aria-label="Карта. На небольшом экране её можно прокручивать по горизонтали">
          <div className="atlas__canvas">
            <svg viewBox="470 0 1450 1080" role="img" aria-label={detail ? 'Южная часть КрасноЦарства' : 'Карта земель вдоль Охты'}>
              <image href="/atlas/map.webp" x={detail ? -483 : 0} y={detail ? -810 : 0} width={detail ? 3360 : 1920} height={detail ? 1890 : 1080} />
              {points.map(p => <line key={p.place.id} x1={p.x} y1={p.y} x2={p.px} y2={p.py} stroke="#725c36" strokeWidth="2" />)}
            </svg>
            {points.map(({ place, px, py }) => <button key={place.id} type="button" className={`atlas__pin ${focusId === place.id ? 'is-focused' : ''}`}
              style={{ left: `${(px - 470) / 1450 * 100}%`, top: `${py / 1080 * 100}%` }}
              aria-label={`${place.title}. ${place.real}`} title={place.title}
              onMouseEnter={() => setFocusId(place.id)} onFocus={() => setFocusId(place.id)} onClick={() => setActiveId(place.id)}>
              <img src={place.landmark} alt="" loading="lazy" />
            </button>)}
          </div>
        </div>
        <p className="atlas__credit">Геоданные © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>, ODbL. Иллюстрации КрасноЦарства.</p>
      </div>
    </div>
    {activeId && <LocationModal cardId={activeId} onClose={() => setActiveId(null)} />}
  </>;
}
