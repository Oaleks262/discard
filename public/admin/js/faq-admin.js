// Управління FAQ в адмін-панелі

let allFaqItems = [];
let editingFaqId = null;

// Завантаження FAQ
async function loadFAQ() {
    const tbody = document.getElementById('faqTableBody');
    const errorDiv = document.getElementById('error-message');

    errorDiv.classList.add('hidden');

    try {
        const response = await authFetch('/api/faq/admin');

        if (!response || !response.ok) {
            throw new Error('Помилка завантаження FAQ');
        }

        allFaqItems = await response.json();
        renderFAQTable(allFaqItems);

    } catch (error) {
        console.error('Load FAQ error:', error);
        errorDiv.textContent = 'Помилка завантаження FAQ';
        errorDiv.classList.remove('hidden');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: var(--spacing-xl);">Помилка завантаження</td></tr>';
    }
}

// Відображення таблиці FAQ
function renderFAQTable(items) {
    const tbody = document.getElementById('faqTableBody');

    if (!items || items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: var(--spacing-xl);">FAQ не знайдено. Додайте перше питання!</td></tr>';
        return;
    }

    tbody.innerHTML = items.map((item, index) => `
        <tr>
            <td>${item.order || index + 1}</td>
            <td><strong>${escapeHtml(item.question)}</strong></td>
            <td>${escapeHtml(item.category || 'general')}</td>
            <td>
                <span style="padding: 4px 8px; border-radius: 4px; font-size: 0.875rem; background-color: ${item.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)'}; color: ${item.isActive ? '#10B981' : '#6B7280'};">
                    ${item.isActive ? '✓ Активне' : '✗ Неактивне'}
                </span>
            </td>
            <td>
                <button onclick="editFAQ('${item._id}')" class="btn-outline" style="padding: 0.5rem 1rem; margin-right: 0.5rem;">Редагувати</button>
                <button onclick="deleteFAQ('${item._id}', '${escapeHtml(item.question)}')" class="btn-danger" style="padding: 0.5rem 1rem;">Видалити</button>
            </td>
        </tr>
    `).join('');
}

// Показати модальне вікно для створення
function showCreateModal() {
    editingFaqId = null;
    document.getElementById('modalTitle').textContent = 'Додати питання';
    document.getElementById('faqForm').reset();
    document.getElementById('faqId').value = '';
    document.getElementById('isActive').checked = true;
    document.getElementById('order').value = allFaqItems.length;
    showModal();
}

// Редагування FAQ
async function editFAQ(faqId) {
    editingFaqId = faqId;
    const faq = allFaqItems.find(f => f._id === faqId);

    if (!faq) {
        alert('FAQ не знайдено');
        return;
    }

    document.getElementById('modalTitle').textContent = 'Редагувати питання';
    document.getElementById('faqId').value = faq._id;
    document.getElementById('question').value = faq.question;
    document.getElementById('answer').value = faq.answer;
    document.getElementById('category').value = faq.category || 'general';
    document.getElementById('order').value = faq.order || 0;
    document.getElementById('isActive').checked = faq.isActive !== false;

    showModal();
}

// Видалення FAQ
async function deleteFAQ(faqId, question) {
    if (!confirm(`Ви впевнені, що хочете видалити питання "${question}"?`)) {
        return;
    }

    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');

    try {
        const response = await authFetch(`/api/faq/admin/${faqId}`, {
            method: 'DELETE'
        });

        if (!response || !response.ok) {
            throw new Error('Помилка видалення FAQ');
        }

        successDiv.textContent = 'FAQ успішно видалено';
        successDiv.classList.remove('hidden');
        setTimeout(() => successDiv.classList.add('hidden'), 3000);

        loadFAQ();

    } catch (error) {
        console.error('Delete FAQ error:', error);
        errorDiv.textContent = 'Помилка видалення FAQ';
        errorDiv.classList.remove('hidden');
    }
}

// Збереження FAQ (створення або оновлення)
document.getElementById('faqForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const faqId = document.getElementById('faqId').value;
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');

    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    const faqData = {
        question: document.getElementById('question').value,
        answer: document.getElementById('answer').value,
        category: document.getElementById('category').value || 'general',
        order: parseInt(document.getElementById('order').value) || 0,
        isActive: document.getElementById('isActive').checked
    };

    try {
        const url = faqId ? `/api/faq/admin/${faqId}` : '/api/faq/admin';
        const method = faqId ? 'PUT' : 'POST';

        const response = await authFetch(url, {
            method: method,
            body: JSON.stringify(faqData)
        });

        if (!response || !response.ok) {
            throw new Error('Помилка збереження FAQ');
        }

        successDiv.textContent = faqId ? 'FAQ успішно оновлено' : 'FAQ успішно створено';
        successDiv.classList.remove('hidden');
        setTimeout(() => successDiv.classList.add('hidden'), 3000);

        hideModal();
        loadFAQ();

    } catch (error) {
        console.error('Save FAQ error:', error);
        errorDiv.textContent = 'Помилка збереження FAQ';
        errorDiv.classList.remove('hidden');
    }
});

// Модальне вікно
function showModal() {
    document.getElementById('faqModal').style.display = 'flex';
    document.getElementById('faqModal').style.alignItems = 'center';
    document.getElementById('faqModal').style.justifyContent = 'center';
    document.getElementById('faqModal').style.position = 'fixed';
    document.getElementById('faqModal').style.top = '0';
    document.getElementById('faqModal').style.left = '0';
    document.getElementById('faqModal').style.right = '0';
    document.getElementById('faqModal').style.bottom = '0';
    document.getElementById('faqModal').style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    document.getElementById('faqModal').style.zIndex = '1000';
}

function hideModal() {
    document.getElementById('faqModal').style.display = 'none';
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
    loadFAQ();

    // Закрити модалку по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal();
        }
    });
});
