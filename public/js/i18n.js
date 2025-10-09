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
    
    // Blog
    blog: {
      title: "Блог - disCard",
      pageTitle: "Блог",
      subtitle: "Поради, новини та гайди про карти лояльності",
      readTime: "хв читання",
      noResults: "Нічого не знайдено",
      filters: {
        all: "Всі",
        tips: "Поради",
        news: "Новини",
        guides: "Гайди"
      },
      categories: {
        tips: "Поради",
        news: "Новини",
        guides: "Гайди",
        other: "Інше"
      }
    },
    
    // Contact
    contact: {
      title: "Контакти - disCard",
      heading: "Зв'яжіться з нами",
      subtitle: "Маєте питання чи пропозиції? Ми завжди раді вам допомогти!",
      form: {
        heading: "Форма зворотного зв'язку",
        email: "Email",
        emailPlaceholder: "your@email.com",
        subject: "Тема",
        subjectPlaceholder: "Тема вашого повідомлення",
        message: "Повідомлення",
        messagePlaceholder: "Опишіть ваше питання або пропозицію",
        submit: "Відправити",
        success: "Повідомлення успішно відправлено!",
        error: "Помилка відправлення. Спробуйте пізніше.",
        subjects: {
          support: "Підтримка",
          feedback: "Відгук",
          bug: "Повідомлення про помилку",
          feature: "Пропозиція функції",
          other: "Інше"
        }
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
    
    // FAQ
    faq: {
      title: "FAQ - Часті питання",
      heading: "Часті питання",
      subtitle: "Знайдіть відповіді на найпоширеніші питання про disCard",
      searchPlaceholder: "🔍 Шукати питання...",
      noResults: "Нічого не знайдено. Спробуйте інший запит.",
      items: {
        what_is_discard: {
          question: "Що таке disCard?",
          answer: "disCard - це сучасний прогресивний веб-додаток (PWA) для зберігання та управління картами лояльності магазинів. Він дозволяє зберігати всі ваші картки в одному місці, сканувати штрих-коди та QR-коди, і використовувати їх навіть без інтернету."
        },
        is_free: {
          question: "Чи безкоштовний disCard?",
          answer: "Так, disCard повністю безкоштовний для використання. Немає прихованих платежів, підписок або обмежень. Всі функції доступні безкоштовно."
        },
        how_to_install: {
          question: "Як встановити disCard на телефон?",
          answer: "Відкрийте сайт у браузері Safari (iOS) або Chrome (Android), натисніть на меню браузера і виберіть \"Додати на головний екран\" або \"Install app\". Додаток встановиться як звичайна програма."
        },
        works_offline: {
          question: "Чи працює disCard без інтернету?",
          answer: "Так! Після встановлення disCard працює повністю офлайн. Ви можете переглядати та використовувати всі збережені картки навіть без інтернет-з'єднання."
        },
        supported_codes: {
          question: "Які типи кодів підтримує disCard?",
          answer: "disCard підтримує штрих-коди (Barcode) та QR-коди. Ви можете сканувати коди камерою або ввести їх вручну."
        },
        how_to_add_card: {
          question: "Як додати нову картку?",
          answer: "Натисніть кнопку \"Додати картку\", введіть назву магазину, потім або відскануйте код камерою, або введіть його вручну. Оберіть колір картки та збережіть."
        },
        is_safe: {
          question: "Чи безпечно зберігати картки в disCard?",
          answer: "Так, це повністю безпечно. Всі дані зберігаються локально на вашому пристрої з шифруванням. Ніхто не має доступу до ваших карток, крім вас."
        },
        sync_devices: {
          question: "Чи синхронізуються картки між пристроями?",
          answer: "Поточна версія зберігає дані локально на кожному пристрої. Синхронізація між пристроями планується в майбутніх версіях."
        },
        code_wont_scan: {
          question: "Що робити, якщо код не сканується?",
          answer: "Спробуйте покращити освітлення, очистити камеру, або введіть код вручну. Переконайтеся, що дозволили доступ до камери."
        },
        how_many_cards: {
          question: "Скільки карток можна зберігати?",
          answer: "Немає обмежень на кількість карток. Ви можете зберігати стільки карток, скільки потрібно."
        },
        how_to_use_in_store: {
          question: "Як використовувати картки в магазині?",
          answer: "Відкрийте disCard, знайдіть потрібну картку та покажіть штрих-код або QR-код касиру для сканування."
        },
        registration_required: {
          question: "Чи потрібна реєстрація для використання?",
          answer: "Ні, реєстрація не обов'язкова. Ви можете використовувати disCard без створення акаунту, але реєстрація дозволить зберігати картки в хмарі."
        },
        forgot_password: {
          question: "Що робити, якщо забув пароль?",
          answer: "Натисніть \"Забув пароль?\" на сторінці входу, введіть свій email, і вам буде надіслано новий згенерований пароль."
        },
        can_delete_card: {
          question: "Чи можна видалити картку?",
          answer: "Так, ви можете видалити будь-яку картку. Натисніть на картку, потім на кнопку \"Видалити\" та підтвердіть дію."
        },
        dark_theme_support: {
          question: "Чи підтримує disCard темну тему?",
          answer: "Так, disCard підтримує як світлу, так і темну теми. Ви можете переключити тему в налаштуваннях або додаток автоматично підлаштується під системну тему."
        },
        pwa_vs_regular: {
          question: "Чим PWA відрізняється від звичайного додатку?",
          answer: "PWA - це веб-технологія, що дозволяє додаткам працювати як нативні програми: офлайн доступ, швидке завантаження, встановлення без магазинів додатків."
        },
        data_collection: {
          question: "Які дані збирає disCard?",
          answer: "disCard не збирає особисті дані. Всі ваші картки зберігаються локально на вашому пристрої. Ми можемо збирати анонімну аналітику для покращення додатку."
        },
        change_language: {
          question: "Як змінити мову інтерфейсу?",
          answer: "Мову можна змінити в правому верхньому куті сторінки, натиснувши на перемикач \"УК/EN\"."
        },
        contact_support: {
          question: "Як зв'язатися з підтримкою?",
          answer: "Ви можете написати нам через форму на сторінці \"Контакти\" або надіслати email на discardmessage@gmail.com"
        },
        export_data: {
          question: "Чи можна експортувати дані?",
          answer: "Функція експорту планується в майбутніх версіях. Поки що ви можете зробити резервну копію через налаштування акаунту."
        },
        technical_issues: {
          question: "Що робити при технічних проблемах?",
          answer: "Спробуйте оновити сторінку, очистити кеш браузера або перевстановити PWA. Якщо проблема залишається, зверніться до підтримки."
        }
      }
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
      },
      legal: {
        title: "Юридична інформація",
        terms: "Умови використання",
        privacy: "Політика конфіденційності",
        contact: "Зворотній зв'язок"
      },
      quickLinks: {
        terms: "Умови",
        privacy: "Конфіденційність"
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
      forgotPassword: "Забув пароль?",
      resetPassword: "Відновлення паролю",
      resetPasswordText: "Введіть вашу електронну пошту і ми згенеруємо новий пароль та надішлемо його вам.",
      generatePassword: "Згенерувати пароль",
      generatingPassword: "Генеруємо новий пароль...",
      agreeToTerms: "Я погоджуюся з",
      termsOfService: "умовами використання",
      and: "та",
      privacyPolicy: "політикою конфіденційності"
    },
    
    // Terms of Service
    terms: {
      title: "Умови використання - disCard",
      heading: "Умови використання",
      lastUpdated: "Останнє оновлення: 4 жовтня 2025 року",
      backToHome: "Повернутися на головну",
      sections: {
        important: "ВАЖЛИВО: Використовуючи сервіс disCard, ви приймаєте ці умови в повному обсязі. Якщо ви не згодні з будь-яким пунктом, припиніть використання сервісу.",
        general: {
          title: "1. Загальні положення",
          content1: "1.1. Ці Умови використання регулюють відносини між вами (далі — \"Користувач\") та сервісом disCard (далі — \"Сервіс\", \"ми\").",
          content2: "1.2. Сервіс надається \"як є\" без будь-яких гарантій.",
          content3: "1.3. Ми залишаємо за собою право змінювати ці умови в будь-який момент без попереднього повідомлення."
        },
        description: {
          title: "2. Опис сервісу",
          content1: "2.1. disCard — це веб-додаток для зберігання та управління картками лояльності магазинів.",
          content2: "2.2. Сервіс дозволяє:",
          features: {
            store: "Зберігати інформацію про карти лояльності",
            scan: "Сканувати штрих-коди та QR-коди",
            access: "Отримувати швидкий доступ до карток",
            offline: "Працювати в офлайн-режимі (PWA)"
          }
        },
        disclaimer: {
          title: "3. Відмова від відповідальності",
          noWarranties: "3.1. ВІДСУТНІСТЬ ГАРАНТІЙ",
          noWarrantiesDesc: "Сервіс надається \"як є\" та \"як доступний\". Ми НЕ надаємо жодних гарантій щодо:",
          noWarrantiesList: {
            uptime: "Безперебійної роботи сервісу",
            errors: "Відсутності помилок або збоїв",
            accuracy: "Точності, надійності або повноти інформації",
            expectations: "Відповідності вашим очікуванням",
            compatibility: "Сумісності з вашими пристроями"
          },
          limitations: "3.2. Обмеження відповідальності:",
          limitationsList: {
            damages: "Ми НЕ несемо відповідальності за будь-які прямі, непрямі, випадкові, спеціальні або наслідкові збитки",
            losses: "Ми НЕ несемо відповідальності за втрату даних, прибутку, репутації або інших нематеріальних втрат",
            stores: "Ми НЕ несемо відповідальності за збої в роботі магазинів при використанні карток з додатку",
            risk: "Ви використовуєте сервіс на власний ризик"
          },
          maxLiability: "3.3. Максимальна відповідальність: У будь-якому випадку наша відповідальність обмежена сумою, яку ви сплатили за використання сервісу (якщо сервіс безкоштовний — 0 грн)."
        },
        userResponsibility: {
          title: "4. Відповідальність користувача",
          content1: "4.1. Ви несете повну відповідальність за:",
          responsibilities: {
            accuracy: "Точність внесеної інформації",
            backup: "Збереження власних даних і резервних копій",
            legal: "Використання сервісу відповідно до законодавства",
            security: "Безпеку свого облікового запису та паролів"
          },
          content2: "4.2. Ви зобов'язуєтесь НЕ використовувати сервіс для:",
          prohibitions: {
            illegal: "Незаконних дій",
            rights: "Порушення прав третіх осіб",
            malware: "Розповсюдження шкідливого програмного забезпечення",
            hacking: "Спроб зламати або порушити роботу сервісу"
          }
        },
        privacy: {
          title: "5. Конфіденційність даних",
          content1: "5.1. Ми зберігаємо ваші дані відповідно до Політики конфіденційності.",
          content2: "5.2. Ви надаєте дані на власний розсуд і ризик.",
          content3: "5.3. Ми НЕ гарантуємо абсолютну безпеку даних, хоча докладаємо розумних зусиль для їх захисту."
        },
        ip: {
          title: "6. Права інтелектуальної власності",
          content1: "6.1. Всі права на сервіс, включаючи дизайн, код, логотипи та контент, належать власникам disCard.",
          content2: "6.2. Забороняється копіювання, модифікація або комерційне використання без письмового дозволу."
        },
        termination: {
          title: "7. Припинення надання послуг",
          content1: "7.1. Ми маємо право в будь-який момент:",
          rights: {
            stop: "Припинити роботу сервісу без попередження",
            delete: "Видалити ваш обліковий запис",
            limit: "Обмежити доступ до функціоналу",
            change: "Змінити умови використання"
          },
          content2: "7.2. При припиненні роботи сервісу ми НЕ зобов'язані відшкодовувати будь-які збитки."
        },
        forceMajeure: {
          title: "8. Форс-мажор",
          content1: "8.1. Ми НЕ несемо відповідальності за невиконання зобов'язань через обставини непереборної сили, включаючи:",
          circumstances: {
            natural: "Стихійні лиха",
            war: "Війни, терористичні акти",
            internet: "Збої в роботі інтернет-провайдерів",
            cyber: "Кібератаки",
            legal: "Зміни законодавства",
            third: "Дії третіх осіб"
          }
        },
        feedback: {
          title: "9. Зворотній зв'язок та скарги",
          content1: "9.1. Всі скарги та пропозиції приймаються через форму зворотного зв'язку.",
          content2: "9.2. Ми розглянемо вашу скаргу, але НЕ гарантуємо її задоволення."
        },
        law: {
          title: "10. Застосовне право",
          content1: "10.1. Ці умови регулюються законодавством України.",
          content2: "10.2. Всі спори вирішуються шляхом переговорів, а при неможливості — в судовому порядку за місцем знаходження власника сервісу."
        },
        final: {
          title: "11. Прикінцеві положення",
          content1: "11.1. Недійсність окремих положень цих умов не тягне недійсність інших положень.",
          content2: "11.2. Невикористання нами наших прав не означає відмови від цих прав.",
          content3: "11.3. Продовжуючи використання сервісу після змін в умовах, ви автоматично приймаєте нові умови."
        },
        summary: "ПІДСУМОК: Використовуючи disCard, ви приймаєте всі ризики та відповідальність. Сервіс надається безкоштовно без будь-яких гарантій. Власники сервісу НЕ несуть відповідальності за будь-які збитки."
      }
    },

    // Privacy Policy
    privacy: {
      title: "Політика конфіденційності - disCard",
      heading: "Політика конфіденційності",
      lastUpdated: "Останнє оновлення: 4 жовтня 2025 року",
      backToHome: "Повернутися на головну",
      sections: {
        summary: "Коротко: Ми збираємо мінімальні дані, необхідні для роботи сервісу. Не продаємо ваші дані третім особам. Ви використовуєте сервіс на власний ризик.",
        general: {
          title: "1. Загальна інформація",
          content1: "1.1. Ця Політика конфіденційності описує, як ми збираємо, використовуємо та захищаємо вашу персональну інформацію при використанні сервісу disCard.",
          content2: "1.2. Використовуючи сервіс, ви погоджуєтесь з умовами цієї політики."
        },
        dataCollection: {
          title: "2. Які дані ми збираємо",
          required: {
            title: "2.1. Обов'язкові дані",
            email: "Email адреса — для реєстрації та авторизації",
            password: "Пароль — зберігається в зашифрованому вигляді (bcrypt)",
            cards: "Дані карток лояльності — назва магазину, номер картки, штрих-код"
          },
          automatic: {
            title: "2.2. Автоматично зібрані дані",
            ip: "IP-адреса",
            device: "Інформація про пристрій і браузер",
            time: "Дата та час використання сервісу",
            cookies: "Cookies та локальні дані (localStorage)"
          },
          optional: {
            title: "2.3. Необов'язкові дані",
            name: "Ім'я користувача (якщо вказане)",
            photos: "Фотографії карток (якщо завантажені)"
          }
        },
        dataUsage: {
          title: "3. Як ми використовуємо ваші дані",
          content1: "3.1. Ми використовуємо зібрані дані для:",
          purposes: {
            access: "Надання доступу до сервісу",
            storage: "Зберігання ваших карток лояльності",
            improvement: "Покращення функціоналу додатку",
            support: "Технічної підтримки",
            security: "Забезпечення безпеки",
            legal: "Виконання законодавчих вимог"
          },
          content2: "3.2. Ми НЕ використовуємо дані для:",
          notUsedFor: {
            selling: "Продажу третім особам",
            spam: "Спаму або нав'язливої реклами",
            ads: "Передачі рекламним мережам (без вашої згоди)"
          }
        },
        security: {
          title: "4. Захист даних",
          important: "ВАЖЛИВО: Ми докладаємо розумних зусиль для захисту ваших даних, але НЕ можемо гарантувати абсолютну безпеку.",
          content1: "4.1. Заходи безпеки:",
          measures: {
            encryption: "Шифрування паролів (bcrypt)",
            https: "HTTPS з'єднання",
            cardEncryption: "Шифрування даних карток",
            jwt: "JWT токени для авторизації",
            rateLimit: "Rate limiting (обмеження кількості запитів)",
            sqlProtection: "Захист від SQL-ін'єкцій"
          },
          content2: "4.2. Обмеження:",
          limitations: {
            noMethod: "Жоден метод передачі даних не є 100% безпечним",
            userResponsibility: "Ви несете відповідальність за збереження паролів",
            deviceSecurity: "При злому вашого пристрою дані можуть бути скомпрометовані"
          }
        },
        cookies: {
          title: "5. Cookies та локальне сховище",
          content1: "5.1. Ми використовуємо:",
          types: {
            localStorage: "localStorage — для зберігання JWT токенів та налаштувань",
            cookies: "Cookies — для відстеження сесій",
            analytics: "Google Analytics — для аналізу відвідуваності (якщо ввімкнено)"
          },
          content2: "5.2. Ви можете відключити cookies в налаштуваннях браузера, але це може обмежити функціонал."
        },
        thirdParty: {
          title: "6. Передача даних третім особам",
          content1: "6.1. Ми можемо передавати дані:",
          parties: {
            hosting: "Хостинг-провайдерам — для зберігання даних на серверах",
            analytics: "Аналітичним сервісам — Google Analytics (знеособлені дані)",
            law: "Правоохоронним органам — за законною вимогою"
          },
          content2: "6.2. Ми НЕ продаємо та не орендуємо ваші персональні дані."
        },
        rights: {
          title: "7. Ваші права",
          content1: "7.1. Ви маєте право:",
          list: {
            copy: "Отримати копію своїх даних",
            correct: "Виправити неточні дані",
            delete: "Видалити свій обліковий запис",
            limit: "Обмежити обробку даних",
            revoke: "Відкликати згоду на обробку"
          },
          content2: "7.2. Для реалізації прав зверніться через форму зворотного зв'язку."
        },
        retention: {
          title: "8. Зберігання даних",
          content1: "8.1. Ми зберігаємо ваші дані поки:",
          conditions: {
            using: "Ви використовуєте сервіс",
            legal: "Це необхідно для виконання законодавчих вимог",
            account: "Ви не видалите свій обліковий запис"
          },
          content2: "8.2. Після видалення облікового запису дані видаляються протягом 30 днів.",
          content3: "8.3. Резервні копії можуть зберігатися до 90 днів."
        },
        children: {
          title: "9. Діти",
          content1: "9.1. Сервіс призначений для осіб старше 16 років.",
          content2: "9.2. Ми свідомо не збираємо дані дітей до 16 років.",
          content3: "9.3. Якщо ви батьки/опікуни — повідомте нас про використання сервісу дитиною."
        },
        international: {
          title: "10. Міжнародна передача даних",
          content1: "10.1. Дані можуть зберігатися на серверах в різних країнах.",
          content2: "10.2. Використовуючи сервіс, ви погоджуєтесь на міжнародну передачу даних."
        },
        changes: {
          title: "11. Зміни в політиці",
          content1: "11.1. Ми маємо право змінювати цю політику в будь-який момент.",
          content2: "11.2. Про суттєві зміни ми повідомимо через email або повідомлення в додатку.",
          content3: "11.3. Продовження використання сервісу після змін означає вашу згоду."
        },
        contact: {
          title: "12. Контактна інформація",
          content1: "З питань конфіденційності звертайтесь:",
          form: "Форма зв'язку: <a href=\"/contact\" style=\"color: var(--primary);\">Контакти</a>"
        },
        finalSummary: "ПІДСУМОК: Ми збираємо мінімально необхідні дані, захищаємо їх та не продаємо третім особам. Ви можете в будь-який момент видалити свій обліковий запис. Використання сервісу на власний ризик.",
        finalSummaryTitle: "ПІДСУМОК:"
      }
    },

    // Common
    common: {
      cancel: "Скасувати",
      ok: "OK",
      save: "Зберегти"
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
      enterAllDigits: "Введіть усі 5 цифр коду"
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
      cardColor: "Колір картки",
      cardCode: "Код картки",
      codeType: "Тип коду",
      barcode: "Штрих-код",
      qrcode: "QR-код",
      preview: "Превью коду",
      saveCard: "Зберегти картку",
      cancel: "Скасувати",
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
      mustAgreeToTerms: "Необхідно погодитися з умовами використання та політикою конфіденційності",
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
    
    // Blog
    blog: {
      title: "Blog - disCard",
      pageTitle: "Blog",
      subtitle: "Tips, news and guides about loyalty cards",
      readTime: "min read",
      noResults: "Nothing found",
      filters: {
        all: "All",
        tips: "Tips",
        news: "News",
        guides: "Guides"
      },
      categories: {
        tips: "Tips",
        news: "News",
        guides: "Guides",
        other: "Other"
      }
    },
    
    // Contact
    contact: {
      title: "Contact - disCard",
      heading: "Contact Us",
      subtitle: "Have questions or suggestions? We're always happy to help!",
      form: {
        heading: "Contact Form",
        email: "Email",
        emailPlaceholder: "your@email.com",
        subject: "Subject",
        subjectPlaceholder: "Subject of your message",
        message: "Message",
        messagePlaceholder: "Describe your question or suggestion",
        submit: "Send",
        success: "Message sent successfully!",
        error: "Sending error. Try again later.",
        subjects: {
          support: "Support",
          feedback: "Feedback",
          bug: "Bug Report",
          feature: "Feature Request",
          other: "Other"
        }
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
    
    // FAQ
    faq: {
      title: "FAQ - Frequently Asked Questions",
      heading: "Frequently Asked Questions",
      subtitle: "Find answers to the most common questions about disCard",
      searchPlaceholder: "🔍 Search questions...",
      noResults: "Nothing found. Try another query.",
      items: {
        what_is_discard: {
          question: "What is disCard?",
          answer: "disCard is a modern Progressive Web App (PWA) for storing and managing store loyalty cards. It allows you to store all your cards in one place, scan barcodes and QR codes, and use them even without internet."
        },
        is_free: {
          question: "Is disCard free?",
          answer: "Yes, disCard is completely free to use. There are no hidden fees, subscriptions, or limitations. All features are available for free."
        },
        how_to_install: {
          question: "How to install disCard on phone?",
          answer: "Open the website in Safari (iOS) or Chrome (Android), tap the browser menu and select \"Add to Home screen\" or \"Install app\". The app will install like a regular program."
        },
        works_offline: {
          question: "Does disCard work without internet?",
          answer: "Yes! After installation, disCard works completely offline. You can view and use all saved cards even without internet connection."
        },
        supported_codes: {
          question: "What code types does disCard support?",
          answer: "disCard supports barcodes and QR codes. You can scan codes with camera or enter them manually."
        },
        how_to_add_card: {
          question: "How to add a new card?",
          answer: "Click \"Add card\" button, enter store name, then either scan the code with camera or enter it manually. Choose card color and save."
        },
        is_safe: {
          question: "Is it safe to store cards in disCard?",
          answer: "Yes, it's completely safe. All data is stored locally on your device with encryption. No one has access to your cards except you."
        },
        sync_devices: {
          question: "Do cards sync between devices?",
          answer: "Current version stores data locally on each device. Synchronization between devices is planned for future versions."
        },
        code_wont_scan: {
          question: "What to do if code won't scan?",
          answer: "Try improving lighting, cleaning the camera, or enter the code manually. Make sure you've allowed camera access."
        },
        how_many_cards: {
          question: "How many cards can be stored?",
          answer: "There are no limits on the number of cards. You can store as many cards as you need."
        },
        how_to_use_in_store: {
          question: "How to use cards in store?",
          answer: "Open disCard, find the needed card and show the barcode or QR code to the cashier for scanning."
        },
        registration_required: {
          question: "Is registration required?",
          answer: "No, registration is not required. You can use disCard without creating an account, but registration allows storing cards in the cloud."
        },
        forgot_password: {
          question: "What to do if I forgot my password?",
          answer: "Click \"Forgot password?\" on the login page, enter your email, and you'll receive a new generated password."
        },
        can_delete_card: {
          question: "Can I delete a card?",
          answer: "Yes, you can delete any card. Click on the card, then the \"Delete\" button and confirm the action."
        },
        dark_theme_support: {
          question: "Does disCard support dark theme?",
          answer: "Yes, disCard supports both light and dark themes. You can switch themes in settings or the app automatically adapts to system theme."
        },
        pwa_vs_regular: {
          question: "How is PWA different from regular app?",
          answer: "PWA is a web technology that allows apps to work like native programs: offline access, fast loading, installation without app stores."
        },
        data_collection: {
          question: "What data does disCard collect?",
          answer: "disCard doesn't collect personal data. All your cards are stored locally on your device. We may collect anonymous analytics to improve the app."
        },
        change_language: {
          question: "How to change interface language?",
          answer: "Language can be changed in the top right corner of the page by clicking the \"UK/EN\" toggle."
        },
        contact_support: {
          question: "How to contact support?",
          answer: "You can write to us through the form on the \"Contact\" page or send an email to discardmessage@gmail.com"
        },
        export_data: {
          question: "Can I export data?",
          answer: "Export feature is planned for future versions. Currently you can make a backup through account settings."
        },
        technical_issues: {
          question: "What to do with technical issues?",
          answer: "Try refreshing the page, clearing browser cache or reinstalling PWA. If the problem persists, contact support."
        }
      }
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
      },
      legal: {
        title: "Legal Information",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        contact: "Feedback"
      },
      quickLinks: {
        terms: "Terms",
        privacy: "Privacy"
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
      resetPassword: "Password Recovery",
      resetPasswordText: "Enter your email address and we will generate a new password and send it to you.",
      generatePassword: "Generate Password",
      generatingPassword: "Generating new password...",
      agreeToTerms: "I agree to the",
      termsOfService: "terms of service",
      and: "and",
      privacyPolicy: "privacy policy"
    },
    
    // Terms of Service
    terms: {
      title: "Terms of Service - disCard",
      heading: "Terms of Service",
      lastUpdated: "Last updated: October 4, 2025",
      backToHome: "Back to Home",
      sections: {
        important: "IMPORTANT: By using the disCard service, you accept these terms in full. If you disagree with any point, stop using the service.",
        general: {
          title: "1. General Provisions",
          content1: "1.1. These Terms of Service govern the relationship between you (hereinafter - \"User\") and the disCard service (hereinafter - \"Service\", \"we\").",
          content2: "1.2. The service is provided \"as is\" without any warranties.",
          content3: "1.3. We reserve the right to change these terms at any time without prior notice."
        },
        description: {
          title: "2. Service Description",
          content1: "2.1. disCard is a web application for storing and managing store loyalty cards.",
          content2: "2.2. The service allows:",
          features: {
            store: "Store loyalty card information",
            scan: "Scan barcodes and QR codes",
            access: "Get quick access to cards",
            offline: "Work in offline mode (PWA)"
          }
        },
        disclaimer: {
          title: "3. Disclaimer",
          noWarranties: "3.1. NO WARRANTIES",
          noWarrantiesDesc: "The service is provided \"as is\" and \"as available\". We do NOT provide any warranties regarding:",
          noWarrantiesList: {
            uptime: "Uninterrupted service operation",
            errors: "Absence of errors or failures",
            accuracy: "Accuracy, reliability or completeness of information",
            expectations: "Meeting your expectations",
            compatibility: "Compatibility with your devices"
          },
          limitations: "3.2. Limitation of liability:",
          limitationsList: {
            damages: "We are NOT liable for any direct, indirect, incidental, special or consequential damages",
            losses: "We are NOT liable for loss of data, profit, reputation or other intangible losses",
            stores: "We are NOT liable for store failures when using cards from the app",
            risk: "You use the service at your own risk"
          },
          maxLiability: "3.3. Maximum liability: In any case, our liability is limited to the amount you paid for using the service (if the service is free - $0)."
        },
        userResponsibility: {
          title: "4. User Responsibility",
          content1: "4.1. You bear full responsibility for:",
          responsibilities: {
            accuracy: "Accuracy of entered information",
            backup: "Storing your own data and backups",
            legal: "Using the service in accordance with the law",
            security: "Security of your account and passwords"
          },
          content2: "4.2. You undertake NOT to use the service for:",
          prohibitions: {
            illegal: "Illegal actions",
            rights: "Violating the rights of third parties",
            malware: "Distributing malicious software",
            hacking: "Attempts to hack or disrupt the service"
          }
        },
        privacy: {
          title: "5. Data Privacy",
          content1: "5.1. We store your data in accordance with the Privacy Policy.",
          content2: "5.2. You provide data at your own discretion and risk.",
          content3: "5.3. We do NOT guarantee absolute data security, although we make reasonable efforts to protect it."
        },
        ip: {
          title: "6. Intellectual Property Rights",
          content1: "6.1. All rights to the service, including design, code, logos and content, belong to the owners of disCard.",
          content2: "6.2. Copying, modification or commercial use without written permission is prohibited."
        },
        termination: {
          title: "7. Service Termination",
          content1: "7.1. We have the right at any time to:",
          rights: {
            stop: "Stop the service without warning",
            delete: "Delete your account",
            limit: "Limit access to functionality",
            change: "Change terms of use"
          },
          content2: "7.2. Upon termination of the service, we are NOT obligated to compensate for any damages."
        },
        forceMajeure: {
          title: "8. Force Majeure",
          content1: "8.1. We are NOT liable for non-performance of obligations due to force majeure circumstances, including:",
          circumstances: {
            natural: "Natural disasters",
            war: "Wars, terrorist acts",
            internet: "Internet provider failures",
            cyber: "Cyber attacks",
            legal: "Changes in legislation",
            third: "Actions of third parties"
          }
        },
        feedback: {
          title: "9. Feedback and Complaints",
          content1: "9.1. All complaints and suggestions are accepted through the feedback form.",
          content2: "9.2. We will review your complaint, but do NOT guarantee its satisfaction."
        },
        law: {
          title: "10. Applicable Law",
          content1: "10.1. These terms are governed by the laws of Ukraine.",
          content2: "10.2. All disputes are resolved through negotiations, and if impossible - in court at the location of the service owner."
        },
        final: {
          title: "11. Final Provisions",
          content1: "11.1. The invalidity of individual provisions of these terms does not entail the invalidity of other provisions.",
          content2: "11.2. Our non-use of our rights does not mean waiving those rights.",
          content3: "11.3. By continuing to use the service after changes to the terms, you automatically accept the new terms."
        },
        summary: "SUMMARY: By using disCard, you accept all risks and responsibilities. The service is provided free of charge without any warranties. Service owners are NOT liable for any damages."
      }
    },

    // Privacy Policy
    privacy: {
      title: "Privacy Policy - disCard",
      heading: "Privacy Policy",
      lastUpdated: "Last updated: October 4, 2025",
      backToHome: "Back to Home",
      sections: {
        summary: "In short: We collect minimal data necessary for the service to work. We do not sell your data to third parties. You use the service at your own risk.",
        general: {
          title: "1. General Information",
          content1: "1.1. This Privacy Policy describes how we collect, use and protect your personal information when using the disCard service.",
          content2: "1.2. By using the service, you agree to the terms of this policy."
        },
        dataCollection: {
          title: "2. What Data We Collect",
          required: {
            title: "2.1. Required Data",
            email: "Email address — for registration and authorization",
            password: "Password — stored in encrypted form (bcrypt)",
            cards: "Loyalty card data — store name, card number, barcode"
          },
          automatic: {
            title: "2.2. Automatically Collected Data",
            ip: "IP address",
            device: "Device and browser information",
            time: "Date and time of service use",
            cookies: "Cookies and local data (localStorage)"
          },
          optional: {
            title: "2.3. Optional Data",
            name: "Username (if provided)",
            photos: "Card photos (if uploaded)"
          }
        },
        dataUsage: {
          title: "3. How We Use Your Data",
          content1: "3.1. We use collected data for:",
          purposes: {
            access: "Providing access to the service",
            storage: "Storing your loyalty cards",
            improvement: "Improving app functionality",
            support: "Technical support",
            security: "Ensuring security",
            legal: "Fulfilling legal requirements"
          },
          content2: "3.2. We do NOT use data for:",
          notUsedFor: {
            selling: "Selling to third parties",
            spam: "Spam or intrusive advertising",
            ads: "Sharing with advertising networks (without your consent)"
          }
        },
        security: {
          title: "4. Data Protection",
          important: "IMPORTANT: We make reasonable efforts to protect your data, but CANNOT guarantee absolute security.",
          content1: "4.1. Security measures:",
          measures: {
            encryption: "Password encryption (bcrypt)",
            https: "HTTPS connections",
            cardEncryption: "Card data encryption",
            jwt: "JWT tokens for authorization",
            rateLimit: "Rate limiting",
            sqlProtection: "Protection against SQL injections"
          },
          content2: "4.2. Limitations:",
          limitations: {
            noMethod: "No data transmission method is 100% secure",
            userResponsibility: "You are responsible for keeping passwords safe",
            deviceSecurity: "If your device is compromised, data may be at risk"
          }
        },
        cookies: {
          title: "5. Cookies and Local Storage",
          content1: "5.1. We use:",
          types: {
            localStorage: "localStorage — for storing JWT tokens and settings",
            cookies: "Cookies — for session tracking",
            analytics: "Google Analytics — for traffic analysis (if enabled)"
          },
          content2: "5.2. You can disable cookies in browser settings, but this may limit functionality."
        },
        thirdParty: {
          title: "6. Third Party Data Sharing",
          content1: "6.1. We may share data with:",
          parties: {
            hosting: "Hosting providers — for storing data on servers",
            analytics: "Analytics services — Google Analytics (anonymized data)",
            law: "Law enforcement — upon legal request"
          },
          content2: "6.2. We do NOT sell or rent your personal data."
        },
        rights: {
          title: "7. Your Rights",
          content1: "7.1. You have the right to:",
          list: {
            copy: "Get a copy of your data",
            correct: "Correct inaccurate data",
            delete: "Delete your account",
            limit: "Restrict data processing",
            revoke: "Withdraw consent to processing"
          },
          content2: "7.2. To exercise your rights, contact us through the feedback form."
        },
        retention: {
          title: "8. Data Retention",
          content1: "8.1. We store your data while:",
          conditions: {
            using: "You use the service",
            legal: "It is necessary to fulfill legal requirements",
            account: "You do not delete your account"
          },
          content2: "8.2. After account deletion, data is deleted within 30 days.",
          content3: "8.3. Backups may be stored for up to 90 days."
        },
        children: {
          title: "9. Children",
          content1: "9.1. The service is intended for persons over 16 years old.",
          content2: "9.2. We do not knowingly collect data from children under 16.",
          content3: "9.3. If you are a parent/guardian — notify us about a child's use of the service."
        },
        international: {
          title: "10. International Data Transfer",
          content1: "10.1. Data may be stored on servers in different countries.",
          content2: "10.2. By using the service, you agree to international data transfer."
        },
        changes: {
          title: "11. Policy Changes",
          content1: "11.1. We have the right to change this policy at any time.",
          content2: "11.2. We will notify about significant changes via email or app notification.",
          content3: "11.3. Continued use of the service after changes means your consent."
        },
        contact: {
          title: "12. Contact Information",
          content1: "For privacy questions contact:",
          form: "Contact form: <a href=\"/contact\" style=\"color: var(--primary);\">Contacts</a>"
        },
        finalSummary: "SUMMARY: We collect minimally necessary data, protect it and do not sell to third parties. You can delete your account at any time. Use of the service is at your own risk.",
        finalSummaryTitle: "SUMMARY:"
      }
    },

    // Common
    common: {
      cancel: "Cancel",
      ok: "OK",
      save: "Save"
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
      enterAllDigits: "Enter all 5 digits of the code"
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
      cardColor: "Card color",
      cardCode: "Card code",
      codeType: "Code type",
      barcode: "Barcode",
      qrcode: "QR code",
      preview: "Code preview",
      saveCard: "Save card",
      cancel: "Cancel",
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
      mustAgreeToTerms: "You must agree to the terms of service and privacy policy",
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