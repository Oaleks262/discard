// Редактор статей блогу

let editMode = false;
let currentPostId = null;

// Завантаження статті для редагування
async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        // Режим створення
        editMode = false;
        generateSlugFromTitle();
        return;
    }

    // Режим редагування
    editMode = true;
    currentPostId = postId;

    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('error-message');

    loader.classList.remove('hidden');

    try {
        const response = await authFetch(`/api/blog/admin/posts/${postId}`);

        if (!response || !response.ok) {
            throw new Error('Помилка завантаження статті');
        }

        const data = await response.json();
        const post = data.post;

        // Заповнити форму
        document.getElementById('pageTitle').textContent = 'Редагувати статтю';
        document.getElementById('postId').value = post._id;
        document.getElementById('title').value = post.title;
        document.getElementById('slug').value = post.slug;
        document.getElementById('description').value = post.description;
        document.getElementById('content').value = post.content;
        document.getElementById('category').value = post.category;
        document.getElementById('tags').value = (post.tags || []).join(', ');
        document.getElementById('status').value = post.status;

    } catch (error) {
        console.error('Load post error:', error);
        errorDiv.textContent = 'Помилка завантаження статті';
        errorDiv.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
    }
}

// Збереження статті
async function savePost() {
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');

    // Валідація
    const title = document.getElementById('title').value.trim();
    const slug = document.getElementById('slug').value.trim();
    const description = document.getElementById('description').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !slug || !description || !content) {
        errorDiv.textContent = 'Заповніть всі обов\'язкові поля';
        errorDiv.classList.remove('hidden');
        return;
    }

    loader.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    const postData = {
        title,
        slug,
        description,
        content,
        category: document.getElementById('category').value,
        tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
        status: document.getElementById('status').value
    };

    try {
        const url = editMode ? `/api/blog/admin/posts/${currentPostId}` : '/api/blog/admin/posts';
        const method = editMode ? 'PUT' : 'POST';

        const response = await authFetch(url, {
            method: method,
            body: JSON.stringify(postData)
        });

        if (!response || !response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Помилка збереження статті');
        }

        successDiv.textContent = editMode ? 'Статтю успішно оновлено!' : 'Статтю успішно створено!';
        successDiv.classList.remove('hidden');

        // Перенаправити на список статей через 2 секунди
        setTimeout(() => {
            window.location.href = '/admin/blog.html';
        }, 2000);

    } catch (error) {
        console.error('Save post error:', error);
        errorDiv.textContent = error.message || 'Помилка збереження статті';
        errorDiv.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
    }
}

// Генерація slug з заголовка
function generateSlugFromTitle() {
    const titleInput = document.getElementById('title');
    const slugInput = document.getElementById('slug');

    titleInput.addEventListener('input', () => {
        if (!editMode) {
            // Генерувати slug тільки для нових статей
            const slug = titleInput.value
                .toLowerCase()
                .replace(/[^\u0400-\u04FFa-z0-9\s-]/g, '') // Дозволити кирилицю
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            slugInput.value = slug;
        }
    });
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadPost();
});
