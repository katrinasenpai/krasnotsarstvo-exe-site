// src/components/Separator.tsx

import dividerPattern from '../assets/icons/divider-pattern.svg';

export function Separator() {
  return (
    <div 
      className="h-20 w-full bg-contain bg-no-repeat bg-center opacity-20"
      style={{ backgroundImage: `url(${dividerPattern})` }}
      aria-hidden="true" // Декоративный элемент, скрываем от скринридеров
    />
  );
}