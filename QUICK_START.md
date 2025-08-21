# ⚡ Быстрый старт

## 🚀 За 5 минут от клонирования до запуска

### 1. Клонирование
```bash
git clone https://github.com/spallkatrina/krasnotsarstvo-exe-site.git
cd krasnotsarstvo-exe-site
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Запуск
```bash
npm run dev
```

**Готово!** 🎉 Сайт доступен по адресу: http://localhost:5173

## 🔧 Основные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev сервера |
| `npm run build` | Сборка для продакшена |
| `npm run preview` | Предварительный просмотр сборки |
| `npm run lint` | Проверка кода ESLint |
| `npm run type-check` | Проверка типов TypeScript |
| `npm run format` | Форматирование кода Prettier |

## 📁 Структура проекта

```
krasnotsarstvo-exe-site/
├── src/                    # Исходный код
│   ├── components/         # React компоненты
│   ├── assets/            # Изображения, шрифты, видео
│   ├── data/              # Данные (локации, персонажи)
│   └── App.tsx            # Главный компонент
├── public/                 # Статические файлы
├── dist/                   # Сборка (создается автоматически)
└── docs/                   # Документация
```

## 🎨 Кастомизация

### Цвета
Отредактируйте `tailwind.config.js`:
```js
colors: {
  'midnight-ink': '#0A0C1A',    // Основной фон
  'gold-leaf': '#D4AF37',       // Акценты
  'mystic-cyan': '#00F2FF',     // Магические элементы
}
```

### Шрифты
Замените файлы в `src/assets/fonts/` и обновите CSS

### Контент
- Персонажи: `src/data/locations.ts`
- Локации: `src/data/locations.ts`
- Изображения: `src/assets/images/`

## 🚨 Частые проблемы

### Ошибка "Module not found"
```bash
npm install
```

### Ошибка TypeScript
```bash
npm run type-check
```

### Проблемы с Tailwind
```bash
npm run build
```

## 📱 Тестирование

### Браузеры
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Устройства
- ✅ Десктоп
- ✅ Планшет
- ✅ Мобильный

## 🔗 Полезные ссылки

- 📚 [Полная документация](README.md)
- 🚀 [Руководство по развертыванию](DEPLOYMENT.md)
- 🤝 [Как внести вклад](CONTRIBUTING.md)
- 📋 [История изменений](CHANGELOG.md)

---

**Вопросы?** Создайте [Issue](https://github.com/YOUR_USERNAME/krasnotsarstvo-exe-site/issues) или [Discussion](https://github.com/YOUR_USERNAME/krasnotsarstvo-exe-site/discussions) 🚀
