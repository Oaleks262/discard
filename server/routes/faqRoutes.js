// Routes для FAQ
const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// ========== ПУБЛІЧНІ ROUTES ==========

// GET /api/faq - Список активних FAQ
router.get('/', faqController.getAllFAQ);

// ========== АДМІНІСТРАТИВНІ ROUTES ==========

// Застосувати middleware до адмін routes
router.use('/admin', authMiddleware);
router.use('/admin', adminMiddleware);

// GET /api/faq/admin - Всі FAQ для адміна
router.get('/admin', faqController.getAdminFAQ);

// POST /api/faq/admin - Створення FAQ
router.post('/admin', faqController.createFAQ);

// PUT /api/faq/admin/:id - Оновлення FAQ
router.put('/admin/:id', faqController.updateFAQ);

// DELETE /api/faq/admin/:id - Видалення FAQ
router.delete('/admin/:id', faqController.deleteFAQ);

// PUT /api/faq/admin/reorder - Зміна порядку FAQ
router.put('/admin/reorder', faqController.reorderFAQ);

module.exports = router;
