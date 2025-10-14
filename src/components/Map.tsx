// src/components/Map.tsx

import React, { useState, useLayoutEffect, useEffect } from 'react';
import { locationsData, LocationId } from '../data/locations';
import mapImage from '../assets/images/map_krascarsvo.webp';
import { LocationModal } from './LocationModal';
import PinIcon from '../assets/icons/pin.svg?react';
import { useInView } from '../hooks/useInView';
import { gsap } from 'gsap';

export function Map() {
  const [activeCardId, setActiveCardId] = useState<LocationId | null>(null);
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });

  // This effect is only for the pins animation
  useLayoutEffect(() => {
    if (inView) {
      gsap.to('.map-pin', {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.05, // Staggered appearance
        delay: 0.5,    // A little delay after the map is in view
      });
    }
  }, [inView]);

  // Блокировка прокрутки страницы когда открыта карточка
  useEffect(() => {
    if (activeCardId) {
      // Блокируем прокрутку
      document.body.style.overflow = 'hidden';
    } else {
      // Восстанавливаем прокрутку
      document.body.style.overflow = 'unset';
    }

    // Очистка при размонтировании компонента
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeCardId]);

  return (
    <>
      {/* This is the simple container for the map */}
      <div ref={ref} className="relative w-full rounded-lg overflow-hidden md:aspect-[1.77]">
        {/* The map is visible immediately, without animations */}
        <img 
          src={mapImage} 
          alt="Карта КрасноЦарства" 
          className="w-full h-auto md:h-full md:object-cover object-contain"
        />

        {/* The pins are initially invisible and wait for the useInView signal */}
        {Object.values(locationsData).map((loc) => (
          <button
            key={loc.id}
            className="map-pin group absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 scale-75 touch-none"
            style={{ left: loc.coords.x, top: loc.coords.y }}
            onClick={() => setActiveCardId(loc.id)}
          >
            <PinIcon className="w-full h-full text-[#64f8fd]/75 animate-pulse-glow transition-all duration-300 group-hover:text-[#64f8fd] group-hover:animate-none" />
            <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 bg-midnight-ink/80 text-off-white text-xs rounded-md scale-0 group-hover:scale-100 transition-all origin-bottom z-30">
              <h4 className="font-bold">{loc.title}</h4>
              <p>{loc.tooltip}</p>
            </div>
          </button>
        ))}
      </div>

      {activeCardId && (
        <LocationModal 
          cardId={activeCardId} 
          onClose={() => setActiveCardId(null)} 
        />
      )}
    </>
  );
}