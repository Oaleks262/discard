# Налаштування Адмін-панелі та Нових Функцій

## 🚀 Швидкий старт

### 1. Створення першого адміністратора

```bash
node init-admin.js
```

Введіть дані адміна (ім'я, email, пароль). Скрипт створить superadmin акаунт у базі даних.

### 2. Запуск сервера

```bash
npm start
# або для розробки
npm run dev
```

### 3. Вхід в адмін-панель

Відкрийте: `http://localhost:2804/admin/login.html`

Введіть email та пароль створеного адміна.

---

## 📁 Що було додано

### Backend (server/)

```
server/
├── models/
│   ├── Admin.js              # Модель адміністратора
│   ├── BlogPost.js           # Модель статті блогу
│   ├── FAQ.js                # Модель FAQ
│   ├── Settings.js           # Модель налаштувань сайту
│   └── ContactMessage.js     # Модель контактних повідомлень
├── controllers/
│   ├── authController.js     # Логіка автентифікації адміна
│   ├── adminController.js    # Логіка адмін панелі
│   ├── blogController.js     # Логіка блогу
│   ├── faqController.js      # Логіка FAQ
│   ├── settingsController.js # Логіка налаштувань
│   └── contactController.js  # Логіка контактної форми
├── routes/
│   ├── authRoutes.js         # API маршрути автентифікації
│   ├── adminRoutes.js        # API маршрути адмін панелі
│   ├── blogRoutes.js         # API маршрути блогу
│   ├── faqRoutes.js          # API маршрути FAQ
│   ├── settingsRoutes.js     # API маршрути налаштувань
│   └── contactRoutes.js      # API маршрути контактів
└── middleware/
    ├── authMiddleware.js     # Перевірка JWT токена
    └── adminMiddleware.js    # Перевірка прав адміністратора
```

### Frontend - Адмін-панель (public/admin/)

```
public/admin/
├── css/
│   └── admin.css             # Стилі адмін панелі (з підтримкою тем)
├── js/
│   ├── auth.js               # Автентифікація та theme manager
│   ├── dashboard.js          # Логіка дашборду з графіками
│   ├── users.js              # Управління користувачами
│   └── settings.js           # Управління налаштуваннями
├── login.html                # Сторінка логіну
├── dashboard.html            # Дашборд зі статистикою
├── users.html                # Управління користувачами
└── settings.html             # Налаштування сайту
```

### Frontend - Публічні сторінки (public/)

```
public/
├── faq.html                  # Сторінка FAQ з пошуком
└── contact.html              # Контактна форма
```

---

## 🎨 Особливості реалізації

### ✅ Дотримання стилю проєкту

- Використані **точно ті ж кольори**:
  - Primary: `#0066FF`
  - Secondary: `#FF6B6B`
  - Success: `#10B981`
  - Error: `#EF4444`

- Дотримано **Sharp/Angular дизайн**:
  - Border-radius: `4px-12px` (не більше)
  - Чіткі геометричні форми
  - Мінімалістичний підхід

- **Підтримка тем (Light/Dark)**:
  - Всі нові сторінки підтримують існуючу систему тем
  - Використано `ThemeManager` клас
  - CSS змінні для автоматичної зміни кольорів

### 🔒 Безпека

- JWT токени з автентифікацією
- Bcrypt хешування паролів (12 rounds)
- Middleware для перевірки прав доступу
- Rate limiting на всіх endpoints
- Валідація даних

---

## 📊 API Endpoints

### Адмін Автентифікація

```
POST   /api/admin/auth/login       # Логін адміна
GET    /api/admin/auth/verify      # Верифікація токена
POST   /api/admin/auth/logout      # Вихід
```

### Адмін Dashboard

```
GET    /api/admin/dashboard/stats  # Статистика для дашборду
GET    /api/admin/users             # Список користувачів
GET    /api/admin/users/:id         # Деталі користувача
DELETE /api/admin/users/:id         # Видалення користувача
```

### Блог (публічні + адмін)

```
# Публічні
GET    /api/blog                    # Список статей
GET    /api/blog/:slug              # Стаття за slug

# Адмін
GET    /api/blog/admin/posts        # Всі статті (включно з чернетками)
GET    /api/blog/admin/posts/:id    # Стаття за ID
POST   /api/blog/admin/posts        # Створити статтю
PUT    /api/blog/admin/posts/:id    # Оновити статтю
DELETE /api/blog/admin/posts/:id    # Видалити статтю
```

### FAQ (публічні + адмін)

```
# Публічні
GET    /api/faq                     # Список активних FAQ

# Адмін
GET    /api/faq/admin               # Всі FAQ
POST   /api/faq/admin               # Створити FAQ
PUT    /api/faq/admin/:id           # Оновити FAQ
DELETE /api/faq/admin/:id           # Видалити FAQ
PUT    /api/faq/admin/reorder       # Змінити порядок
```

### Налаштування

```
GET    /api/settings/public         # Публічні налаштування
GET    /api/settings/admin          # Всі налаштування (адмін)
PUT    /api/settings/admin          # Оновити налаштування (адмін)
```

### Контакти

```
POST   /api/contact                 # Відправити повідомлення
GET    /api/contact/admin           # Всі повідомлення (адмін)
PUT    /api/contact/admin/:id/status # Оновити статус (адмін)
DELETE /api/contact/admin/:id       # Видалити повідомлення (адмін)
```

---

## ⚠️ Важливо

### Існуючий додаток НЕ ПОШКОДЖЕНО

- Всі існуючі API endpoints для користувачів залишились без змін
- Існуючі файли (`app.html`, `index.html`, моделі User/Card) не змінені
- Нові routes додані окремо та не конфліктують з існуючими
- Використовується та ж база даних MongoDB

### Перша авторизація

1. Запустіть `node init-admin.js`
2. Створіть першого адміна
3. Увійдіть на `/admin/login.html`

---

## 🎯 Наступні кроки (TODO)

Що ще можна додати:

1. **Управління блогом в адмін-панелі**
   - Створення/редагування статей з WYSIWYG редактором
   - Завантаження зображень

2. **Управління FAQ в адмін-панелі**
   - Додавання/редагування питань
   - Drag-and-drop для зміни порядку

3. **Сторінка блогу**
   - `/blog.html` - список статей
   - `/blog/:slug` - окрема стаття

4. **Google AdSense інтеграція**
   - Компонент для рекламних блоків
   - Управління через налаштування

5. **Google Analytics**
   - Додати відстеження подій

6. **SEO оптимізація**
   - Динамічний sitemap.xml
   - Schema.org markup

7. **Cookie banner (GDPR)**

---

## 📝 Примітки

- Всі паролі хешуються за допомогою bcrypt (12 rounds)
- JWT токени дійсні 7 днів (можна змінити в `.env`)
- Адмін панель повністю responsive (працює на мобільних)
- Підтримка light/dark теми синхронізована з основним додатком

## 🆘 Підтримка

Якщо виникли питання:
1. Перевірте, чи запущена MongoDB
2. Перевірте `.env` файл (повинен містити JWT_SECRET)
3. Перевірте консоль браузера на помилки
