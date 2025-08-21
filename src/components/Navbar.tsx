// src/components/Navbar.tsx

import React from 'react';

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
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <nav className="fixed top-0 left-0 h-full w-20 bg-midnight-ink/80 backdrop-blur-lg border-r border-shadow-grey/20 flex flex-col items-center justify-center z-50">
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
  );
}