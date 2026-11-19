import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { charactersData } from '../data/characters';
import library from '../assets/backgrounds/bg1.webp';
import './CharacterShowcase.css';

const cast = [
  { id: 'traveler', label: 'Вы', caption: 'По ту сторону книги' },
  { id: 'iskin', label: 'Искин', caption: 'Ваш проводник' },
  { id: 'archmage', label: 'Архимаг', caption: 'Хранитель тайн' },
  { id: 'apprentice', label: 'Подмастерье', caption: 'Первый союзник' },
  { id: 'albino-elves', label: 'Эльфы-альбиносы', caption: 'Хранители артефактов' },
  { id: 'seer', label: 'Гадалка', caption: 'Хранительница хронокарт' },
  { id: 'antagonist', label: 'Неизвестный', caption: 'Главный антагонист' },
].map(entry => ({ ...charactersData.find(character => character.id === entry.id)!, ...entry }));

export function CharacterShowcase() {
  const [selected, setSelected] = useState(0);
  const [appearance, setAppearance] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const character = cast[selected];
  const portrait = character.variants?.[appearance];
  const isHeroine = character.id === 'traveler' && (appearance === 0 || appearance === 2);
  const name = isHeroine ? 'Путница между мирами' : character.name;
  const role = isHeroine ? 'Читательница из Петербурга' : character.role;

  const moveFocus = (index: number) => {
    setSelected(index);
    tabs.current[index]?.focus();
  };

  return <div className="cast-showcase">
    <div className="cast-tabs" role="tablist" aria-label="Главные герои">
      {cast.map((entry, index) => <button
        key={entry.id}
        ref={element => { tabs.current[index] = element; }}
        type="button"
        role="tab"
        id={`cast-tab-${entry.id}`}
        aria-selected={selected === index}
        aria-controls="cast-story"
        tabIndex={selected === index ? 0 : -1}
        onClick={() => setSelected(index)}
        onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          moveFocus(event.key === 'Home' ? 0 : event.key === 'End' ? cast.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + cast.length) % cast.length);
        }}
      ><span><strong>{entry.label}</strong><small>{entry.caption}</small></span></button>)}
    </div>

    <div id="cast-story" className="cast-story" role="tabpanel" aria-labelledby={`cast-tab-${character.id}`} tabIndex={0}>
      <div className={`cast-portrait${character.id === 'antagonist' ? ' cast-portrait--unknown' : ''}`} style={character.id === 'antagonist' ? undefined : { backgroundImage: `url(${library})` }}>
        <span className="cast-portrait__orbit" aria-hidden="true" />
        {character.groupPortraits ? <div className="cast-portrait__group" key={character.id}>
          {character.groupPortraits.map(member => <img key={member.src} src={member.src} alt={member.label} decoding="async" />)}
        </div> : <img key={`${character.id}-${appearance}`} className="cast-portrait__figure" src={portrait?.src || character.image} alt={portrait?.label || character.imageAlt || character.name} decoding="async" />}
        {character.variants && <div className="cast-appearances">
          <p>Выберите свой облик</p>
          <div role="group" aria-label="Облик главного героя">{character.variants.map((variant, index) => <button key={variant.label} type="button" aria-label={variant.label} aria-pressed={appearance === index} onClick={() => setAppearance(index)}><img src={variant.src} alt="" loading="lazy" /><span aria-hidden="true">0{index + 1}</span></button>)}</div>
        </div>}
      </div>
      <div className="cast-copy" key={character.id}>
        <p className="cast-copy__eyebrow">{character.status}</p>
        <h3>{name}</h3>
        <p className="cast-copy__role">{role}</p>
        <div className="cast-copy__rule" aria-hidden="true" />
        <p className="cast-copy__description">{character.description}</p>
        {character.facts && <dl className="cast-facts">{character.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
      </div>
    </div>
    <div className="cast-epilogue"><p>А за порогом библиотеки вас ждёт целый мир со своими жителями и историями.</p><a href="#map">Отправиться по карте<ArrowUpRight size={18} /></a></div>
  </div>;
}
