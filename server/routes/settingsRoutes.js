// Routes для налаштувань
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// ========== ПУБЛІЧНІ ROUTES ==========

// GET /api/settings/public - Публічні налаштування
router.get('/public', settingsController.getPublicSettings);

// ========== АДМІНІСТРАТИВНІ ROUTES ==========

// Застосувати middleware до адмін routes
router.use('/admin', authMiddleware);
router.use('/admin', adminMiddleware);

// GET /api/settings/admin - Всі налаштування
router.get('/admin', settingsController.getSettings);

// PUT /api/settings/admin - Оновлення налаштувань
router.put('/admin', settingsController.updateSettings);

module.exports = router;
