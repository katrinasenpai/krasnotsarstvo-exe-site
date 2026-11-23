export const siteOrigin = 'https://krasnotsarstvo.ru';
export const pages = [
  { path: '/', title: 'КрасноЦарство.exe | Фэнтезийная визуальная новелла о Петербурге',
    description: 'В библиотеке «Ржевская» открывается путь в параллельную реальность Красногвардейского района. Исследуйте карту двух миров и сыграйте в демо на VK Play.', image: '/social/library.jpg' },
  { path: '/iskin-ar/', title: 'Искин в дополненной реальности | КрасноЦарство.exe',
    description: 'Вызовите Искина через камеру телефона. Проводник КрасноЦарства листает виртуальную книгу, убирает её и поправляет монокль.', image: '/social/iskin.jpg' },
  { path: '/book-oracle/', title: 'Хронокарты и шатёр гадалки | КрасноЦарство.exe',
    description: 'Вытяните три хронокарты о прошлом, настоящем и будущем. В шатре КрасноЦарства гадалка подберёт книгу по одной из ваших карт.', image: '/social/tent.jpg' },
];

export function pageFor(pathname: string) {
  const route = pathname.replace(/^\/+|\/+$/g, '');
  if (route === 'iskin-projection') return pages[1];
  return pages.find(page => page.path === `/${route}/`) ?? pages[0];
}

export function pageTags(page: typeof pages[number]) {
  return {
    description: page.description, 'og:type': 'website', 'og:locale': 'ru_RU',
    'og:site_name': 'КрасноЦарство.exe', 'og:url': siteOrigin + page.path,
    'og:title': page.title, 'og:description': page.description, 'og:image': siteOrigin + page.image,
    'twitter:card': 'summary_large_image', 'twitter:title': page.title,
    'twitter:description': page.description, 'twitter:image': siteOrigin + page.image,
  };
}
