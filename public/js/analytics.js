// Google Analytics (GA4) Integration

class Analytics {
    constructor() {
        this.gaId = null;
        this.initialized = false;
        this.loadSettings();
    }

    // Завантажити налаштування GA з Settings
    async loadSettings() {
        try {
            const response = await fetch('/api/settings/public');
            if (response.ok) {
                const data = await response.json();
                const settings = data.settings;

                if (settings?.googleAnalytics?.enabled && settings.googleAnalytics.measurementId) {
                    this.gaId = settings.googleAnalytics.measurementId;
                    this.initGA();
                }
            }
        } catch (error) {
            console.error('Analytics settings load error:', error);
        }
    }

    // Ініціалізація Google Analytics
    initGA() {
        if (!this.gaId || this.initialized) return;

        // Завантажити GA4 скрипт
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
        document.head.appendChild(script);

        // Ініціалізувати gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', this.gaId, {
            'anonymize_ip': true, // GDPR compliance
            'cookie_flags': 'SameSite=None;Secure'
        });

        this.initialized = true;
    }

    // Відправити подію
    trackEvent(eventName, params = {}) {
        if (!this.initialized || !window.gtag) return;

        window.gtag('event', eventName, params);
    }

    // Відстежити перегляд сторінки
    trackPageView(pagePath, pageTitle) {
        if (!this.initialized || !window.gtag) return;

        window.gtag('event', 'page_view', {
            page_path: pagePath,
            page_title: pageTitle
        });
    }

    // Відстежити клік по кнопці
    trackButtonClick(buttonName, category = 'engagement') {
        this.trackEvent('button_click', {
            button_name: buttonName,
            event_category: category
        });
    }

    // Відстежити додавання картки
    trackCardAdded(cardType) {
        this.trackEvent('card_added', {
            card_type: cardType,
            event_category: 'cards'
        });
    }

    // Відстежити сканування QR/штрих-коду
    trackScan(scanType) {
        this.trackEvent('scan_performed', {
            scan_type: scanType, // 'qr' або 'barcode'
            event_category: 'engagement'
        });
    }

    // Відстежити зміну теми
    trackThemeChange(theme) {
        this.trackEvent('theme_change', {
            theme: theme, // 'light' або 'dark'
            event_category: 'settings'
        });
    }

    // Відстежити помилку
    trackError(errorMessage, errorLocation) {
        this.trackEvent('error', {
            error_message: errorMessage,
            error_location: errorLocation,
            event_category: 'errors'
        });
    }
}

// Глобальний instance
window.analytics = new Analytics();
