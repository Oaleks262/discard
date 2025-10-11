// Google AdSense Integration

class AdSense {
    constructor() {
        this.publisherId = null;
        this.autoAdsEnabled = false;
        this.initialized = false;
        this.loadSettings();
    }

    // Завантажити налаштування AdSense з Settings
    async loadSettings() {
        try {
            const response = await fetch('/api/settings/public');
            if (response.ok) {
                const data = await response.json();
                const settings = data.settings;

                if (settings?.googleAdSense?.enabled && settings.googleAdSense.publisherId) {
                    this.publisherId = settings.googleAdSense.publisherId;
                    this.autoAdsEnabled = settings.googleAdSense.autoAds || false;
                    this.initAdSense();
                }
            }
        } catch (error) {
            console.error('AdSense settings load error:', error);
        }
    }

    // Ініціалізація Google AdSense
    initAdSense() {
        if (!this.publisherId || this.initialized) return;

        // Auto Ads (якщо увімкнено)
        if (this.autoAdsEnabled) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.publisherId}`;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
        }

        this.initialized = true;
    }

    // Створити блок реклами
    createAdBlock(options = {}) {
        if (!this.initialized) return null;

        const {
            slot = '', // Ad slot ID
            format = 'auto',
            responsive = true,
            style = {}
        } = options;

        const adContainer = document.createElement('div');
        adContainer.style.margin = '20px 0';
        adContainer.style.textAlign = 'center';

        // Застосувати кастомні стилі
        Object.assign(adContainer.style, style);

        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', this.publisherId);

        if (slot) {
            ins.setAttribute('data-ad-slot', slot);
        }

        ins.setAttribute('data-ad-format', format);

        if (responsive) {
            ins.setAttribute('data-full-width-responsive', 'true');
        }

        adContainer.appendChild(ins);

        // Push ad
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.error('AdSense push error:', error);
        }

        return adContainer;
    }

    // Вставити рекламу в елемент
    insertAd(elementId, options = {}) {
        if (!this.initialized) return;

        const element = document.getElementById(elementId);
        if (!element) {
            console.error('AdSense: Element not found:', elementId);
            return;
        }

        const adBlock = this.createAdBlock(options);
        if (adBlock) {
            element.appendChild(adBlock);
        }
    }

    // Display Ad (для статей блогу)
    insertDisplayAd(elementId) {
        this.insertAd(elementId, {
            format: 'auto',
            responsive: true
        });
    }

    // In-Article Ad (всередині статті)
    insertInArticleAd(elementId) {
        this.insertAd(elementId, {
            format: 'fluid',
            responsive: false,
            style: {
                display: 'block',
                textAlign: 'center'
            }
        });
    }

    // In-Feed Ad (в списку статей)
    insertInFeedAd(elementId) {
        this.insertAd(elementId, {
            format: 'fluid',
            layout: 'in-article',
            responsive: false
        });
    }
}

// Глобальний instance
window.adsense = new AdSense();
