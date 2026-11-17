import { useState } from 'react';
import type { Character } from '../data/characters';
export function CharacterCard({ image, name, status, role, description, variants }: Omit<Character, 'id'>) {
  const [variant, setVariant] = useState(0);
  return <article className="character-card">
    <p className="character-card__place">{status}</p>
    <div className="character-card__portrait"><img src={variants?.[variant].src || image} alt={variants?.[variant].label || name} loading="lazy" decoding="async" /></div>
    {variants && <div className="character-card__variants" aria-label="Облик главного героя">{variants.map((v, i) => <button key={v.label} type="button" aria-label={v.label} aria-pressed={i === variant} onClick={() => setVariant(i)}>{i + 1}</button>)}</div>}
    <div className="character-card__text"><h3>{name}</h3><p>{role}</p><details><summary>Познакомиться</summary><p>{description}</p></details></div>
  </article>;
}
