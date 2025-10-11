// src/components/Navbar.tsx

import React, { useState } from 'react';
import LogoIcon from '../assets/icons/logo.svg?react';

// Определяем типы для наших данных, чтобы всё было строго
type NavLink = {
  href: string;
  IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
};

type NavbarProps = {
  navLinks: NavLink[];
};

export function Navbar({ navLinks }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    // Закрываем мобильное меню после клика
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('home')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    // Закрываем мобильное меню после клика
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Десктопная навигация - скрыта на мобильных */}
      <nav className="hidden md:flex fixed top-0 left-0 h-full w-20 bg-midnight-ink/80 backdrop-blur-lg border-r border-shadow-grey/20 flex-col items-center z-50">
        {/* Логотип */}
        <div className="mt-8 mb-16">
          <a 
            href="#home" 
            onClick={handleLogoClick}
            className="group block p-2 rounded-lg hover:bg-gold-leaf/10 transition-all duration-300 transform hover:scale-110"
            aria-label="Главная страница"
          >
            <LogoIcon className="w-10 h-10 text-gold-leaf group-hover:logo-glow transition-all duration-300" />
          </a>
        </div>
        
        <ul className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href} className="navbar-item group">
              <a 
                href={`#${link.href}`} 
                onClick={(e) => handleScroll(e, link.href)}
                className="nav-link text-shadow-grey hover:text-gold-leaf transition-colors duration-300"
                aria-label={link.label}
              >
                <link.IconComponent className="w-8 h-8" />
              </a>
              <span className="navbar-tooltip group-hover:scale-100">
                {link.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Мобильная навигация */}
      <div className="md:hidden">
        {/* Гамбургер кнопка */}
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-2 bg-midnight-ink/80 backdrop-blur-lg border border-shadow-grey/20 rounded-lg text-gold-leaf hover:bg-shadow-grey/20 transition-colors"
          aria-label="Открыть меню"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </div>
        </button>

        {/* Выдвижное боковое меню */}
        <div className={`fixed top-0 left-0 h-full w-80 bg-midnight-ink/95 backdrop-blur-lg border-r border-shadow-grey/20 transform transition-transform duration-300 z-40 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Заголовок с логотипом и кнопкой закрытия */}
            <div className="p-6 border-b border-shadow-grey/20 relative">
              <div className="flex items-center gap-3 mb-4">
                <a 
                  href="#home" 
                  onClick={handleLogoClick}
                  className="group block p-1 rounded-lg hover:bg-gold-leaf/10 transition-all duration-300 transform hover:scale-110"
                  aria-label="Главная страница"
                >
                  <LogoIcon className="w-8 h-8 text-gold-leaf group-hover:logo-glow transition-all duration-300" />
                </a>
                <h2 className="text-gold-leaf font-serif text-xl">Навигация</h2>
              </div>
              {/* Кнопка закрытия в правом верхнем углу */}
              <button
                onClick={toggleMobileMenu}
                className="absolute top-4 right-4 p-2 text-gold-leaf hover:bg-gold-leaf/10 rounded-lg transition-colors"
                aria-label="Закрыть меню"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Список ссылок */}
            <ul className="flex-1 py-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={`#${link.href}`} 
                    onClick={(e) => handleScroll(e, link.href)}
                    className="flex items-center gap-4 px-6 py-4 text-shadow-grey hover:text-gold-leaf hover:bg-shadow-grey/20 transition-colors duration-300"
                  >
                    <link.IconComponent className="w-6 h-6" />
                    <span className="text-lg">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Затемняющий фон */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
}