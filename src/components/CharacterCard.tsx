// src/components/CharacterCard.tsx

import React from 'react';

// Обновляем типы, добавляем статус и роль
type CharacterProps = {
  image: string;
  name: string;
  status: string;
  role: string;
  description: string;
};

export function CharacterCard({ image, name, status, role, description }: CharacterProps) {
  return (
    <div className="flip-card h-96 w-72 flex-shrink-0 group">
      <div className="flip-card-inner group-hover:shadow-2xl group-hover:shadow-gold-leaf/20">
        
        {/* === ЛИЦЕВАЯ СТОРОНА КАРТОЧКИ === */}
        <div className="flip-card-front rounded-lg bg-shadow-grey/20 border border-shadow-grey/30 flex flex-col overflow-hidden">
          {/* Статус вверху */}
          <div className="px-4 py-1 bg-gradient-to-r from-transparent via-gold-leaf/20 to-transparent">
            <p className="text-center font-serif text-sm text-gold-leaf tracking-widest">{status}</p>
          </div>
          
          {/* Контейнер для изображения */}
          <div className="flex-grow flex items-center justify-center relative">
            {/* Декоративная тень под персонажем */}
            <div className="absolute bottom-4 h-8 w-3/4 bg-black/50 rounded-full blur-xl"></div>
            <img 
              src={image} 
              alt={name} 
              className="max-h-64 object-contain z-10"
            />
          </div>

          {/* Имя персонажа внизу */}
          <div className="px-4 py-3 bg-gradient-to-r from-transparent via-black/30 to-transparent">
            <h3 className="font-serif text-3xl text-off-white text-center">{name}</h3>
          </div>
        </div>

        {/* === ОБРАТНАЯ СТОРОНА КАРТОЧКИ === */}
        <div className="flip-card-back p-6 rounded-lg bg-ancient-parchment text-deep-blue-ink border border-shadow-grey/30 flex flex-col text-left">
          <div className="mb-4">
            <h3 className="font-serif text-2xl">{name}</h3>
          </div>

          <div className="mb-4">
            <p className="font-bold text-sm opacity-70">Роль:</p>
            <p className="text-base italic">{role}</p>
          </div>
          
          {/* Декоративный разделитель */}
          <hr className="border-deep-blue-ink/20 my-2" />

          <div>
            <p className="font-bold text-sm opacity-70">Описание:</p>
            <p className="text-sm leading-snug">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}