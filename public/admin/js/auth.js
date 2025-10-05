// Утиліти для автентифікації адміністратора

// Перевірка чи користувач залогінений
function checkAuth() {
    const token = localStorage.getItem('adminToken');

    if (!token) {
        window.location.href = '/admin/login.html';
        return null;
    }

    return token;
}

// API запит з автентифікацією
async function authFetch(url, options = {}) {
    const token = checkAuth();

    if (!token) return null;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        // Якщо токен невалідний - перенаправити на логін
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login.html';
            return null;
        }

        return response;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Logout
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login.html';
}

// Ініціалізація logout кнопки
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Theme Management (відповідає ThemeManager.js з основного додатку)
class AdminThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
    }

    init() {
        this.applyTheme(this.theme);
        this.setupToggle();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        localStorage.setItem('theme', theme);

        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    setupToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Ініціалізація теми
const themeManager = new AdminThemeManager();
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
});
