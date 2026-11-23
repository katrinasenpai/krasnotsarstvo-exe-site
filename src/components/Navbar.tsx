// src/components/Navbar.tsx

import React, { useEffect, useRef, useState } from 'react';
import LogoIcon from '../assets/icons/logo.svg?react';
import './Navbar.css';
import { Camera } from 'lucide-react';

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
  const opener = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const panel = drawer.current;
    const items = Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button') ?? []);
    panel?.querySelector('button')?.focus({preventScroll:true});
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = () => setIsMobileMenuOpen(false);
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key !== 'Tab' || items.length === 0) return;
      const first = items[0], last = items[items.length-1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const desktop = window.matchMedia('(min-width: 768px)');
    desktop.addEventListener('change',close);
    document.addEventListener('keydown',keyboard);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown',keyboard);
      desktop.removeEventListener('change',close);
      opener.current?.focus({preventScroll:true});
    };
  }, [isMobileMenuOpen]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'instant',
      block: 'start',
    });
    // Закрываем мобильное меню после клика
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('home')?.scrollIntoView({
      behavior: 'instant',
      block: 'start',
    });
    // Закрываем мобильное меню после клика
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isPageRoute = (href: string) => href.startsWith('/');

  const closeMobileMenuForRoute = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Десктопная навигация - скрыта на мобильных */}
      <nav aria-label="Основное меню" className="site-navbar hidden md:flex fixed top-0 left-0 h-full w-20 bg-midnight-ink/80 backdrop-blur-lg border-r border-shadow-grey/20 flex-col items-center z-50">
        {/* Логотип */}
        <div className="site-navbar__logo">
          <a 
            href="#home" 
            onClick={handleLogoClick}
            className="group block p-2 rounded-lg hover:bg-gold-leaf/10 transition-all duration-300 transform hover:scale-110"
            aria-label="Главная страница"
          >
            <LogoIcon className="w-10 h-10 text-gold-leaf group-hover:logo-glow transition-all duration-300" />
          </a>
        </div>
        
        <ul className="site-navbar__links flex flex-col items-center">
          {navLinks.map((link) => (
            <li key={link.href} className="navbar-item group">
              <a 
                href={isPageRoute(link.href) ? link.href : `#${link.href}`}
                onClick={isPageRoute(link.href) ? closeMobileMenuForRoute : (e) => handleScroll(e, link.href)}
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
        <a className="mobile-ar-entry" href="/iskin-ar/"><Camera size={19} aria-hidden="true" /> Искин в AR</a>
        {/* Логотип для открытия меню */}
        <button
          onClick={toggleMobileMenu}
          ref={opener}
          className="mobile-menu-trigger group"
          aria-label={isMobileMenuOpen ? 'Свернуть меню' : 'Открыть меню'}
          hidden={isMobileMenuOpen}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          <LogoIcon className="w-8 h-8 text-gold-leaf group-hover:logo-glow transition-all duration-300" />
        </button>

        {/* Выдвижное боковое меню */}
        <nav ref={drawer} id="mobile-navigation" aria-label="Мобильное меню" aria-hidden={!isMobileMenuOpen} className={`mobile-glass-menu fixed transform transition-transform duration-300 z-40 ${isMobileMenuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Заголовок с логотипом и кнопкой закрытия */}
            <div className="p-6 border-b border-shadow-grey/20 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
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
                {/* Красивая кнопка закрытия справа */}
                <button
                  onClick={toggleMobileMenu}
                  className="group p-2 rounded-lg hover:bg-gold-leaf/10 transition-all duration-300 transform hover:scale-110"
                  aria-label="Закрыть меню"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <span className="block w-5 h-0.5 bg-gold-leaf transition-all duration-300 group-hover:bg-gold-leaf/80 rotate-45"></span>
                    <span className="block w-5 h-0.5 bg-gold-leaf transition-all duration-300 group-hover:bg-gold-leaf/80 -rotate-45 -ml-5"></span>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Список ссылок */}
            <ul className="flex-1 min-h-0 overflow-y-auto py-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={isPageRoute(link.href) ? link.href : `#${link.href}`}
                    onClick={isPageRoute(link.href) ? closeMobileMenuForRoute : (e) => handleScroll(e, link.href)}
                    className="flex items-center gap-4 px-6 py-4 text-shadow-grey hover:text-gold-leaf hover:bg-shadow-grey/20 transition-colors duration-300"
                  >
                    <link.IconComponent className="w-6 h-6" />
                    <span className="text-lg">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Затемняющий фон */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/25 z-[36]"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
}
