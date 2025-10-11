// src/components/LocationModal.tsx

import { useState } from 'react';
import { locationsData, LocationId } from '../data/locations';

type LocationModalProps = {
  cardId: LocationId;
  onClose: () => void;
};

export function LocationModal({ cardId, onClose }: LocationModalProps) {
  const [view, setView] = useState<'fantasy' | 'real'>('fantasy');
  const location = locationsData[cardId];
  const info = view === 'real' ? location.real_info : location.fantasy_info;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 lightbox-fade-in" onClick={onClose}>
      <div className="relative bg-ancient-parchment text-deep-blue-ink w-full max-w-5xl h-[90vh] rounded-lg p-6 md:p-8 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-2 right-3 text-4xl text-deep-blue-ink/50 hover:text-deep-blue-ink transition-colors">&times;</button>
        
        <h2 className="text-center font-serif text-3xl md:text-4xl">{location.title}</h2>
        
        <div className="flex justify-center gap-4 border-b-2 border-deep-blue-ink/10 pb-4">
          <button onClick={() => setView('fantasy')} className={`font-bold py-2 px-4 rounded transition-colors ${view === 'fantasy' ? 'bg-deep-blue-ink/20' : 'hover:bg-deep-blue-ink/10'}`}>Фэнтезийная версия</button>
          <button onClick={() => setView('real')} className={`font-bold py-2 px-4 rounded transition-colors ${view === 'real' ? 'bg-deep-blue-ink/20' : 'hover:bg-deep-blue-ink/10'}`}>Реальная история</button>
        </div>

        <div className="flex-grow flex flex-col md:flex-row gap-8 overflow-y-auto pr-2">
          <div className="md:w-1/2">
            <h3 className="font-serif text-2xl mb-4">{info.title}</h3>
            <div className="space-y-4">
              <p className="whitespace-pre-wrap leading-relaxed text-sm">{info.description}</p>
              
              {/* Ссылка на внешний ресурс для реальных объектов */}
              {view === 'real' && info.external_link && (
                <div className="mt-6 p-4 bg-gold-leaf/10 rounded-lg border border-gold-leaf/20">
                  <h4 className="font-serif text-lg mb-2 text-gold-leaf">Узнать больше</h4>
                  <a 
                    href={info.external_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gold-leaf hover:text-gold-leaf/80 transition-colors font-medium"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Открыть на Краснакарте
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex items-center justify-center">
            <img src={info.image} alt={info.title} className="max-w-full max-h-full object-contain rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}