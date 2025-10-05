// Управління користувачами

let currentPage = 1;
let totalPages = 1;
let searchQuery = '';
let searchTimeout = null;

// Завантаження користувачів
async function loadUsers(page = 1, search = '') {
    const tbody = document.getElementById('usersTableBody');
    const errorDiv = document.getElementById('error-message');

    errorDiv.classList.add('hidden');

    try {
        const url = `/api/admin/users?page=${page}&limit=20&search=${encodeURIComponent(search)}`;
        const response = await authFetch(url);

        if (!response || !response.ok) {
            throw new Error('Помилка завантаження користувачів');
        }

        const data = await response.json();

        currentPage = data.currentPage;
        totalPages = data.totalPages;

        renderUsersTable(data.users);
        renderPagination(data.totalPages, data.currentPage);

    } catch (error) {
        console.error('Load users error:', error);
        errorDiv.textContent = 'Помилка завантаження користувачів';
        errorDiv.classList.remove('hidden');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: var(--spacing-xl);">Помилка завантаження</td></tr>';
    }
}

// Відображення таблиці користувачів
function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');

    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: var(--spacing-xl);">Користувачів не знайдено</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user._id.substring(0, 8)}...</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>${user.cardsCount || 0}</td>
            <td>
                <button onclick="viewUser('${user._id}')" class="btn-outline" style="padding: 0.5rem 1rem; margin-right: 0.5rem;">Переглянути</button>
                <button onclick="deleteUser('${user._id}', '${escapeHtml(user.name)}')" class="btn-danger" style="padding: 0.5rem 1rem;">Видалити</button>
            </td>
        </tr>
    `).join('');
}

// Відображення пагінації
function renderPagination(total, current) {
    const pagination = document.getElementById('pagination');

    if (total <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';

    // Попередня сторінка
    html += `<button ${current === 1 ? 'disabled' : ''} onclick="loadUsers(${current - 1}, '${searchQuery}')">‹ Попередня</button>`;

    // Номери сторінок
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
        html += `<button onclick="loadUsers(1, '${searchQuery}')">1</button>`;
        if (start > 2) html += `<span style="padding: 0 0.5rem;">...</span>`;
    }

    for (let i = start; i <= end; i++) {
        html += `<button class="${i === current ? 'active' : ''}" onclick="loadUsers(${i}, '${searchQuery}')">${i}</button>`;
    }

    if (end < total) {
        if (end < total - 1) html += `<span style="padding: 0 0.5rem;">...</span>`;
        html += `<button onclick="loadUsers(${total}, '${searchQuery}')">${total}</button>`;
    }

    // Наступна сторінка
    html += `<button ${current === total ? 'disabled' : ''} onclick="loadUsers(${current + 1}, '${searchQuery}')">Наступна ›</button>`;

    pagination.innerHTML = html;
}

// Перегляд користувача
async function viewUser(userId) {
    try {
        const response = await authFetch(`/api/admin/users/${userId}`);

        if (!response || !response.ok) {
            throw new Error('Помилка завантаження користувача');
        }

        const data = await response.json();
        const user = data.user;
        const cards = data.cards || [];

        alert(`Користувач: ${user.name}\nEmail: ${user.email}\nКарток: ${cards.length}\nДата реєстрації: ${formatDate(user.createdAt)}`);

    } catch (error) {
        console.error('View user error:', error);
        alert('Помилка завантаження даних користувача');
    }
}

// Видалення користувача
async function deleteUser(userId, userName) {
    if (!confirm(`Ви впевнені, що хочете видалити користувача "${userName}"?\n\nЦе також видалить всі його картки лояльності.`)) {
        return;
    }

    try {
        const response = await authFetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
        });

        if (!response || !response.ok) {
            throw new Error('Помилка видалення користувача');
        }

        alert('Користувача успішно видалено');
        loadUsers(currentPage, searchQuery);

    } catch (error) {
        console.error('Delete user error:', error);
        alert('Помилка видалення користувача');
    }
}

// Форматування дати
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Пошук
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchQuery = e.target.value;

        searchTimeout = setTimeout(() => {
            currentPage = 1;
            loadUsers(1, searchQuery);
        }, 500);
    });

    loadUsers(1, '');
});
