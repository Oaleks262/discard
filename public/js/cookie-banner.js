// Cookie Banner (GDPR Compliance)

class CookieBanner {
    constructor() {
        this.cookieName = 'discard_cookie_consent';
        this.cookieExpireDays = 365;
        this.init();
    }

    init() {
        // Перевірити чи вже є згода
        if (this.hasConsent()) {
            return;
        }

        // Показати банер через невелику затримку
        setTimeout(() => {
            this.showBanner();
        }, 1000);
    }

    hasConsent() {
        return this.getCookie(this.cookieName) !== null;
    }

    showBanner() {
        // Створити HTML банера
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <p>
                        🍪 Ми використовуємо файли cookie для покращення вашого досвіду.
                        Продовжуючи користуватися сайтом, ви погоджуєтеся з
                        <a href="/privacy-policy.html" target="_blank">політикою конфіденційності</a>.
                    </p>
                </div>
                <div class="cookie-banner-buttons">
                    <button id="cookie-accept" class="cookie-btn cookie-btn-accept">Прийняти</button>
                    <button id="cookie-decline" class="cookie-btn cookie-btn-decline">Відхилити</button>
                </div>
            </div>
        `;

        // Додати стилі
        this.addStyles();

        // Додати на сторінку
        document.body.appendChild(banner);

        // Обробники подій
        document.getElementById('cookie-accept').addEventListener('click', () => this.acceptCookies());
        document.getElementById('cookie-decline').addEventListener('click', () => this.declineCookies());
    }

    addStyles() {
        if (document.getElementById('cookie-banner-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'cookie-banner-styles';
        styles.textContent = `
            #cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: var(--surface, #ffffff);
                border-top: 1px solid var(--border, #e5e7eb);
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                animation: slideUp 0.3s ease-out;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }

            .cookie-banner-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
            }

            .cookie-banner-text {
                flex: 1;
            }

            .cookie-banner-text p {
                margin: 0;
                color: var(--text-secondary, #6b7280);
                font-size: 0.875rem;
                line-height: 1.5;
            }

            .cookie-banner-text a {
                color: var(--primary, #0066FF);
                text-decoration: underline;
            }

            .cookie-banner-buttons {
                display: flex;
                gap: 0.75rem;
                flex-shrink: 0;
            }

            .cookie-btn {
                padding: 0.625rem 1.25rem;
                border-radius: 8px;
                font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }

            .cookie-btn-accept {
                background-color: var(--primary, #0066FF);
                color: white;
            }

            .cookie-btn-accept:hover {
                background-color: var(--primary-hover, #0052cc);
            }

            .cookie-btn-decline {
                background-color: transparent;
                color: var(--text-secondary, #6b7280);
                border: 1px solid var(--border, #e5e7eb);
            }

            .cookie-btn-decline:hover {
                background-color: var(--surface, #f9fafb);
            }

            @media (max-width: 768px) {
                .cookie-banner-content {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 1rem;
                }

                .cookie-banner-buttons {
                    width: 100%;
                }

                .cookie-btn {
                    flex: 1;
                }
            }

            [data-theme="dark"] #cookie-banner {
                background-color: #1a1a1a;
                border-top-color: #333;
            }

            [data-theme="dark"] .cookie-banner-text p {
                color: #9ca3af;
            }

            [data-theme="dark"] .cookie-btn-decline {
                color: #9ca3af;
                border-color: #333;
            }

            [data-theme="dark"] .cookie-btn-decline:hover {
                background-color: #2a2a2a;
            }
        `;

        document.head.appendChild(styles);
    }

    acceptCookies() {
        this.setCookie(this.cookieName, 'accepted', this.cookieExpireDays);
        this.removeBanner();

        // Увімкнути аналітику та інші трекери
        if (window.analytics && !window.analytics.initialized) {
            window.analytics.loadSettings();
        }
        if (window.adsense && !window.adsense.initialized) {
            window.adsense.loadSettings();
        }
    }

    declineCookies() {
        this.setCookie(this.cookieName, 'declined', this.cookieExpireDays);
        this.removeBanner();

        // Не завантажувати аналітику та трекери
        console.log('User declined cookies');
    }

    removeBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    // Cookie helpers
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}

// Автоматично ініціалізувати при завантаженні
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CookieBanner();
    });
} else {
    new CookieBanner();
}
