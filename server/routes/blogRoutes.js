// Routes для блогу
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// ========== ПУБЛІЧНІ ROUTES ==========

// GET /api/blog - Список опублікованих статей
router.get('/', blogController.getAllPosts);

// GET /api/blog/slug/:slug - Окрема стаття за slug
router.get('/slug/:slug', blogController.getPostBySlug);

// ========== АДМІНІСТРАТИВНІ ROUTES ==========

// Застосувати middleware до адмін routes
router.use('/admin', authMiddleware);
router.use('/admin', adminMiddleware);

// GET /api/blog/admin/posts - Всі статті (включаючи чернетки)
router.get('/admin/posts', blogController.getAdminPosts);

// GET /api/blog/admin/posts/:id - Стаття за ID для редагування
router.get('/admin/posts/:id', blogController.getPostById);

// POST /api/blog/admin/posts - Створення статті
router.post('/admin/posts', blogController.createPost);

// PUT /api/blog/admin/posts/:id - Оновлення статті
router.put('/admin/posts/:id', blogController.updatePost);

// DELETE /api/blog/admin/posts/:id - Видалення статті
router.delete('/admin/posts/:id', blogController.deletePost);

module.exports = router;
