// Internationalization (i18n) Module

const translations = {
  uk: {
    // Navigation
    nav: {
      home: "Головна",
      blog: "Блог",
      faq: "FAQ",
      contact: "Контакти",
      app: "Відкрити додаток"
    },
    // Landing Page
    heroTitle: "Всі карти лояльності в одному місці",
    heroSubtitle: "Скануй, зберігай та використовуй картки магазинів у зручному PWA додатку",
    features: {
      scan: "Сканування камерою",
      scanDescription: "Легко додавайте нові карти простим скануванням штрих-коду або QR-коду",
      store: "Безпечне зберігання",
      storeDescription: "Ваші карти зберігаються в зашифрованому вигляді з доступом лише для вас",
      access: "Швидкий доступ",
      accessDescription: "Миттєвий доступ до всіх ваших карт навіть офлайн завдяки PWA технології"
    },
    cta: "Спробувати безкоштовно",
    screenshots: {
      title: "Простий у використанні інтерфейс",
      allCards: "Всі карти в одному місці",
      easyScanning: "Легке сканування",
      personalization: "Персоналізація"
    },
    mockupCards: {
      tabs: {
        cards: "📱 Карти",
        add: "➕ Додати", 
        settings: "⚙️ Налаштування"
      },
      stores: {
        atb: "АТБ",
        silpo: "Сільпо",
        eva: "EVA"
      },
      scanner: {
        instruction: "Наведіть камеру на штрих-код або QR-код"
      },
      settings: {
        darkTheme: "🌙 Темна тема",
        language: "🌍 Мова: Українська"
      }
    },
    installation: {
      title: "Як встановити додаток на телефон",
      android: {
        step1: {
          title: "Відкрийте додаток у браузері",
          desc: "Перейдіть на сайт через Chrome або будь-який інший браузер"
        },
        step2: {
          title: "Знайдіть меню браузера",
          desc: "Натисніть на три крапки (<img src='/icons/share-android.png' alt='меню' style='display:inline; width:16px; height:16px; vertical-align:middle;'>) у верхньому правому куті браузера"
        },
        step3: {
          title: "Виберіть \"Додати на головний екран\"",
          desc: "Або \"Install app\" / \"Встановити додаток\" залежно від браузера"
        },
        step4: {
          title: "Підтвердіть встановлення",
          desc: "Натисніть \"Додати\" і додаток з'явиться на головному екрані"
        }
      },
      ios: {
        step1: {
          title: "Відкрийте Safari",
          desc: "Важливо використовувати саме Safari браузер на iOS пристроях"
        },
        step2: {
          title: "Перейдіть на сайт",
          desc: "Введіть адресу сайту в адресний рядок Safari"
        },
        step3: {
          title: "Натисніть кнопку \"Поділитися\"",
          desc: "Знайдіть значок поділитися (<img src='/icons/share-apple.png' alt='поділитися' style='display:inline; width:16px; height:16px; vertical-align:middle;'>) внизу екрану Safari"
        },
        step4: {
          title: "Виберіть \"На головний екран\"",
          desc: "Прокрутіть вниз і знайдіть опцію \"На головний екран\" або \"Add to Home Screen\""
        },
        step5: {
          title: "Додайте додаток",
          desc: "Натисніть \"Додати\" і піктограма з'явиться на домашньому екрані"
        }
      },
      note: {
        title: "Чому це працює без App Store/Play market?",
        desc: "disCard - це PWA (Progressive Web App), сучасна технологія, що дозволяє веб-додаткам працювати як нативні програми з офлайн доступом і push-сповіщеннями."
      }
    },
    footer: {
      description: "Сучасний додаток для управління картами лояльності",
      rights: "Всі права захищені.",
      features: {
        title: "Особливості",
        pwa: "PWA додаток",
        offline: "Робота офлайн",
        secure: "Безпечне зберігання",
        free: "Безкоштовно"
      },
      support: {
        title: "Підтримка",
        install: "Як встановити",
        features: "Можливості",
        guide: "Інструкція"
      }
    },

    blog: {
      title: "Блог - disCard",
      pageTitle: "Блог",
      description: "Поради, новини та гайди про карти лояльності",
      subtitle: "Поради, новини та гайди про карти лояльності",
      filters: {
        all: "Всі",
        tips: "Поради",
        news: "Новини",
        guides: "Гайди"
      },
      categories: {
        tips: "Поради",
        news: "Новини",
        guides: "Гайди"
      },
      readTime: "хв читання",
      noResults: "Нічого не знайдено",
      loading: "Завантаження..."
    },

    contact: {
      title: "Контакти - disCard",
      heading: "Зв'яжіться з нами",
      subtitle: "Маєте питання чи пропозиції? Ми завжди раді вам допомогти!",
      form: {
        heading: "Форма зворотного зв'язку",
        email: "Email",
        emailPlaceholder: "ваша-пошта@example.com",
        subject: "Тема",
        subjectPlaceholder: "Тема повідомлення",
        message: "Повідомлення",
        messagePlaceholder: "Ваше повідомлення...",
        submit: "Відправити",
        sending: "Відправлення...",
        success: "Повідомлення успішно відправлено!",
        error: "Помилка відправлення. Спробуйте пізніше."
      },
      info: {
        heading: "Контактна інформація",
        email: "Email",
        emailAddress: "discardmessage@gmail.com",
        responseTime: "Час відповіді",
        responseTimeValue: "Протягом 24 годин",
        social: "Соціальні мережі"
      }
    },

    faq: {
      items: {
        what_is_discard: {
          question: "Що таке disCard?",
          answer: "disCard - це безкоштовний PWA (Progressive Web App) додаток для зберігання всіх ваших карт лояльності в одному місці. Більше не потрібно носити з собою десятки пластикових карток - всі ваші бонусні карти магазинів, аптек, кав'ярень тепер завжди з вами у смартфоні."
        },
        is_free: {
          question: "Чи безкоштовний цей додаток?",
          answer: "Так, disCard повністю безкоштовний. Немає прихованих платежів, підписок чи обмежень функціоналу. Всі можливості доступні безкоштовно назавжди."
        },
        how_to_install: {
          question: "Як встановити додаток?",
          answer: "disCard працює як PWA, тому встановлення дуже просте:\n\nДля Android:\n1. Відкрийте сайт у Chrome\n2. Натисніть на три крапки (⋮) у правому верхньому куті\n3. Виберіть 'Додати на головний екран'\n4. Підтвердіть встановлення\n\nДля iOS:\n1. Відкрийте Safari\n2. Натисніть кнопку 'Поділитися' (□↗)\n3. Виберіть 'На екран «Домой»'\n4. Натисніть 'Додати'"
        },
        works_offline: {
          question: "Чи працює додаток без інтернету?",
          answer: "Так! Завдяки PWA технології всі ваші карти доступні офлайн. Після першого завантаження додатку ви можете використовувати його без підключення до інтернету. Це зручно в магазинах, метро чи в будь-якому місці з поганим зв'язком."
        },
        supported_codes: {
          question: "Які типи кодів підтримуються?",
          answer: "disCard підтримує всі популярні типи кодів:\n• QR-коди\n• Штрих-коди (EAN-13, EAN-8, Code 128, UPC тощо)\n• Коди-39\n• ITF-14\nта інші стандартні формати, які використовуються в українських магазинах."
        },
        how_to_add_card: {
          question: "Як додати нову картку?",
          answer: "Є два способи додати картку:\n\n1. Сканування камерою:\n   • Натисніть 'Додати' у нижньому меню\n   • Натисніть кнопку 'Сканувати'\n   • Наведіть камеру на штрих-код або QR-код картки\n   • Код розпізнається автоматично\n\n2. Ручне введення:\n   • Натисніть 'Додати'\n   • Введіть назву картки\n   • Оберіть тип коду (штрих-код або QR)\n   • Введіть номер картки вручну\n   • Натисніть 'Зберегти'"
        },
        is_safe: {
          question: "Чи безпечно зберігати картки у додатку?",
          answer: "Абсолютно безпечно! Ваші дані захищені на кількох рівнях:\n• Шифрування даних на вашому пристрої\n• Безпечне зберігання на сервері з використанням bcrypt\n• Аутентифікація через JWT токени\n• HTTPS з'єднання\n• Доступ лише за паролем\n\nМи не передаємо ваші дані третім особам і не використовуємо їх в комерційних цілях."
        },
        sync_devices: {
          question: "Чи можна синхронізувати картки між пристроями?",
          answer: "Так! Після реєстрації всі ваші картки автоматично синхронізуються між усіма вашими пристроями. Просто увійдіть в обліковий запис на новому пристрої, і всі ваші картки будуть доступні."
        },
        code_wont_scan: {
          question: "Що робити, якщо код не сканується?",
          answer: "Якщо камера не може зчитати код, спробуйте:\n• Очистити камеру від бруду\n• Покращити освітлення\n• Тримати телефон стабільно на відстані 10-15 см від картки\n• Переконатися, що картка не пошкоджена\n\nЯкщо сканування все одно не працює, ви завжди можете ввести номер картки вручну."
        },
        how_many_cards: {
          question: "Скільки карток можна зберігати?",
          answer: "Немає ніяких обмежень! Ви можете зберігати необмежену кількість карт лояльності. Додаток підтримує всі популярні магазини України: АТБ, Сільпо, EVA, Brocard, Аптека низьких цін та багато інших."
        },
        how_to_use_in_store: {
          question: "Як використовувати картку в магазині?",
          answer: "Дуже просто:\n1. Відкрийте додаток\n2. Знайдіть потрібну картку (можна використати пошук)\n3. Натисніть на картку\n4. Покажіть код касиру для сканування\n\nКод відображається у великому розмірі з максимальною яскравістю екрану для легкого сканування."
        },
        registration_required: {
          question: "Чи потрібна реєстрація?",
          answer: "Реєстрація не обов'язкова для базового використання, але ми рекомендуємо зареєструватися, щоб:\n• Синхронізувати картки між пристроями\n• Зберігати резервні копії ваших карт\n• Відновити доступ при втраті телефону\n• Користуватися додатком на кількох пристроях"
        },
        forgot_password: {
          question: "Що робити, якщо я забув пароль?",
          answer: "Якщо ви забули пароль:\n1. Натисніть 'Забули пароль?' на сторінці входу\n2. Введіть вашу електронну пошту\n3. Перевірте пошту - ми надішлемо вам посилання для відновлення\n4. Перейдіть за посиланням і створіть новий пароль\n\nЯкщо лист не прийшов, перевірте папку 'Спам'."
        },
        can_delete_card: {
          question: "Чи можна видалити картку?",
          answer: "Так, ви можете видалити будь-яку картку в будь-який час:\n1. Відкрийте картку\n2. Натисніть кнопку 'Видалити картку' внизу\n3. Підтвердіть видалення\n\nУвага: видалення незворотне, картку потрібно буде додати знову якщо передумаєте."
        },
        dark_theme_support: {
          question: "Чи підтримується темна тема?",
          answer: "Так! disCard підтримує як світлу, так і темну теми. Тему можна змінити в налаштуваннях додатку. За замовчуванням додаток використовує тему згідно системних налаштувань вашого телефону."
        },
        pwa_vs_regular: {
          question: "Яка різниця між PWA та звичайним додатком?",
          answer: "PWA (Progressive Web App) - це сучасна веб-технологія, що поєднує переваги веб-сайтів та мобільних додатків:\n\nПереваги PWA:\n• Не потребує Google Play або App Store\n• Швидке встановлення (10 секунд)\n• Займає менше місця на телефоні\n• Автоматичні оновлення\n• Працює на Android, iOS, Windows, Mac\n• Працює офлайн\n\nПри цьому працює так само швидко як нативний додаток!"
        },
        data_collection: {
          question: "Чи збирає додаток мої особисті дані?",
          answer: "Ми дбаємо про вашу приватність. disCard збирає мінімум даних:\n• Email (для реєстрації та входу)\n• Ім'я (для персоналізації)\n• Дані карток (зберігаються в зашифрованому вигляді)\n\nМи НЕ збираємо:\n• Вашу геолокацію\n• Контакти\n• Фото (крім сканованих карток)\n• Історію покупок\n\nДетальніше в нашій Політиці конфіденційності."
        },
        change_language: {
          question: "Чи можна змінити мову додатку?",
          answer: "Так, disCard підтримує українську та англійську мови. Змінити мову можна в розділі 'Налаштування'. За замовчуванням використовується мова згідно налаштувань вашого телефону."
        },
        contact_support: {
          question: "Як зв'язатися з підтримкою?",
          answer: "Якщо у вас виникли питання або проблеми:\n\n• Email: discardmessage@gmail.com\n• Форма зворотного зв'язку: на сторінці Контакти\n• Час відповіді: протягом 24 годин\n\nМи завжди раді допомогти!"
        },
        export_data: {
          question: "Чи можна експортувати свої дані?",
          answer: "Так, відповідно до GDPR ви маєте право отримати копію всіх ваших даних. Зв'яжіться з нами через форму зворотного зв'язку, і ми надішлемо вам архів з усіма вашими даними у форматі JSON протягом 30 днів."
        },
        technical_issues: {
          question: "Що робити при технічних проблемах?",
          answer: "Якщо додаток працює некоректно:\n\n1. Спробуйте оновити сторінку\n2. Очистіть кеш браузера\n3. Перевірте інтернет-з'єднання\n4. Спробуйте вийти та увійти знову\n5. Переконайтеся, що ви використовуєте останню версію браузера\n\nЯкщо проблема залишається - напишіть нам на discardmessage@gmail.com з описом проблеми та скріншотом (якщо можливо)."
        }
      }
    },

    // Key Features Section
    keyFeatures: {
      title: "Переваги disCard",
      pwa: {
        title: "PWA додаток",
        description: "Прогресивний веб-додаток що працює як нативна програма. Встановлюється прямо з браузера без потреби App Store чи Google Play. Автоматичні оновлення та швидкий запуск.",
        benefit1: "Встановлення за 10 секунд",
        benefit2: "Не займає багато місця",
        benefit3: "Автооновлення в фоні"
      },
      offline: {
        title: "Робота офлайн",
        description: "Всі ваші карти доступні навіть без інтернет-з'єднання. Використовуйте картки лояльності в магазині, метро чи будь-де. Синхронізація відбувається автоматично при підключенні.",
        benefit1: "100% доступність карток",
        benefit2: "Швидке завантаження",
        benefit3: "Економія трафіку"
      },
      secure: {
        title: "Безпечне зберігання",
        description: "Ваші дані захищені сучасним шифруванням та зберігаються локально на вашому пристрої. Ніхто не має доступу до ваших карток, крім вас. Повна конфіденційність гарантована.",
        benefit1: "AES-256 шифрування",
        benefit2: "Локальне зберігання",
        benefit3: "Нульовий доступ третіх осіб"
      },
      free: {
        title: "Повністю безкоштовно",
        description: "Ніяких прихованих платежів, підписок чи обмежень. Всі функції доступні безкоштовно назавжди. Підтримується рекламою, що не заважає користуванню додатком.",
        benefit1: "Без підписок",
        benefit2: "Всі функції доступні",
        benefit3: "Мінімум реклами"
      }
    },
    
    // App Navigation
    tabs: {
      cards: "Карти",
      add: "Додати",
      profile: "Профіль",
      settings: "Налаштування"
    },
    
    // Authentication
    auth: {
      login: "Увійти",
      register: "Реєстрація",
      email: "Email",
      password: "Пароль",
      name: "Ім'я",
      loginTitle: "Вхід до акаунту",
      registerTitle: "Створення акаунту",
      noAccount: "Немає акаунту?",
      hasAccount: "Вже є акаунт?",
      forgotPassword: "Забули пароль?",
      termsAccept: "Я приймаю <a href=\"/terms\" target=\"_blank\">Умови використання</a> та <a href=\"/privacy\" target=\"_blank\">Політику конфіденційності</a>"
    },
    
    // Two-Factor Authentication
    twofa: {
      title: "Підтвердження входу",
      subtitle: "Введіть код підтвердження, відправлений на вашу електронну пошту",
      sentTo: "Надіслано на:",
      verify: "Підтвердити",
      resend: "Надіслати код повторно",
      back: "Назад до входу",
      resendIn: "Повторне надсилання доступне через:",
      seconds: "секунд",
      invalidCode: "Невірний код підтвердження",
      codeExpired: "Код підтвердження минув",
      verificationSuccess: "Вхід підтверджено успішно",
      resendSuccess: "Код відправлено повторно",
      enterAllDigits: "Введіть усі 6 цифр коду"
    },
    
    // Security
    security: {
      title: "Безпека",
      twoFactor: "Двофакторна автентифікація",
      twoFactorDescription: "Додатковий рівень безпеки для вашого акаунту",
      twoFactorEnabled: "2FA увімкнено",
      twoFactorDisabled: "2FA вимкнено",
      enableTwoFactor: "Увімкнути 2FA",
      disableTwoFactor: "Вимкнути 2FA"
    },
    
    // Profile
    profile: {
      userId: "ID користувача",
      changePassword: "Зміна пароля",
      currentPassword: "Поточний пароль",
      newPassword: "Новий пароль",
      confirmPassword: "Підтвердити пароль",
      userInfo: "Інформація користувача",
      statistics: "Статистика",
      cardsCount: "Збережено карт",
      joinDate: "Дата реєстрації",
      logout: "Вийти",
      changePasswordBtn: "Змінити пароль",
      noDateAvailable: "Дата недоступна"
    },
    
    // Settings
    settings: {
      theme: "Тема",
      light: "Світла",
      dark: "Темна",
      language: "Мова",
      appearance: "Вигляд додатку",
      interfaceLanguage: "Мова інтерфейсу",
      themeDescription: "Оберіть світлу або темну тему",
      languageDescription: "Оберіть мову додатку"
    },
    
    // Cards
    cards: {
      searchPlaceholder: "Пошук карт...",
      noCards: "У вас поки немає збережених карт",
      noCardsSubtitle: "Додайте вашу першу картку лояльності",
      addCard: "Додати картку",
      cardName: "Назва картки",
      cardNamePlaceholder: "Наприклад: АТБ",
      cardCode: "Код картки",
      codeType: "Тип коду",
      barcode: "Штрих-код",
      qrcode: "QR-код",
      preview: "Превью коду",
      saveCard: "Зберегти картку",
      editCard: "Редагувати картку",
      deleteCard: "Видалити картку",
      copyCode: "Копіювати код",
      scanCode: "Сканувати код",
      manualEntry: "Введіть код або скануйте",
      scanInstructions: "Наведіть камеру на штрих-код або QR-код для сканування",
      created: "Створено",
      codeWillAppear: "Код з'явиться тут"
    },
    
    // Scanner
    scanner: {
      title: "Сканування коду",
      instructions: "Наведіть камеру на штрих-код або QR-код для сканування",
      permissionDenied: "Доступ до камери заборонено",
      notFound: "Камера не знайдена",
      scanning: "Сканування...",
      success: "Код успішно відсканований!",
      error: "Помилка сканування",
      barcodeUnavailable: "Штрих-код недоступний"
    },
    
    // Messages
    messages: {
      loading: "Завантаження...",
      saving: "Збереження...",
      saved: "Збережено!",
      error: "Помилка",
      success: "Успіх",
      pullToRefresh: "Потягніть для оновлення",
      confirm: "Підтвердити",
      cancel: "Скасувати",
      delete: "Видалити",
      edit: "Редагувати",
      close: "Закрити",
      copy: "Копіювати",
      copied: "Скопійовано!",
      copyFailed: "Помилка копіювання",
      loginSuccess: "Успішний вхід",
      registerSuccess: "Акаунт створено успішно! Увійдіть у свій акаунт",
      logoutSuccess: "Ви вийшли з акаунту",
      passwordChanged: "Пароль змінено",
      profileUpdated: "Профіль оновлено",
      cardAdded: "Картку додано",
      cardUpdated: "Картку оновлено",
      cardDeleted: "Картку видалено",
      invalidCredentials: "Невірні дані для входу",
      emailExists: "Користувач з таким email вже існує",
      passwordTooShort: "Пароль повинен містити мінімум 8 символів",
      invalidName: "Некоректне ім'я. Використовуйте тільки літери, апостроф, дефіс та пробіли (2-50 символів)",
      passwordsDontMatch: "Паролі не співпадають",
      fillAllFields: "Заповніть всі поля",
      acceptTerms: "Ви повинні прийняти умови використання",
      networkError: "Помилка мережі",
      serverError: "Помилка сервера",
      cameraNotSupported: "Камера не підтримується",
      invalidCode: "Невірний код",
      confirmDelete: "Ви впевнені, що хочете видалити цю картку?",
      offlineMode: "Режим офлайн"
    },
    
    // Time formats
    time: {
      now: "зараз",
      minuteAgo: "хвилину тому",
      minutesAgo: "хвилин тому",
      hourAgo: "годину тому",
      hoursAgo: "годин тому",
      dayAgo: "день тому",
      daysAgo: "днів тому",
      monthAgo: "місяць тому",
      monthsAgo: "місяців тому",
      yearAgo: "рік тому",
      yearsAgo: "років тому"
    }
  },
  
  en: {
    // Navigation
    nav: {
      home: "Home",
      blog: "Blog",
      faq: "FAQ",
      contact: "Contact",
      app: "Open App"
    },
    // Landing Page
    heroTitle: "All loyalty cards in one place",
    heroSubtitle: "Scan, store and use your store cards in a convenient PWA app",
    features: {
      scan: "Camera scanning",
      scanDescription: "Easily add new cards by simply scanning barcodes or QR codes",
      store: "Secure storage",
      storeDescription: "Your cards are stored encrypted with access only for you",
      access: "Quick access",
      accessDescription: "Instant access to all your cards even offline thanks to PWA technology"
    },
    cta: "Try for free",
    screenshots: {
      title: "Easy to use interface",
      allCards: "All cards in one place",
      easyScanning: "Easy scanning",
      personalization: "Personalization"
    },
    mockupCards: {
      tabs: {
        cards: "📱 Cards",
        add: "➕ Add",
        settings: "⚙️ Settings"
      },
      stores: {
        atb: "ATB",
        silpo: "Silpo", 
        eva: "EVA"
      },
      scanner: {
        instruction: "Point your camera at barcode or QR code"
      },
      settings: {
        darkTheme: "🌙 Dark theme",
        language: "🌍 Language: English"
      }
    },
    installation: {
      title: "How to install the app on your phone",
      android: {
        step1: {
          title: "Open the app in browser",
          desc: "Go to the website through Chrome or any other browser"
        },
        step2: {
          title: "Find browser menu",
          desc: "Tap on three dots (<img src='/icons/share-android.png' alt='menu' style='display:inline; width:16px; height:16px; vertical-align:middle;'>) in the top right corner of the browser"
        },
        step3: {
          title: "Select \"Add to Home screen\"",
          desc: "Or \"Install app\" depending on your browser"
        },
        step4: {
          title: "Confirm installation",
          desc: "Tap \"Add\" and the app will appear on your home screen"
        }
      },
      ios: {
        step1: {
          title: "Open Safari",
          desc: "It's important to use Safari browser on iOS devices"
        },
        step2: {
          title: "Go to the website",
          desc: "Enter the website address in Safari's address bar"
        },
        step3: {
          title: "Tap the \"Share\" button",
          desc: "Find the share icon (<img src='/icons/share-apple.png' alt='share' style='display:inline; width:16px; height:16px; vertical-align:middle;'>) at the bottom of Safari screen"
        },
        step4: {
          title: "Select \"Add to Home Screen\"",
          desc: "Scroll down and find the \"Add to Home Screen\" option"
        },
        step5: {
          title: "Add the app",
          desc: "Tap \"Add\" and the icon will appear on your home screen"
        }
      },
      note: {
        title: "Why does it work without App Store?",
        desc: "disCard is a PWA (Progressive Web App), a modern technology that allows web apps to work like native programs with offline access and push notifications."
      }
    },
    footer: {
      description: "Modern app for managing loyalty cards",
      rights: "All rights reserved.",
      features: {
        title: "Features",
        pwa: "PWA App",
        offline: "Works Offline",
        secure: "Secure Storage",
        free: "Free"
      },
      support: {
        title: "Support",
        install: "How to Install",
        features: "Features",
        guide: "Guide"
      }
    },

    blog: {
      title: "Blog - disCard",
      pageTitle: "Blog",
      description: "Tips, news and guides about loyalty cards",
      subtitle: "Tips, news and guides about loyalty cards",
      filters: {
        all: "All",
        tips: "Tips",
        news: "News",
        guides: "Guides"
      },
      categories: {
        tips: "Tips",
        news: "News",
        guides: "Guides"
      },
      readTime: "min read",
      noResults: "No results found",
      loading: "Loading..."
    },

    contact: {
      title: "Contact - disCard",
      heading: "Get in Touch",
      subtitle: "Have questions or suggestions? We're always here to help!",
      form: {
        heading: "Contact Form",
        email: "Email",
        emailPlaceholder: "your-email@example.com",
        subject: "Subject",
        subjectPlaceholder: "Message subject",
        message: "Message",
        messagePlaceholder: "Your message...",
        submit: "Send",
        sending: "Sending...",
        success: "Message sent successfully!",
        error: "Send error. Please try again later."
      },
      info: {
        heading: "Contact Information",
        email: "Email",
        emailAddress: "discardmessage@gmail.com",
        responseTime: "Response Time",
        responseTimeValue: "Within 24 hours",
        social: "Social Media"
      }
    },

    faq: {
      items: {
        what_is_discard: {
          question: "What is disCard?",
          answer: "disCard is a free PWA (Progressive Web App) for storing all your loyalty cards in one place. No need to carry dozens of plastic cards - all your bonus cards from stores, pharmacies, and cafes are now always with you on your smartphone."
        },
        is_free: {
          question: "Is this app free?",
          answer: "Yes, disCard is completely free. There are no hidden fees, subscriptions, or feature limitations. All features are available for free forever."
        },
        how_to_install: {
          question: "How to install the app?",
          answer: "disCard works as a PWA, so installation is very simple:\n\nFor Android:\n1. Open the website in Chrome\n2. Tap the three dots (⋮) in the top right corner\n3. Select 'Add to Home screen'\n4. Confirm installation\n\nFor iOS:\n1. Open Safari\n2. Tap the 'Share' button (□↗)\n3. Select 'Add to Home Screen'\n4. Tap 'Add'"
        },
        works_offline: {
          question: "Does the app work offline?",
          answer: "Yes! Thanks to PWA technology, all your cards are available offline. After the first load, you can use the app without an internet connection. This is convenient in stores, subway, or anywhere with poor connectivity."
        },
        supported_codes: {
          question: "What types of codes are supported?",
          answer: "disCard supports all popular code types:\n• QR codes\n• Barcodes (EAN-13, EAN-8, Code 128, UPC, etc.)\n• Code-39\n• ITF-14\nand other standard formats used in retail stores."
        },
        how_to_add_card: {
          question: "How to add a new card?",
          answer: "There are two ways to add a card:\n\n1. Camera scanning:\n   • Tap 'Add' in the bottom menu\n   • Tap 'Scan' button\n   • Point the camera at the barcode or QR code\n   • Code is recognized automatically\n\n2. Manual entry:\n   • Tap 'Add'\n   • Enter card name\n   • Select code type (barcode or QR)\n   • Enter card number manually\n   • Tap 'Save'"
        },
        is_safe: {
          question: "Is it safe to store cards in the app?",
          answer: "Absolutely safe! Your data is protected at multiple levels:\n• Data encryption on your device\n• Secure server storage using bcrypt\n• JWT token authentication\n• HTTPS connection\n• Password-only access\n\nWe don't share your data with third parties or use it for commercial purposes."
        },
        sync_devices: {
          question: "Can I sync cards between devices?",
          answer: "Yes! After registration, all your cards are automatically synced across all your devices. Just sign in to your account on a new device, and all your cards will be available."
        },
        code_wont_scan: {
          question: "What to do if the code won't scan?",
          answer: "If the camera can't read the code, try:\n• Clean the camera lens\n• Improve lighting\n• Hold the phone steady 10-15 cm from the card\n• Make sure the card isn't damaged\n\nIf scanning still doesn't work, you can always enter the card number manually."
        },
        how_many_cards: {
          question: "How many cards can I store?",
          answer: "No limits! You can store unlimited loyalty cards. The app supports all popular stores: ATB, Silpo, EVA, Brocard, and many others."
        },
        how_to_use_in_store: {
          question: "How to use a card in store?",
          answer: "Very simple:\n1. Open the app\n2. Find the card you need (use search if needed)\n3. Tap the card\n4. Show the code to the cashier for scanning\n\nThe code displays in large size with maximum screen brightness for easy scanning."
        },
        registration_required: {
          question: "Is registration required?",
          answer: "Registration is not required for basic use, but we recommend signing up to:\n• Sync cards between devices\n• Keep backups of your cards\n• Restore access if you lose your phone\n• Use the app on multiple devices"
        },
        forgot_password: {
          question: "What if I forgot my password?",
          answer: "If you forgot your password:\n1. Click 'Forgot password?' on the login page\n2. Enter your email\n3. Check your email - we'll send you a recovery link\n4. Follow the link and create a new password\n\nIf the email doesn't arrive, check your Spam folder."
        },
        can_delete_card: {
          question: "Can I delete a card?",
          answer: "Yes, you can delete any card at any time:\n1. Open the card\n2. Tap 'Delete card' button at the bottom\n3. Confirm deletion\n\nWarning: deletion is permanent, you'll need to add the card again if you change your mind."
        },
        dark_theme_support: {
          question: "Is dark theme supported?",
          answer: "Yes! disCard supports both light and dark themes. You can change the theme in app settings. By default, the app uses your phone's system theme."
        },
        pwa_vs_regular: {
          question: "What's the difference between PWA and regular app?",
          answer: "PWA (Progressive Web App) is a modern web technology that combines the benefits of websites and mobile apps:\n\nPWA advantages:\n• No Google Play or App Store needed\n• Quick installation (10 seconds)\n• Takes less phone storage\n• Automatic updates\n• Works on Android, iOS, Windows, Mac\n• Works offline\n\nYet performs as fast as a native app!"
        },
        data_collection: {
          question: "Does the app collect my personal data?",
          answer: "We care about your privacy. disCard collects minimal data:\n• Email (for registration and login)\n• Name (for personalization)\n• Card data (stored encrypted)\n\nWe DON'T collect:\n• Your location\n• Contacts\n• Photos (except scanned cards)\n• Purchase history\n\nSee our Privacy Policy for details."
        },
        change_language: {
          question: "Can I change the app language?",
          answer: "Yes, disCard supports Ukrainian and English. You can change the language in Settings. By default, it uses your phone's language settings."
        },
        contact_support: {
          question: "How to contact support?",
          answer: "If you have questions or issues:\n\n• Email: discardmessage@gmail.com\n• Contact form: on the Contacts page\n• Response time: within 24 hours\n\nWe're always happy to help!"
        },
        export_data: {
          question: "Can I export my data?",
          answer: "Yes, according to GDPR you have the right to receive a copy of all your data. Contact us through the feedback form, and we'll send you an archive with all your data in JSON format within 30 days."
        },
        technical_issues: {
          question: "What to do with technical issues?",
          answer: "If the app isn't working correctly:\n\n1. Try refreshing the page\n2. Clear browser cache\n3. Check internet connection\n4. Try logging out and back in\n5. Make sure you're using the latest browser version\n\nIf the problem persists - email us at discardmessage@gmail.com with a description and screenshot (if possible)."
        }
      }
    },

    // Key Features Section
    keyFeatures: {
      title: "disCard Advantages",
      pwa: {
        title: "PWA App",
        description: "Progressive Web Application that works like a native program. Installs directly from the browser without needing App Store or Google Play. Automatic updates and fast startup.",
        benefit1: "10-second installation",
        benefit2: "Doesn't take much space",
        benefit3: "Auto-updates in background"
      },
      offline: {
        title: "Works Offline",
        description: "All your cards are accessible even without internet connection. Use loyalty cards in stores, subway or anywhere. Synchronization happens automatically when connected.",
        benefit1: "100% card availability",
        benefit2: "Fast loading",
        benefit3: "Traffic savings"
      },
      secure: {
        title: "Secure Storage",
        description: "Your data is protected with modern encryption and stored locally on your device. No one has access to your cards except you. Complete privacy guaranteed.",
        benefit1: "AES-256 encryption",
        benefit2: "Local storage",
        benefit3: "Zero third-party access"
      },
      free: {
        title: "Completely Free",
        description: "No hidden fees, subscriptions or restrictions. All features are available for free forever. Supported by ads that don't interfere with app usage.",
        benefit1: "No subscriptions",
        benefit2: "All features available",
        benefit3: "Minimal advertising"
      }
    },
    
    // App Navigation
    tabs: {
      cards: "Cards",
      add: "Add",
      profile: "Profile",
      settings: "Settings"
    },
    
    // Authentication
    auth: {
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      name: "Name",
      loginTitle: "Sign in to your account",
      registerTitle: "Create your account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      forgotPassword: "Forgot password?",
      termsAccept: "I accept the <a href=\"/terms\" target=\"_blank\">Terms of Service</a> and <a href=\"/privacy\" target=\"_blank\">Privacy Policy</a>"
    },
    
    // Two-Factor Authentication
    twofa: {
      title: "Verify Sign In",
      subtitle: "Enter the verification code sent to your email address",
      sentTo: "Sent to:",
      verify: "Verify",
      resend: "Resend code",
      back: "Back to sign in",
      resendIn: "Resend available in:",
      seconds: "seconds",
      invalidCode: "Invalid verification code",
      codeExpired: "Verification code expired",
      verificationSuccess: "Sign in verified successfully",
      resendSuccess: "Code sent again",
      enterAllDigits: "Enter all 6 digits of the code"
    },
    
    // Security
    security: {
      title: "Security",
      twoFactor: "Two-Factor Authentication",
      twoFactorDescription: "Extra security layer for your account",
      twoFactorEnabled: "2FA enabled",
      twoFactorDisabled: "2FA disabled",
      enableTwoFactor: "Enable 2FA",
      disableTwoFactor: "Disable 2FA"
    },
    
    // Profile
    profile: {
      userId: "User ID",
      changePassword: "Change password",
      currentPassword: "Current password",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      userInfo: "User information",
      statistics: "Statistics",
      cardsCount: "Saved cards",
      joinDate: "Join date",
      logout: "Logout",
      changePasswordBtn: "Change password",
      noDateAvailable: "No date available"
    },
    
    // Settings
    settings: {
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      language: "Language",
      appearance: "App appearance",
      interfaceLanguage: "Interface language",
      themeDescription: "Choose light or dark theme",
      languageDescription: "Choose app language"
    },
    
    // Cards
    cards: {
      searchPlaceholder: "Search cards...",
      noCards: "You don't have any saved cards yet",
      noCardsSubtitle: "Add your first loyalty card",
      addCard: "Add card",
      cardName: "Card name",
      cardNamePlaceholder: "e.g.: Starbucks",
      cardCode: "Card code",
      codeType: "Code type",
      barcode: "Barcode",
      qrcode: "QR code",
      preview: "Code preview",
      saveCard: "Save card",
      editCard: "Edit card",
      deleteCard: "Delete card",
      copyCode: "Copy code",
      scanCode: "Scan code",
      manualEntry: "Enter code or scan",
      scanInstructions: "Point your camera at barcode or QR code to scan",
      created: "Created",
      codeWillAppear: "Code will appear here"
    },
    
    // Scanner
    scanner: {
      title: "Code scanning",
      instructions: "Point your camera at barcode or QR code to scan",
      permissionDenied: "Camera access denied",
      notFound: "Camera not found",
      scanning: "Scanning...",
      success: "Code scanned successfully!",
      error: "Scanning error",
      barcodeUnavailable: "Barcode unavailable"
    },
    
    // Messages
    messages: {
      loading: "Loading...",
      saving: "Saving...",
      saved: "Saved!",
      error: "Error",
      success: "Success",
      pullToRefresh: "Pull to refresh",
      confirm: "Confirm",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      copy: "Copy",
      copied: "Copied!",
      copyFailed: "Copy failed",
      loginSuccess: "Login successful",
      registerSuccess: "Account created successfully! Please log in",
      logoutSuccess: "You have been logged out",
      passwordChanged: "Password changed",
      profileUpdated: "Profile updated",
      cardAdded: "Card added",
      cardUpdated: "Card updated",
      cardDeleted: "Card deleted",
      invalidCredentials: "Invalid login credentials",
      emailExists: "User with this email already exists",
      passwordTooShort: "Password must be at least 8 characters",
      invalidName: "Invalid name. Use only letters, apostrophe, hyphen and spaces (2-50 characters)",
      passwordsDontMatch: "Passwords don't match",
      fillAllFields: "Please fill all fields",
      acceptTerms: "You must accept the terms and conditions",
      networkError: "Network error",
      serverError: "Server error",
      cameraNotSupported: "Camera not supported",
      invalidCode: "Invalid code",
      confirmDelete: "Are you sure you want to delete this card?",
      offlineMode: "Offline mode"
    },
    
    // Time formats
    time: {
      now: "now",
      minuteAgo: "a minute ago",
      minutesAgo: "minutes ago",
      hourAgo: "an hour ago",
      hoursAgo: "hours ago",
      dayAgo: "a day ago",
      daysAgo: "days ago",
      monthAgo: "a month ago",
      monthsAgo: "months ago",
      yearAgo: "a year ago",
      yearsAgo: "years ago"
    }
  }
};

// i18n utility functions
class I18n {
  constructor() {
    this.translations = translations;
    this.currentLanguage = this.detectLanguage();
    this.init();
  }

  init() {
    // Listen for language changes
    document.addEventListener('languageChanged', (e) => {
      this.currentLanguage = e.detail.language;
      this.updatePageTexts();
    });
  }

  detectLanguage() {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && this.translations[savedLanguage]) {
      return savedLanguage;
    }

    // Check browser language
    const browserLanguage = navigator.language.split('-')[0];
    if (this.translations[browserLanguage]) {
      return browserLanguage;
    }

    // Default to Ukrainian
    return 'uk';
  }

  setLanguage(language) {
    if (!this.translations[language]) {
      return false;
    }

    this.currentLanguage = language;
    localStorage.setItem('language', language);
    
    // Update HTML lang attribute
    document.documentElement.lang = language;
    
    // Update page texts immediately
    this.updatePageTexts();
    
    // Dispatch language change event
    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language }
    }));

    return true;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to default language
        value = this.translations['uk'];
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return key;
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }

  updatePageTexts() {
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' && element.type !== 'button') {
        element.placeholder = translation;
      } else {
        // Check if translation contains HTML tags
        if (translation.includes('<img') || translation.includes('<')) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });

    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });

    // Update page title
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
      const key = titleElement.getAttribute('data-i18n');
      document.title = this.t(key);
    }
  }

  formatTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return this.t('time.now');
    } else if (minutes < 2) {
      return this.t('time.minuteAgo');
    } else if (minutes < 60) {
      return `${minutes} ${this.t('time.minutesAgo')}`;
    } else if (hours < 2) {
      return this.t('time.hourAgo');
    } else if (hours < 24) {
      return `${hours} ${this.t('time.hoursAgo')}`;
    } else if (days < 2) {
      return this.t('time.dayAgo');
    } else if (days < 30) {
      return `${days} ${this.t('time.daysAgo')}`;
    } else if (months < 2) {
      return this.t('time.monthAgo');
    } else if (months < 12) {
      return `${months} ${this.t('time.monthsAgo')}`;
    } else if (years < 2) {
      return this.t('time.yearAgo');
    } else {
      return `${years} ${this.t('time.yearsAgo')}`;
    }
  }

  formatDate(date) {
    const d = new Date(date);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return d.toLocaleDateString(this.currentLanguage === 'uk' ? 'uk-UA' : 'en-US', options);
  }

  pluralize(count, singular, few, many) {
    if (this.currentLanguage === 'uk') {
      if (count % 10 === 1 && count % 100 !== 11) {
        return singular;
      } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
        return few;
      } else {
        return many;
      }
    } else {
      return count === 1 ? singular : few;
    }
  }
}

// Initialize when ready
function initializeI18n() {
  try {
    // Create global instance
    window.i18n = new I18n();
    
    // Global shortcut function
    window.t = (key, params) => window.i18n.t(key, params);
    
    // Update texts
    window.i18n.updatePageTexts();
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    
    // Create fallback functions
    window.t = (key) => key;
    window.i18n = {
      setLanguage: () => true,
      getCurrentLanguage: () => 'uk',
      updatePageTexts: () => {},
      t: (key) => key,
      formatDate: (date) => new Date(date).toLocaleDateString(),
      formatTime: (date) => new Date(date).toLocaleString()
    };
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeI18n);
} else {
  initializeI18n();
}