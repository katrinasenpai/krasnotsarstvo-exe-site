// src/App.tsx

import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';

// Эффект дыма за курсором подгружается отдельно, чтобы не утяжелять основной бандл
const SplashCursor = lazy(() => import('./components/SplashCursor'));
import { CharacterCard } from './components/CharacterCard';
import { Map } from './components/Map';
import { Separator } from './components/Separator'; 
import { FeaturesTabs } from './components/FeaturesTabs';
import { Footer } from './components/Footer';
import { Quiz } from './components/Quiz';
import { QuizBanner } from './components/QuizBanner';
import { FaHeart, FaBookOpen, FaCodeBranch, FaMapMarkedAlt, FaBookReader, FaCalendarAlt, FaStar, FaExternalLinkAlt, FaVk, FaTelegram } from 'react-icons/fa';
import heroBg from './assets/backgrounds/hero-bg.webp';
import playerImg from './assets/images/player.webp';
import iskinImg from './assets/images/iskin.webp';
import apprenticeImg from './assets/images/apprentice.webp';
import archmageImg from './assets/images/archmage.webp';
import elfImg from './assets/images/elf.webp';
import ArrowLeftIcon from './assets/icons/arrow-left.svg?react';
import ArrowRightIcon from './assets/icons/arrow-right.svg?react';
import bg1 from './assets/backgrounds/bg1.webp';
import bg2 from './assets/backgrounds/bg2.webp';
import bg3 from './assets/backgrounds/bg3.webp';
import bg4 from './assets/backgrounds/bg4.webp';

// ИМПОРТЫ ДЛЯ ГАЛЕРЕИ
import gallery1 from './assets/images/gallery-1.webp';
import gallery2 from './assets/images/gallery-2.webp';
import gallery3 from './assets/images/gallery-3.webp';
import gallery4 from './assets/images/gallery-4.webp';
import gallery5 from './assets/images/gallery-5.webp';
import gallery6 from './assets/images/gallery-6.webp';
import gallery7 from './assets/images/gallery-7.webp';
import gallery8 from './assets/images/gallery-8.webp';
import gallery9 from './assets/images/gallery-9.webp';
import gallery10 from './assets/images/gallery-10.webp';
import gallery11 from './assets/images/gallery-11.webp';
import orgLogos1 from './assets/images/org-logos.webp';
import orgLogos2 from './assets/images/org-logos_2.webp';

// --- ИМПОРТЫ ИКОНОК ---
import HomeIcon from './assets/icons/home-icon.svg?react';
import StoryIcon from './assets/icons/story-icon.svg?react';
import TeaserIcon from './assets/icons/teaser-icon.svg?react';
import MapIcon from './assets/icons/map-icon.svg?react';
import CharactersIcon from './assets/icons/characters-icon.svg?react';
import FeaturesIcon from './assets/icons/features-icon.svg?react';
import GalleryIcon from './assets/icons/gallery-icon.svg?react';
import QuizIcon from './assets/icons/quiz-icon.svg?react';
import BellIcon from './assets/icons/bell-icon.svg?react';

// --- ЕДИНЫЙ ИСТОЧНИК ДАННЫХ ДЛЯ НАВИГАЦИИ ---
const navLinks = [
  { href: 'home', IconComponent: HomeIcon, label: 'Главная' },
  { href: 'story', IconComponent: StoryIcon, label: 'Об игре' },
  { href: 'teaser', IconComponent: TeaserIcon, label: 'Трейлер'},
  { href: 'characters', IconComponent: CharactersIcon, label: 'Персонажи' },
  { href: 'map', IconComponent: MapIcon, label: 'Карта'},
  { href: 'features', IconComponent: FeaturesIcon, label: 'Особенности' },
  { href: 'gallery', IconComponent: GalleryIcon, label: 'Галерея' },
  { href: 'quiz', IconComponent: QuizIcon, label: 'Тест' },
  { href: 'download', IconComponent: BellIcon, label: 'ДЕМО-ВЕРСИЯ ДОСТУПНА!' },
];

const charactersData = [
  {
    image: playerImg,
    name: 'Игрок',
    status: 'Герой',
    role: 'Хранитель знания, избранный, путешественник между мирами',
    description: 'Ты — главный герой/героиня. Выбрав облик и имя, попадаешь в параллельную реальность мира КрасноЦарства через библиотеку «Ржевская», чтобы победить Проклятие Забвения.'
  },
  {
    image: archmageImg,
    name: 'Архимаг',
    status: 'Союзник',
    role: 'Верховный маг, мудрый наставник, основатель магической сети библиотек',
    description: 'Загадочный создатель централизованной системы магических библиотек, который теряет контроль над миром из-за Проклятия Забвения. Редко появляется лично, но его влияние ощущается повсюду.'
  },
  {
    image: apprenticeImg,
    name: 'Подмастерье',
    status: 'Союзник',
    role: 'Ученик Архимага, молодой волшебник, помощник героя',
    description: 'Немного забывчивый помощник Архимага – стажёр с доступом ко всей системе… хотя, возможно, по ошибке. Даёт игроку карту мира и вводит в курс миссии.'
  },
  {
    image: iskinImg,
    name: 'Искин',
    status: 'Нейтралитет',
    role: 'Искусственный интеллект, цифровой гид, консультант',
    description: 'Разработан Архимагом для управления магико-информационными потоками в КрасноЦарстве. Поясняет лор, даёт саркастические подсказки. Наблюдаются баги в работе из-за проклятия.'
  },
  {
    image: elfImg,
    name: 'Эльфы-альбиносы',
    status: 'Нейтралитет',
    role: 'Торговцы-монополисты, коллекционеры, искусные маги',
    description: 'Раса предпринимателей и коллекционеров древних артефактов. Живут глубоко под землёй и являются монополистами в торговле. В их лавках продаются самые могущественные предметы КрасноЦарства.'
  }
];

const galleryImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery9,
  gallery10,
  gallery11
];

function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 320;
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 320;
    }
  };

  // Обработчики для свайпа
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scrollRight();
    }
    if (isRightSwipe) {
      scrollLeft();
    }
  };

  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [galleryTouchStart, setGalleryTouchStart] = useState<number | null>(null);
  const [galleryTouchEnd, setGalleryTouchEnd] = useState<number | null>(null);
  const [showSplashCursor, setShowSplashCursor] = useState(false);

  // Эффект дыма включаем только на десктопе и только на достаточно мощных устройствах
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const isWeakDevice =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) ||
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 4);

    const checkIsDesktop = () => {
      setShowSplashCursor(window.matchMedia('(min-width: 768px)').matches && !isWeakDevice);
    };

    // Проверяем при загрузке
    checkIsDesktop();

    // Добавляем слушатель изменения размера окна
    window.addEventListener('resize', checkIsDesktop);

    // Очистка слушателя при размонтировании
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const galleryScrollLeft = () => {
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const galleryScrollRight = () => {
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Обработчики для свайпа галереи
  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    setGalleryTouchEnd(null);
    setGalleryTouchStart(e.targetTouches[0].clientX);
  };

  const handleGalleryTouchMove = (e: React.TouchEvent) => {
    setGalleryTouchEnd(e.targetTouches[0].clientX);
  };

  const handleGalleryTouchEnd = () => {
    if (!galleryTouchStart || !galleryTouchEnd) return;
    
    const distance = galleryTouchStart - galleryTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      galleryScrollRight();
    }
    if (isRightSwipe) {
      galleryScrollLeft();
    }
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
    <div className="min-h-screen bg-midnight-ink text-off-white pl-0 md:pl-20"> 
      {showSplashCursor && (
        <Suspense fallback={null}>
          <SplashCursor
            SPLAT_FORCE={2000}        // <-- Уменьшили силу (было 6000 по умолчанию)
            DENSITY_DISSIPATION={4}   // <-- Как быстро исчезает "дым"
            SPLAT_RADIUS={0.5}      // <-- Размер "кляксы" от курсора
            CURL={10}                // <-- Степень "завихрения"
            PRESSURE={0.2}           // <-- Сила "давления" жидкости
          />
        </Suspense>
      )}
      <Navbar navLinks={navLinks} />
      <QuizBanner />

      {/* HERO */}
      <section id="home" className="relative h-screen overflow-hidden">
        <img src={heroBg} alt="Библиотека КрасноЦарства" className="absolute top-0 left-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 h-full px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="absolute top-[12%] sm:top-[30%] md:top-[35%] left-1/2 -translate-x-1/2 w-[92%] sm:w-auto sm:left-8 sm:translate-x-0 md:left-24 md:right-16">
            <p className="font-handwriting text-xl sm:text-2xl md:text-2xl lg:text-3xl font-extralight max-w-md sm:max-w-md md:max-w-lg text-gold-leaf opacity-50 leading-relaxed text-center sm:text-left [text-shadow:0_0_2px_var(--gold-leaf)] tracking-wide">
              ✨ Помоги восстановить утраченные знания — исследуй мистические локации КрасноЦарства и&nbsp;открывай реальную историю их прототипов в Красногвардейском районе <span className="whitespace-nowrap">Санкт-Петербурга</span> 
            </p>
          </div>
          <div className="absolute flex flex-col sm:flex-row gap-3 sm:gap-4 bottom-[10%] sm:bottom-[15%] left-4 sm:left-auto sm:right-[10%] right-4">
            <a 
              href="https://vkplay.ru/play/game/krasnocarstvoexe/" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-leaf hover:bg-gold-leaf/90 text-black font-bold py-2 sm:py-3 px-4 sm:px-6 rounded flex items-center justify-center gap-2 shadow-lg transition-transform transform hover:scale-105 text-sm sm:text-base"
            >
              <FaHeart className="mr-2" />
              <span>Добавить в желаемое</span>
            </a>
            <a 
              href="#story" 
              className="border border-gold-leaf text-gold-leaf hover:bg-gold-leaf hover:text-black font-bold py-2 sm:py-3 px-4 sm:px-6 rounded flex items-center justify-center gap-2 transition-transform transform hover:scale-105 text-sm sm:text-base"
            >
              <FaBookOpen className="mr-2" />
              <span>Узнать больше</span>
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT THE GAME SECTION (бывший STORY) */}
      <section id="story" className="py-20 md:py-32 bg-midnight-ink">
        <div className="container">
          <h2 className="text-center font-serif text-4xl md:text-5xl xl:text-6xl font-normal mb-12 text-gold-leaf [text-shadow:0_0_12px_var(--gold-leaf)] flex items-center justify-center gap-4">
            <StoryIcon className="w-10 h-10" />
            ОБ ИГРЕ
          </h2>

          {/* Двух-колоночная структура */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Левая колонка: Описание */}
            <div className="text-lg text-off-white/80 leading-relaxed">
              <p>
                «КрасноЦарство.exe» — это мистическая визуальная новелла, где реальная история Красногвардейского района Санкт-Петербурга переплетается с магическим миром КрасноЦарства.
              </p>
              <p className="mt-4">
                Вы — обычный читатель, который случайно активирует портал в библиотеке «Ржевская» и оказывается втянут в борьбу с Проклятием Забвения, стирающим память целого мира. Ваши решения определят судьбу героев, исход истории и то, какие тайны вам удастся раскрыть.
              </p>
            </div>

            {/* Правая колонка: Ключевые особенности */}
            <div>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="text-gold-leaf text-2xl mt-1"><FaCodeBranch /></div>
                  <div>
                    <h3 className="font-serif text-xl font-bold">Нелинейный сюжет</h3>
                    <p className="text-off-white/70">Принимайте решения, которые влияют на историю и ведут к одной из концовок.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="text-gold-leaf text-2xl mt-1"><FaMapMarkedAlt /></div>
                  <div>
                    <h3 className="font-serif text-xl font-bold">Два мира — одна история</h3>
                    <p className="text-off-white/70">Исследуйте фэнтезийное КрасноЦарство и узнавайте реальную историю его прототипов в Санкт-Петербурге.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="text-gold-leaf text-2xl mt-1"><FaBookReader /></div>
                  <div>
                    <h3 className="font-serif text-xl font-bold">Интерактивная карта</h3>
                    <p className="text-off-white/70">Путешествуйте по живой карте, открывайте новые локации и находите скрытые артефакты.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <section 
        id="teaser" 
        className="relative py-20 md:py-32 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bg4})` }} // <-- Используем ваш новый фон
      >
        {/* Затемняющий слой для читаемости */}
        <div className="absolute inset-0 bg-midnight-ink/70"></div>

        {/* Контейнер для контента должен быть 'relative', чтобы быть поверх затемнения */}
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            
            {/* Левая колонка с текстом */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-center font-serif text-4xl md:text-5xl xl:text-6xl font-normal mb-12 text-gold-leaf [text-shadow:0_0_12px_var(--gold-leaf)] flex items-center justify-left gap-4">
                <TeaserIcon className="w-10 h-10" />
                ТРЕЙЛЕР
              </h2>
              <p className="text-lg text-off-white/80 leading-relaxed">
                Погрузитесь в атмосферу КрасноЦарства с первым трейлером игры. Мир охвачен Проклятием Забвения: страницы пустеют, порталы рушатся, память исчезает. И только ты, случайный посетитель библиотеки, можешь восстановить утраченные знания...
              </p>
            </div>

            {/* Правая колонка с видео */}
            <div className="lg:w-1/2 w-full">
              {/* Декоративная рамка */}
              <div className="p-2 border-2 border-gold-leaf/50 rounded-lg shadow-lg">
                {/* Адаптивный контейнер для видео */}
                <div className="aspect-video">
                  
                  {/* --- ВК ВИДЕО IFRAME --- */}
                  <iframe 
                    src="https://vkvideo.ru/video_ext.php?oid=-17047312&id=456240243&hd=2&autoplay=1" 
                    className="w-full h-full rounded-md" 
                    style={{backgroundColor: '#000'}}
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" 
                    frameBorder="0" 
                    allowFullScreen>
                  </iframe>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CHARACTERS SECTION */}
      <section id="characters" className="py-20 md:py-32 bg-midnight-ink">
        <div className="container relative">
          <h2 className="text-center font-serif text-4xl md:text-5xl xl:text-6xl font-normal mb-12 text-gold-leaf [text-shadow:0_0_12px_var(--gold-leaf)] flex items-center justify-center gap-4">
            <CharactersIcon className="w-10 h-10" />
            ПЕРСОНАЖИ
          </h2>

          {/* ТЕКСТ */}
          <p className="text-center max-w-4xl mx-auto mb-12 text-lg text-off-white/80 leading-relaxed">
            Познакомьтесь c персонажами и лором фэнтези мира КрасноЦарства, узнайте о реальных местах Красногвардейского района Санкт-Петербурга и профессиях, которые существовали на Охте.
          </p> 

          <div 
            ref={scrollContainerRef} 
            className="flex overflow-x-hidden gap-8 pb-4 scroll-smooth no-scrollbar"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {charactersData.map((char) => (
              // --- ИЗМЕНЕНИЯ ТОЛЬКО ЗДЕСЬ ---
              <CharacterCard 
                key={char.name}
                image={char.image}
                name={char.name}
                status={char.status}      // <-- Добавили статус
                role={char.role}          // <-- Добавили роль
                description={char.description}
              />
            ))}
          </div>

          <button 
            onClick={scrollLeft} 
            // Добавляем классы для плавного увеличения
            className="group absolute top-1/2 -translate-y-1/2 left-[-1.5rem] z-10 p-2 transition-transform duration-300 hover:scale-125 hidden md:block"
            aria-label="Прокрутить влево"
          >
            <ArrowLeftIcon 
              className="w-17 h-8 text-shadow-grey group-hover:text-gold-leaf transition-colors duration-300" 
            />
          </button>

          <button 
            onClick={scrollRight} 
            // Добавляем классы для плавного увеличения
            className="group absolute top-1/2 -translate-y-1/2 right-[-1.5rem] z-10 p-2 transition-transform duration-300 hover:scale-125 hidden md:block"
            aria-label="Прокрутить вправо"
          >
            <ArrowRightIcon 
              className="w-17 h-8 text-shadow-grey group-hover:text-gold-leaf transition-colors duration-300" 
            />
          </button>
          
        </div>
      </section>

      {/* MAP SECTION */}
      <section 
        id="map" 
        className="relative py-12 md:py-32 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <div className="absolute inset-0 bg-midnight-ink/75"></div>
        <div className="container relative z-10">
          <div> 
            <h2 className="text-center font-serif text-4xl md:text-5xl xl:text-6xl font-normal mb-12 text-gold-leaf [text-shadow:0_0_12px_var(--gold-leaf)] flex items-center justify-center gap-4">
              <MapIcon className="w-10 h-10" />
              КАРТА КРАСНОЦАРСТВА
            </h2>
          </div> 
          <Map />
        </div>
      </section>
      
      {/* FEATURES SECTION */}
      <section 
        id="features" 
        className="relative py-20 md:py-32 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bg2})` }}
      >
        <div className="absolute inset-0 bg-midnight-ink/90"></div>
        <div className="container relative z-10">
          <h2 className="text-center font-serif text-4xl md:text-5xl xl:text-6xl font-normal mb-12 text-gold-leaf [text-shadow:0_0_12px_var(--gold-leaf)] flex items-center justify-center gap-4">
            <FeaturesIcon className="w-10 h-10" />
            ОСОБЕННОСТИ ИГРЫ
          </h2>
          
          {/* Вставляем наш новый компонент с табами */}
          <FeaturesTabs />

        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-20 md:py-32 bg-midnight-ink">
        <div className="container relative">
          <h2 className="text-center font-serif text-4xl md:text-5xl xl:text-6xl font-normal mb-12 text-gold-leaf [text-shadow:0_0_12px_var(--gold-leaf)] flex items-center justify-center gap-4">
            <GalleryIcon className="w-10 h-10" />
            ГАЛЕРЕЯ
          </h2>

          {/* Контейнер для изображений с прокруткой */}
          <div 
            ref={galleryScrollRef}
            className="flex overflow-x-auto gap-6 pb-4 scroll-smooth no-scrollbar"
            onTouchStart={handleGalleryTouchStart}
            onTouchMove={handleGalleryTouchMove}
            onTouchEnd={handleGalleryTouchEnd}
          >
            {galleryImages.map((image, index) => (
              // 1. Каждое изображение теперь - это кнопка
              <button 
                key={index} 
                onClick={() => setSelectedImage(image)} // 2. По клику - запоминаем картинку
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 rounded-lg overflow-hidden border-2 border-transparent hover:border-gold-leaf transition-all duration-300"
              >
                <div className="aspect-video">
                  <img src={image} alt={`Скриншот галереи ${index + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
              </button>
            ))}
          </div>

          {/* Кнопки-стрелки для галереи остаются без изменений */}
          <button 
            onClick={galleryScrollLeft} 
            className="group absolute top-1/2 -translate-y-1/2 left-[-1.5rem] z-10 p-2 transition-transform duration-300 hover:scale-125 hidden md:block"
            aria-label="Прокрутить галерею влево"
          >
            <ArrowLeftIcon className="w-8 h-8 text-shadow-grey group-hover:text-gold-leaf transition-colors duration-300" />
          </button>
          <button 
            onClick={galleryScrollRight} 
            className="group absolute top-1/2 -translate-y-1/2 right-[-1.5rem] z-10 p-2 transition-transform duration-300 hover:scale-125 hidden md:block"
            aria-label="Прокрутить галерею вправо"
          >
            <ArrowRightIcon className="w-8 h-8 text-shadow-grey group-hover:text-gold-leaf transition-colors duration-300" />
          </button>
        </div>
      </section>

      {/* --- БЛОК ЛАЙТБОКСА ДЛЯ УВЕЛИЧЕННОГО ИЗОБРАЖЕНИЯ --- */}
      {/* Он появится, только если выбрана какая-то картинка */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 lightbox-fade-in"
          onClick={() => setSelectedImage(null)} // Закрыть по клику на фон
        >
          {/* Кнопка "Закрыть" */}
          <button 
            className="absolute top-4 right-4 text-white text-4xl hover:text-gold-leaf transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
          
          {/* Само изображение */}
          <img 
            src={selectedImage} 
            alt="Увеличенный скриншот" 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* QUIZ SECTION */}
      <section
        id="quiz"
        className="relative py-20 md:py-32 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bg4})` }}
      >
        <div className="absolute inset-0 bg-midnight-ink/85"></div>
        <div className="container relative z-10">
          <h2 className="text-center font-serif text-4xl md:text-5xl xl:text-6xl font-normal mb-12 text-gold-leaf [text-shadow:0_0_12px_var(--gold-leaf)] flex items-center justify-center gap-4">
            <QuizIcon className="w-10 h-10" />
            КТО ТЫ ИЗ КРАСНОЦАРСТВА?
          </h2>
          <Quiz />
        </div>
      </section>

      <Separator />

      {/* RELEASE SECTION (бывший DOWNLOAD) */}
      <section 
        id="download" 
        className="relative py-20 md:py-32 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bg3})` }}
      >
        <div className="absolute inset-0 bg-midnight-ink/90"></div>
        <div className="container relative z-10 text-center">
          <h2 className="text-center font-serif text-4xl md:text-5xl xl:text-6xl font-normal mb-6 text-gold-leaf [text-shadow:0_0_12px_var(--gold-leaf)] flex items-center justify-center gap-4">
            <BellIcon className="w-10 h-10" />
            ДЕМО-ВЕРСИЯ ДОСТУПНА!
          </h2>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <p className="text-lg md:text-xl text-off-white/80 leading-relaxed mb-6">
              Познакомиться с миром КрасноЦарства можно уже сейчас — полноценная демо-версия доступна на{' '}
              <a
                href="https://vkplay.ru/play/game/krasnocarstvoexe-45540/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-leaf/90 underline decoration-gold-leaf/40 underline-offset-2 hover:text-gold-leaf hover:decoration-gold-leaf transition-colors"
              >
                VK Play
              </a>
              .
            </p>
            <h3 className="font-serif text-xl md:text-2xl text-gold-leaf mb-4 tracking-tight">
              Что внутри демо
            </h3>
            <ul className="space-y-3.5 text-lg md:text-xl text-off-white/85 leading-snug list-none pl-0">
              <li className="flex gap-3">
                <span className="shrink-0 select-none w-7 text-center" aria-hidden>
                  📖
                </span>
                <span>Первая глава истории — знакомство с героями и миром</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 select-none w-7 text-center" aria-hidden>
                  🧩
                </span>
                <span>Весёлые мини-игры и загадки</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 select-none w-7 text-center" aria-hidden>
                  🔦
                </span>
                <span>
                  Специальный квест «Катакомбы» — если ваш выбор приведёт вас туда
                </span>
              </li>
            </ul>
          </div>

          {/* Информация о датах релизов */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
            {/* Демо-релиз */}
            <a
              href="https://vkplay.ru/play/game/krasnocarstvoexe-45540/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-leaf/10 border border-gold-leaf/30 rounded-xl p-6 transition-transform transform hover:scale-105 hover:bg-gold-leaf/20 cursor-pointer block"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaCalendarAlt className="text-gold-leaf text-2xl" />
                <h3 className="font-serif text-xl text-gold-leaf">Демо-релиз</h3>
              </div>
              <p className="text-off-white/90 text-lg font-semibold">18 декабря 2025</p>
              <p className="text-off-white/70 text-sm mt-2">Полноценная демо-версия игры</p>
            </a>

            {/* Полный релиз */}
            <div className="bg-shadow-grey/20 border border-shadow-grey/50 rounded-xl p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaStar className="text-gold-leaf text-2xl" />
                <h3 className="font-serif text-xl text-gold-leaf">Релиз 1 части</h3>
              </div>
              <p className="text-off-white/90 text-lg font-semibold">Вторая половина 2026</p>
              <p className="text-off-white/70 text-sm mt-2">Релиз 1 главы с сюжетными правками и три дополнительных побочных квеста (Квартал Четырёх Дураков, Катакомбы и Станция дирижаблей)</p>
            </div>
          </div>

          {/* Кнопка VK Play */}
          <div className="max-w-4xl mx-auto bg-shadow-grey/20 border border-shadow-grey/50 rounded-xl p-8 md:p-12 mb-8">
            <div className="text-center">
              <h3 className="font-serif text-2xl text-gold-leaf mb-4">Добавить в избранное</h3>
              <p className="text-off-white/70 mb-6">Идет масштабная работа над проектом! Мир новеллы растет и меняется, поэтому релиз смещён на вторую половину этого года. В первой части вас ждет более детально проработанный лор и система выборов, а также новые увлекательные квесты. Следите за новостями!</p>
              <a 
                href="https://vkplay.ru/play/game/krasnocarstvoexe/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gold-leaf hover:bg-gold-leaf/90 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaHeart className="text-xl" />
                <span>Добавить в избранное на VK Play</span>
                <FaExternalLinkAlt className="text-sm" />
              </a>
            </div>
          </div>

          {/* Социальные сети */}
          <div className="max-w-2xl mx-auto bg-shadow-grey/20 border border-shadow-grey/50 rounded-xl p-6">
            <div className="text-center">
              <h3 className="font-serif text-xl text-gold-leaf mb-4">Следите за новостями</h3>
              <p className="text-off-white/70 mb-4">Присоединяйтесь к нашему сообществу для получения обновлений о релизах.</p>
              <div className="flex items-center justify-center gap-8">
                <a href="https://vk.com/rzhevka_lib" target="_blank" rel="noopener noreferrer" aria-label="Наша группа ВКонтакте" className="text-shadow-grey hover:text-blue-500 transition-all duration-300 transform hover:scale-110">
                  <FaVk className="text-5xl" />
                </a>
                <a href="https://t.me/lib_rzhevka" target="_blank" rel="noopener noreferrer" aria-label="Наш Телеграм канал" className="text-shadow-grey hover:text-sky-500 transition-all duration-300 transform hover:scale-110">
                  <FaTelegram className="text-5xl" />
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* FOOTER */}
      <Footer 
        orgLogos={[
          { 
            id: 'org1', 
            src: orgLogos1, 
            alt: 'ЦБС Красногвардейского района', 
            href: 'https://kr-cbs.ru/' 
          },
          { 
            id: 'org2', 
            src: orgLogos2, 
            alt: 'Библиотека «Ржевская»', 
            href: 'https://kr-cbs.ru/libraries/rzhevskaya' 
          }
        ]}
      />
    </div>
    </>
  );
}

export default App;