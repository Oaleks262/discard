# disCard - Loyalty Cards PWA

Сучасний Progressive Web App для управління картами лояльності з підтримкою сканування QR-кодів та штрих-кодів, темної/світлої теми та повної мультимовності (українська/англійська).

![disCard Logo](public/icons/icon-192x192.png)

## ✨ Основні функції

- **🔍 Сканування кодів**: Підтримка QR-кодів та штрих-кодів через камеру
- **💾 Безпечне зберігання**: Зашифровані дані з JWT автентифікацією
- **📱 PWA**: Повна підтримка офлайн режиму та встановлення як додаток
- **🌍 Мультимовність**: Українська та англійська мови
- **🎨 Теми**: Світла та темна теми з автовизначенням системних налаштувань
- **⚡ Швидкодія**: Сучасна архітектура з оптимізацією продуктивності
- **🔒 Безпека**: Rate limiting, валідація даних, CORS захист

## 🚀 Швидкий старт

### Встановлення залежностей

```bash
npm install
```

### Налаштування середовища

1. Скопіюйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Відредагуйте `.env` файл:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/loyalty-cards

# JWT Secrets (генеруйте складні ключі для продакшену)
JWT_SECRET=your-super-secret-jwt-key-here-minimum-64-characters-long
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here-different-from-jwt

# Session
SESSION_SECRET=your-session-secret-here-minimum-64-characters-long

# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
```

### Запуск MongoDB

Переконайтеся, що MongoDB запущена локально або використовуйте MongoDB Atlas:

```bash
# Локально (macOS з Homebrew)
brew services start mongodb-community

# Або використовуйте Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Запуск додатку

```bash
# Розробка
npm run dev

# Продакшен
npm start
```

Додаток буде доступний за адресою `http://localhost:3000`

## 📁 Структура проекту

```
loyalty-cards-app/
├── server.js              # Express сервер
├── package.json           # Залежності та скрипти
├── .env.example          # Шаблон змінних середовища
├── README.md             # Документація
├── public/               # Frontend файли
│   ├── index.html        # Лендінг сторінка
│   ├── app.html          # Основний додаток
│   ├── css/
│   │   ├── landing.css   # Стилі лендінгу
│   │   └── app.css       # Стилі додатку
│   ├── js/
│   │   ├── landing.js    # JavaScript лендінгу
│   │   ├── app.js        # Основна логіка додатку
│   │   └── i18n.js       # Система перекладів
│   ├── icons/            # PWA іконки
│   ├── manifest.json     # PWA маніфест
│   └── sw.js            # Service Worker
```

## 🛠 Технології

### Backend
- **Node.js** + **Express** - веб-сервер
- **MongoDB** + **Mongoose** - база даних
- **JWT** - автентифікація
- **bcryptjs** - хешування паролів
- **Helmet** - безпека заголовків
- **CORS** - крос-доменні запити
- **Express Rate Limit** - захист від spam

### Frontend
- **Vanilla JavaScript** - без фреймворків для швидкодії
- **CSS Grid/Flexbox** - сучасний responsive дизайн
- **Service Worker** - офлайн підтримка
- **Web APIs**: Camera, Clipboard, Notifications
- **QR/Barcode**: jsQR, QRCode.js, JsBarcode

### Бібліотеки для сканування
- **jsQR** - сканування QR-кодів
- **QRCode.js** - генерація QR-кодів
- **JsBarcode** - генерація штрих-кодів

## 🎯 API Ендпоінти

### Автентифікація
```
POST /api/auth/register     # Реєстрація
POST /api/auth/login        # Вхід
GET  /api/auth/me          # Отримати профіль
PUT  /api/auth/profile     # Оновити профіль
PUT  /api/auth/password    # Змінити пароль
```

### Карти лояльності
```
POST   /api/cards          # Додати картку
GET    /api/cards          # Отримати всі карти (включено в /auth/me)
PUT    /api/cards/:id      # Оновити картку
DELETE /api/cards/:id      # Видалити картку
```

## 🌐 Мультимовність

Додаток підтримує дві мови:
- **Українська** (за замовчуванням)
- **English**

Переклади знаходяться в `public/js/i18n.js`. Мова автоматично визначається з:
1. Налаштувань користувача (збережено на сервері)
2. localStorage браузера
3. Системної мови браузера
4. За замовчуванням - українська

## 🎨 Теми

### Світла тема (за замовчуванням)
- Фон: `#FFFFFF`, `#F8F9FA`
- Текст: `#1A1A1A`, `#4A4A4A`
- Акцент: `#0066FF`, `#FF6B6B`

### Темна тема
- Фон: `#0A0A0A`, `#1A1A1A`  
- Текст: `#FFFFFF`, `#B0B0B0`
- Акцент: `#3D8BFF`, `#FF8A8A`

Тема автоматично визначається з системних налаштувань або може бути змінена вручну.

## 📱 PWA Функції

- ✅ **Офлайн підтримка** - працює без інтернету
- ✅ **Встановлення** - може бути встановлений як нативний додаток
- ✅ **Background Sync** - синхронізація даних у фоні
- ✅ **Push уведомлення** - сповіщення про оновлення
- ✅ **Кешування** - швидкий доступ до даних
- ✅ **Shortcuts** - швидкі дії з домашнього екрану

## 🔒 Безпека

- **JWT токени** з коротким часом життя
- **Bcrypt** хешування паролів (12 rounds)
- **Rate limiting** на всіх ендпоінтах
- **CORS** налаштування
- **Helmet** для безпеки заголовків
- **Input validation** та санітизація
- **HTTPS** у продакшені

## 🚀 Деплой

### Docker (рекомендується)

```bash
# Створити Docker образ
docker build -t discard .

# Запустити з MongoDB
docker-compose up -d
```

### PM2 (Node.js процес менеджер)

```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

### Nginx конфігурація

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🧪 Тестування

```bash
# Запуск тестів (коли будуть додані)
npm test

# Лінтинг коду
npm run lint

# Перевірка безпеки
npm audit
```

## 📊 Продуктивність

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)

## 🤝 Внесок у проект

1. Fork проект
2. Створіть feature branch (`git checkout -b feature/amazing-feature`)
3. Commit зміни (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Створіть Pull Request

## 📝 Ліцензія

Цей проект ліцензовано під MIT License - дивіться файл [LICENSE](LICENSE) для деталей.

## 🆘 Підтримка

Якщо у вас є питання або проблеми:

1. Перевірте [Issues](https://github.com/your-repo/discard/issues)
2. Створіть новий Issue з деталями проблеми
3. Надайте інформацію про версію браузера/ОС

## 🎯 Дорожня карта

### v1.1.0
- [ ] Категорії карток
- [ ] Експорт/імпорт даних
- [ ] Поділитися картками
- [ ] Статистика використання

### v1.2.0  
- [ ] Біометрична автентифікація
- [ ] Геолокація магазинів
- [ ] Інтеграція з популярними магазинами
- [ ] Нагадування про акції

### v2.0.0
- [ ] Реліз мобільного додатку
- [ ] Apple Wallet / Google Pay інтеграція
- [ ] Спільні сімейні акаунти
- [ ] AI рекомендації

## 🏆 Особливості реалізації

### Sharp/Angular Design
Дизайн побудований на принципах sharp/angular дизайну:
- Мінімальні border-radius (4px-12px max)
- Чіткі геометричні форми
- Контрастні кольори
- Монохромні іконки

### Оптимізація продуктивності
- Code splitting та lazy loading
- Service Worker кешування  
- Оптимізовані зображення
- Мінімізований CSS/JS
- CDN для статичних ресурсів

### Доступність (a11y)
- ARIA атрибути
- Keyboard navigation
- Screen reader підтримка
- High contrast режим
- Focus indicators

## 📱 Сумісність

### Браузери
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Мобільні платформи  
- iOS 13+
- Android 8+

### Desktop
- Windows 10+
- macOS 10.15+
- Linux (Ubuntu 18+)

---

**disCard** - зроблено з ❤️ для зручного управління картами лояльності