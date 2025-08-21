# 🤝 Руководство по разработке

Этот проект разрабатывается командой ЦБС Красногвардейского района. Данное руководство предназначено для членов команды. 

## 🚀 Как начать

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/spellkatrina/krasnotsarstvo-exe-site.git
cd krasnotsarstvo-exe-site
```

### 2. Убедитесь, что у вас есть права на запись
Обратитесь к администратору проекта для получения доступа.

### 4. Создайте ветку для новой функции
```bash
git checkout -b feature/your-feature-name
```

## 📝 Процесс разработки

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Проверка кода
```bash
npm run lint
npm run type-check
```

### Форматирование кода
```bash
npm run format
```

## 🎯 Основные задачи команды

- 🐛 Исправление багов
- ✨ Новые функции
- 📱 Улучшение адаптивности
- 🎨 Улучшение UI/UX
- 📚 Документация
- 🧪 Тесты
- 🚀 Производительность

## 📋 Создание Pull Request

### 1. Убедитесь, что код работает
```bash
npm run build
npm run preview
```

### 2. Зафиксируйте изменения
```bash
git add .
git commit -m "feat: добавлена новая функция X"
```

### 3. Отправьте изменения
```bash
git push origin feature/your-feature-name
```

### 4. Создайте Pull Request
Перейдите на GitHub и создайте Pull Request с описанием изменений.

## 📝 Правила коммитов

Используйте [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - новая функция
- `fix:` - исправление бага
- `docs:` - изменения в документации
- `style:` - форматирование кода
- `refactor:` - рефакторинг
- `test:` - добавление тестов
- `chore:` - обновление зависимостей

## 🔧 Настройка окружения

### Требования
- Node.js 18+
- npm или yarn

### Рекомендуемые инструменты
- VS Code с расширениями:
  - ESLint
  - Prettier
  - TypeScript Importer
  - Tailwind CSS IntelliSense

## 📞 Получение помощи

Если у вас есть вопросы:
1. Проверьте [Issues](https://github.com/spellkatrina/krasnotsarstvo-exe-site/issues)
2. Создайте новый Issue
3. Обратитесь к команде разработки

## 🎉 Спасибо!

Ваша работа помогает создать качественный сайт для визуальной новеллы "КрасноЦарство.exe"!
