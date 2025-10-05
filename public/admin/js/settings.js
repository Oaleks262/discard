// Управління налаштуваннями

// Завантаження налаштувань
async function loadSettings() {
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('error-message');

    loader.classList.remove('hidden');
    errorDiv.classList.add('hidden');

    try {
        const response = await authFetch('/api/settings/admin');

        if (!response || !response.ok) {
            throw new Error('Помилка завантаження налаштувань');
        }

        const settings = await response.json();

        // Заповнити форму
        document.getElementById('siteName').value = settings.siteName || '';
        document.getElementById('siteDescription').value = settings.siteDescription || '';
        document.getElementById('contactEmail').value = settings.contactEmail || '';
        document.getElementById('metaTitle').value = settings.metaTitle || '';
        document.getElementById('metaDescription').value = settings.metaDescription || '';
        document.getElementById('metaKeywords').value = settings.metaKeywords || '';
        document.getElementById('adsEnabled').checked = settings.adsEnabled || false;
        document.getElementById('adsenseClientId').value = settings.adsenseClientId || '';
        document.getElementById('analyticsId').value = settings.analyticsId || '';
        document.getElementById('socialFacebook').value = (settings.social && settings.social.facebook) || '';
        document.getElementById('socialInstagram').value = (settings.social && settings.social.instagram) || '';
        document.getElementById('socialTelegram').value = (settings.social && settings.social.telegram) || '';

    } catch (error) {
        console.error('Load settings error:', error);
        errorDiv.textContent = 'Помилка завантаження налаштувань';
        errorDiv.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
    }
}

// Збереження налаштувань
async function saveSettings() {
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');

    loader.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    try {
        const settingsData = {
            siteName: document.getElementById('siteName').value,
            siteDescription: document.getElementById('siteDescription').value,
            contactEmail: document.getElementById('contactEmail').value,
            metaTitle: document.getElementById('metaTitle').value,
            metaDescription: document.getElementById('metaDescription').value,
            metaKeywords: document.getElementById('metaKeywords').value,
            adsEnabled: document.getElementById('adsEnabled').checked,
            adsenseClientId: document.getElementById('adsenseClientId').value,
            analyticsId: document.getElementById('analyticsId').value,
            social: {
                facebook: document.getElementById('socialFacebook').value,
                instagram: document.getElementById('socialInstagram').value,
                telegram: document.getElementById('socialTelegram').value
            }
        };

        const response = await authFetch('/api/settings/admin', {
            method: 'PUT',
            body: JSON.stringify(settingsData)
        });

        if (!response || !response.ok) {
            throw new Error('Помилка збереження налаштувань');
        }

        successDiv.textContent = 'Налаштування успішно збережено!';
        successDiv.classList.remove('hidden');

        // Сховати повідомлення через 3 секунди
        setTimeout(() => {
            successDiv.classList.add('hidden');
        }, 3000);

    } catch (error) {
        console.error('Save settings error:', error);
        errorDiv.textContent = 'Помилка збереження налаштувань';
        errorDiv.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
    }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadSettings();
});
