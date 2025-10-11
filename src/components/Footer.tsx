// src/components/Footer.tsx

import React from 'react';

type OrgLogo = {
  id: string;
  src: string; // относительный путь к изображению (svg/png/webp)
  alt: string;
  href?: string; // опциональная ссылка на сайт организации
};

type FooterProps = {
  orgLogos?: OrgLogo[];
};

export function Footer({ orgLogos = [] }: FooterProps) {
  const navSections = [
    { href: '#home', label: 'Главная' },
    { href: '#story', label: 'Об игре' },
    { href: '#teaser', label: 'Трейлер' },
    { href: '#characters', label: 'Персонажи' },
    { href: '#map', label: 'Карта' },
    { href: '#features', label: 'Особенности' },
    { href: '#gallery', label: 'Галерея' },
    { href: '#download', label: 'Скоро релиз' },
  ];

  return (
    <footer className="mt-0 border-t border-shadow-grey/20 bg-midnight-ink">
      <div className="container py-10 md:py-14 grid gap-10 md:gap-12 md:grid-cols-3">
        {/* Блок контактов библиотеки */}
        <div>
          <h3 className="font-serif text-2xl text-gold-leaf mb-4">Библиотека «Ржевская»</h3>
          <address className="not-italic text-off-white/80 space-y-2">
            <p>Индустриальный проспект, 35к1, Санкт-Петербург</p>
            <p>
              <a href="https://kr-cbs.ru/libraries/rzhevskaya" target="_blank" rel="noopener noreferrer" className="text-gold-leaf hover:text-gold-leaf/80 transition-colors">
                kr-cbs.ru/libraries/rzhevskaya
              </a>
            </p>
            <p>
              <a href="mailto:brzh@kr-cbs.ru" className="text-gold-leaf hover:text-gold-leaf/80 transition-colors">brzh@kr-cbs.ru</a>
            </p>
          </address>
        </div>

        {/* Блок навигации по разделам */}
        <nav>
          <h3 className="font-serif text-2xl text-gold-leaf mb-4">Разделы сайта</h3>
          <ul className="grid grid-cols-2 gap-3 text-off-white/80">
            {navSections.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="hover:text-gold-leaf transition-colors">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Блок логотипов организаций */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-2xl text-gold-leaf">Партнёры и организации</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 items-center">
            {orgLogos.length === 0 ? (
              <p className="col-span-2 text-off-white/50">Добавьте логотипы организаций в props, чтобы отобразить их здесь.</p>
            ) : (
              orgLogos.map((logo) => (
                <div key={logo.id} className="flex items-center justify-center p-4 bg-shadow-grey/10 rounded-md border border-shadow-grey/20 h-20">
                  {logo.href ? (
                    <a href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.alt} className="w-full h-full flex items-center justify-center">
                      <img src={logo.src} alt={logo.alt} className="max-h-12 max-w-full object-contain" />
                    </a>
                  ) : (
                    <img src={logo.src} alt={logo.alt} className="max-h-12 max-w-full object-contain" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Нижняя плашка копирайта */}
      <div className="border-t border-shadow-grey/20 py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-shadow-grey">
          <p className="text-sm">© {new Date().getFullYear()} КрасноЦарство.exe. ЦБС Красногвардейского района.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="https://vk.com/rzhevka_lib" target="_blank" rel="noopener noreferrer" className="hover:text-gold-leaf transition-colors" aria-label="ВКонтакте">
              <i className="fab fa-vk"></i>
            </a>
            <a href="https://t.me/lib_rzhevka" target="_blank" rel="noopener noreferrer" className="hover:text-gold-leaf transition-colors" aria-label="Telegram">
              <i className="fab fa-telegram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


