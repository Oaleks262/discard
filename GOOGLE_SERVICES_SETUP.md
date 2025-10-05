# Налаштування Google сервісів

## Google Analytics (GA4)

### 1. Створення Google Analytics акаунту

1. Перейдіть на https://analytics.google.com/
2. Натисніть "Почати вимірювання"
3. Створіть акаунт та властивість (property)
4. Оберіть "Web" як платформу
5. Скопіюйте **Measurement ID** (формат: G-XXXXXXXXXX)

### 2. Налаштування в disCard

1. Увійдіть в адмін-панель: `/admin/login.html`
2. Перейдіть в **Налаштування** → **Google Analytics**
3. Увімкніть Google Analytics
4. Вставте ваш Measurement ID
5. Збережіть налаштування

### 3. Що відстежується

Analytics автоматично відстежує:
- Перегляди сторінок
- Події додавання карток
- Сканування QR/штрих-кодів
- Зміну теми
- Кліки по кнопках
- Помилки

---

## Google AdSense

### 1. Реєстрація в AdSense

1. Перейдіть на https://www.google.com/adsense/
2. Зареєструйте свій сайт
3. Дочекайтеся схвалення (1-2 дні)
4. Скопіюйте **Publisher ID** (формат: ca-pub-XXXXXXXXXXXXXXXX)

### 2. Налаштування в disCard

1. Увійдіть в адмін-панель: `/admin/login.html`
2. Перейдіть в **Налаштування** → **Google AdSense**
3. Увімкніть Google AdSense
4. Вставте ваш Publisher ID
5. Увімкніть Auto Ads (опціонально)
6. Збережіть налаштування

### 3. Розміщення реклами

#### Автоматично (Auto Ads)
Увімкніть опцію "Auto Ads" в налаштуваннях - Google сам вибере місця для реклами.

#### Вручну
Додайте рекламу програмно:

```javascript
// Display Ad
window.adsense.insertDisplayAd('element-id');

// In-Article Ad (в статтях блогу)
window.adsense.insertInArticleAd('element-id');

// In-Feed Ad (в списку статей)
window.adsense.insertInFeedAd('element-id');
```

**Примітка**: Реклама вже інтегрована в:
- Сторінки статей блогу (`blog-post.html`)
- Можна додати в інші місця за потреби

---

## Cookie Banner (GDPR Compliance)

Cookie banner автоматично з'являється при першому відвідуванні сайту.

### Як це працює

1. **Перше відвідування**: Показується банер з проханням прийняти cookies
2. **Прийняти**: Увімкнуються Analytics та AdSense
3. **Відхилити**: Трекери не завантажуються

### Налаштування

Cookie banner не потребує додаткового налаштування. Він автоматично:
- Зберігає вибір користувача на 365 днів
- Відповідає вимогам GDPR
- Адаптується під тему (світла/темна)

---

## SEO Оптимізація

### Динамічний Sitemap

Доступний за адресою: `/sitemap.xml`

Автоматично включає:
- Всі статичні сторінки
- Опубліковані статті блогу
- Дати останніх змін

### Robots.txt

Доступний за адресою: `/robots.txt`

Автоматично налаштований для:
- Дозволу індексації публічних сторінок
- Заборони індексації адмін-панелі
- Посилання на sitemap

### Schema.org Markup

#### FAQ Page
Автоматично додається на `/faq.html`:
- Тип: FAQPage
- Включає всі активні питання та відповіді

#### Blog Posts
Автоматично додається на кожну статтю блогу:
- Тип: BlogPosting
- Включає заголовок, опис, автора, дати

---

## Перевірка роботи

### Google Analytics

1. Відкрийте сайт у новій вкладці
2. Перейдіть на https://analytics.google.com/
3. Відкрийте **Realtime** → Ви повинні побачити активного користувача

### Google AdSense

1. Дочекайтеся схвалення від Google (може зайняти до 48 годин)
2. Після схвалення реклама з'явиться автоматично
3. Перевірте в консолі браузера на помилки AdSense

### Schema.org

1. Відкрийте https://search.google.com/test/rich-results
2. Вставте URL вашої сторінки (FAQ або блог)
3. Перевірте валідність structured data

### Cookie Banner

1. Відкрийте сайт в режимі інкогніто
2. Банер повинен з'явитися через 1 секунду
3. Натисніть "Прийняти" або "Відхилити"
4. Перевірте що вибір зберігся (оновіть сторінку - банер не з'явиться)

---

## Доступні JS API

### Analytics

```javascript
// Відстежити подію
window.analytics.trackEvent('event_name', { param: 'value' });

// Відстежити перегляд сторінки
window.analytics.trackPageView('/path', 'Page Title');

// Відстежити клік
window.analytics.trackButtonClick('Button Name', 'category');

// Відстежити додавання картки
window.analytics.trackCardAdded('loyalty_card');

// Відстежити сканування
window.analytics.trackScan('qr'); // або 'barcode'

// Відстежити зміну теми
window.analytics.trackThemeChange('dark'); // або 'light'

// Відстежити помилку
window.analytics.trackError('Error message', 'location');
```

### AdSense

```javascript
// Вставити рекламу
window.adsense.insertAd('element-id', {
  slot: 'ad-slot-id',
  format: 'auto',
  responsive: true
});

// Display Ad
window.adsense.insertDisplayAd('element-id');

// In-Article Ad
window.adsense.insertInArticleAd('element-id');

// In-Feed Ad
window.adsense.insertInFeedAd('element-id');
```

---

## Troubleshooting

### Analytics не працює

1. Перевірте що Measurement ID вірний
2. Перевірте що Cookie Banner прийнято
3. Перегляньте консоль браузера на помилки
4. Перевірте що не ввімкнено AdBlock

### AdSense не показує рекламу

1. Дочекайтеся схвалення акаунту Google AdSense
2. Перевірте що Publisher ID вірний
3. Перевірте що Cookie Banner прийнято
4. Деяким блокам реклами потрібен час (до 10 хвилин)
5. Перевірте що на сторінці достатньо контенту

### Cookie Banner не з'являється

1. Очистіть cookies сайту
2. Відкрийте сторінку в режимі інкогніто
3. Перевірте консоль браузера на помилки

---

## Важливо

⚠️ **GDPR Compliance**: Переконайтеся що:
- У вас є політика конфіденційності
- Cookie banner працює коректно
- Користувачі можуть відмовитися від tracking

⚠️ **AdSense Policy**: Дотримуйтеся правил Google AdSense:
- Не клікайте на власну рекламу
- Не стимулюйте кліки
- Не розміщуйте рекламу на неприйнятному контенті
