// Управління блогом в адмін-панелі

let currentPage = 1;
let totalPages = 1;

// Завантаження статей блогу
async function loadBlogPosts(page = 1) {
    const tbody = document.getElementById('blogTableBody');
    const errorDiv = document.getElementById('error-message');

    errorDiv.classList.add('hidden');

    try {
        const response = await authFetch(`/api/blog/admin/posts?page=${page}&limit=20`);

        if (!response || !response.ok) {
            throw new Error('Помилка завантаження статей');
        }

        const data = await response.json();

        currentPage = data.currentPage;
        totalPages = data.totalPages;

        renderBlogTable(data.posts);
        renderPagination(data.totalPages, data.currentPage);

    } catch (error) {
        console.error('Load posts error:', error);
        errorDiv.textContent = 'Помилка завантаження статей';
        errorDiv.classList.remove('hidden');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: var(--spacing-xl);">Помилка завантаження</td></tr>';
    }
}

// Відображення таблиці статей
function renderBlogTable(posts) {
    const tbody = document.getElementById('blogTableBody');

    if (!posts || posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: var(--spacing-xl);">Статей не знайдено. Створіть першу статтю!</td></tr>';
        return;
    }

    tbody.innerHTML = posts.map(post => `
        <tr>
            <td><strong>${escapeHtml(post.title)}</strong></td>
            <td>${getCategoryName(post.category)}</td>
            <td>
                <span style="padding: 4px 8px; border-radius: 4px; font-size: 0.875rem; background-color: ${post.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; color: ${post.status === 'published' ? '#10B981' : '#F59E0B'};">
                    ${post.status === 'published' ? '✓ Опубліковано' : '📝 Чернетка'}
                </span>
            </td>
            <td>${post.views || 0}</td>
            <td>${formatDate(post.createdAt)}</td>
            <td>
                <button onclick="editPost('${post._id}')" class="btn-outline" style="padding: 0.5rem 1rem; margin-right: 0.5rem;">Редагувати</button>
                <button onclick="deletePost('${post._id}', '${escapeHtml(post.title)}')" class="btn-danger" style="padding: 0.5rem 1rem;">Видалити</button>
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

    html += `<button ${current === 1 ? 'disabled' : ''} onclick="loadBlogPosts(${current - 1})">‹ Попередня</button>`;

    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
        html += `<button onclick="loadBlogPosts(1)">1</button>`;
        if (start > 2) html += `<span style="padding: 0 0.5rem;">...</span>`;
    }

    for (let i = start; i <= end; i++) {
        html += `<button class="${i === current ? 'active' : ''}" onclick="loadBlogPosts(${i})">${i}</button>`;
    }

    if (end < total) {
        if (end < total - 1) html += `<span style="padding: 0 0.5rem;">...</span>`;
        html += `<button onclick="loadBlogPosts(${total})">${total}</button>`;
    }

    html += `<button ${current === total ? 'disabled' : ''} onclick="loadBlogPosts(${current + 1})">Наступна ›</button>`;

    pagination.innerHTML = html;
}

// Редагування статті
function editPost(postId) {
    window.location.href = `/admin/blog-editor.html?id=${postId}`;
}

// Видалення статті
async function deletePost(postId, title) {
    if (!confirm(`Ви впевнені, що хочете видалити статтю "${title}"?`)) {
        return;
    }

    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');

    try {
        const response = await authFetch(`/api/blog/admin/posts/${postId}`, {
            method: 'DELETE'
        });

        if (!response || !response.ok) {
            throw new Error('Помилка видалення статті');
        }

        successDiv.textContent = 'Статтю успішно видалено';
        successDiv.classList.remove('hidden');
        setTimeout(() => successDiv.classList.add('hidden'), 3000);

        loadBlogPosts(currentPage);

    } catch (error) {
        console.error('Delete post error:', error);
        errorDiv.textContent = 'Помилка видалення статті';
        errorDiv.classList.remove('hidden');
    }
}

// Форматування дати
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Назва категорії
function getCategoryName(category) {
    const categories = {
        'tips': 'Поради',
        'news': 'Новини',
        'guides': 'Гайди',
        'other': 'Інше'
    };
    return categories[category] || category;
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadBlogPosts(1);
});
