// src/components/QuizBanner.tsx
// Всплывающий при загрузке сайта баннер с призывом пройти тест

import { useState, useEffect } from 'react';
import { FaHatWizard } from 'react-icons/fa';
import QuizIcon from '../assets/icons/quiz-icon.svg?react';

const STORAGE_KEY = 'quizBannerShown';

export function QuizBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Показываем баннер один раз за сессию, с небольшой задержкой после загрузки
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem(STORAGE_KEY, '1');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const closeBanner = () => setIsVisible(false);

  const goToQuiz = () => {
    setIsVisible(false);
    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={closeBanner}
    >
      <div
        className="relative max-w-md w-full bg-midnight-ink border border-gold-leaf/60 rounded-xl p-8 text-center shadow-[0_0_45px_rgba(240,182,90,0.25)] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={closeBanner}
          className="absolute top-3 right-4 text-shadow-grey hover:text-gold-leaf text-3xl leading-none transition-colors"
          aria-label="Закрыть баннер"
        >
          &times;
        </button>

        <QuizIcon className="w-14 h-14 mx-auto text-gold-leaf mb-4" />

        <h3 className="font-serif text-2xl md:text-3xl text-gold-leaf [text-shadow:0_0_10px_var(--gold-leaf)] mb-3">
          Кто ты из КрасноЦарства?
        </h3>
        <p className="text-off-white/80 leading-relaxed mb-6">
          Проклятие Забвения уже близко… Пройди тест и узнай, кем ты проснёшься в магическом мире КрасноЦарства!
        </p>

        <button
          onClick={goToQuiz}
          className="inline-flex items-center gap-3 bg-gold-leaf hover:bg-gold-leaf/90 text-black font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <FaHatWizard />
          <span>Пройти тест</span>
        </button>
      </div>
    </div>
  );
}
