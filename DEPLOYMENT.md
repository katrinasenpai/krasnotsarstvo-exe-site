# 🚀 Руководство по развертыванию

## Текущий production-домен и маршруты Искина

- Основной адрес: `https://krasnotsarstvo.ru`.
- Production QR-код Искина собирается с этим HTTPS-адресом из `.env.production`.
- Сервер должен возвращать `index.html` для `/iskin-projection` и `/iskin-ar`; готовый
  Nginx-пример находится в `deploy/nginx/krasnotsarstvo.ru.conf.example`.
- После обычного `git pull` на сервере выполните `npm ci` и `npm run build`, затем
  обновите содержимое web-root из `dist`. Для AR нужны HTTPS и MIME-типы `.glb`/`.usdz`
  из примера Nginx.

## 📋 Подготовка к развертыванию

### 1. Проверка проекта
```bash
# Убедитесь, что все работает локально
npm run dev          # Запуск dev сервера
npm run build        # Сборка для продакшена
npm run preview      # Предварительный просмотр
npm run lint         # Проверка кода
npm run type-check   # Проверка типов
```

### 2. Обновление конфигурации
Перед развертыванием обновите следующие файлы:

#### package.json
```json
{
  "homepage": "https://krasnotsarstvo.ru/",
  "repository": {
    "url": "https://github.com/katrinasenpai/krasnotsarstvo-exe-site.git"
  }
}
```

#### .github/workflows/deploy.yml
```yaml
cname: yourdomain.com # Замените на ваш домен
```

#### .github/CODEOWNERS
```
* @YOUR_USERNAME
```

## 🌐 GitHub Pages

### Автоматическое развертывание (рекомендуется)

1. **Создайте репозиторий** на GitHub
2. **Загрузите код**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/krasnotsarstvo-exe-site.git
   git push -u origin main
   ```

3. **Настройте GitHub Pages**:
   - Перейдите в Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

4. **GitHub Actions автоматически**:
   - Соберет проект
   - Развернет на GitHub Pages
   - Обновит при каждом push в main

### Ручное развертывание

```bash
# Установите gh-pages
npm install -g gh-pages

# Соберите проект
npm run build

# Разверните
gh-pages -d dist
```

## ☁️ Vercel

### 1. Подключение к Vercel
- Зайдите на [vercel.com](https://vercel.com)
- Подключите GitHub репозиторий
- Vercel автоматически определит настройки

### 2. Настройка (опционально)
Создайте `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Автоматическое развертывание
- Каждый push в main автоматически развертывается
- Preview deployments для Pull Requests

## 🌊 Netlify

### 1. Подключение к Netlify
- Зайдите на [netlify.com](https://netlify.com)
- Подключите GitHub репозиторий
- Настройте:
  - Build command: `npm run build`
  - Publish directory: `dist`

### 2. Настройка (опционально)
Создайте `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Автоматическое развертывание
- Каждый push в main автоматически развертывается
- Preview deployments для Pull Requests

## 🖥️ Статический хостинг

### 1. Сборка проекта
```bash
npm run build
```

### 2. Загрузка файлов
Загрузите содержимое папки `dist` на ваш хостинг:
- FTP/SFTP
- cPanel File Manager
- AWS S3
- Google Cloud Storage

### 3. Настройка сервера
Убедитесь, что сервер настроен для SPA:
- Все маршруты должны вести на `index.html`
- Включите gzip сжатие
- Настройте кэширование статических файлов

## 🔧 Настройка домена

### 1. Пользовательский домен
- Добавьте CNAME запись в DNS
- Укажите на ваш хостинг
- Подождите распространения DNS (до 48 часов)

### 2. HTTPS
- Включите SSL сертификат
- Настройте автоматическое перенаправление с HTTP на HTTPS

### 3. www vs non-www
Выберите один вариант и настройте перенаправление

## 📱 PWA (Progressive Web App)

### 1. Создайте manifest.json
```json
{
  "name": "КрасноЦарство.exe",
  "short_name": "КрасноЦарство",
  "description": "Сайт визуальной новеллы",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0C1A",
  "theme_color": "#D4AF37",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Добавьте Service Worker
Создайте `public/sw.js` для кэширования

## 📊 Аналитика

### 1. Google Analytics
```html
<!-- В index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Yandex Metrika
```html
<!-- В index.html -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(YOUR_COUNTER_ID, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
   });
</script>
```

## 🔍 SEO оптимизация

### 1. Meta теги
```html
<!-- В index.html -->
<meta name="description" content="Официальный сайт визуальной новеллы 'КрасноЦарство.exe'">
<meta name="keywords" content="визуальная новелла, игра, библиотеки, фэнтези">
<meta property="og:title" content="КрасноЦарство.exe">
<meta property="og:description" content="Мистическая визуальная новелла">
<meta property="og:image" content="/og-image.jpg">
```

### 2. Sitemap
Создайте `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## 🚨 Мониторинг

### 1. Uptime мониторинг
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

### 2. Ошибки
- [Sentry](https://sentry.io)
- [LogRocket](https://logrocket.com)

## 📈 Производительность

### 1. Lighthouse
- Запустите Lighthouse в Chrome DevTools
- Цель: 90+ по всем метрикам

### 2. Оптимизация
- Сжатие изображений
- Минификация CSS/JS
- Gzip сжатие
- CDN для статических файлов

## 🔄 Обновления

### 1. Автоматические
- GitHub Actions для GitHub Pages
- Vercel/Netlify для их платформ

### 2. Ручные
```bash
# Обновите код
git pull origin main

# Пересоберите и разверните
npm run build
# Загрузите dist/ на хостинг
```

---

**Удачи с развертыванием!** 🚀
