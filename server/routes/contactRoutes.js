// Routes для контактної форми
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// ========== ПУБЛІЧНІ ROUTES ==========

// POST /api/contact - Відправка повідомлення
router.post('/', contactController.sendMessage);

// ========== АДМІНІСТРАТИВНІ ROUTES ==========

// Застосувати middleware до адмін routes
router.use('/admin', authMiddleware);
router.use('/admin', adminMiddleware);

// GET /api/contact/admin/messages - Всі повідомлення
router.get('/admin/messages', contactController.getAllMessages);

// GET /api/contact/admin/messages/:id - Одне повідомлення
router.get('/admin/messages/:id', contactController.getMessageById);

// PATCH /api/contact/admin/messages/:id/read - Позначити як прочитане
router.patch('/admin/messages/:id/read', contactController.markAsRead);

// PUT /api/contact/admin/messages/:id/status - Оновлення статусу повідомлення
router.put('/admin/messages/:id/status', contactController.updateMessageStatus);

// DELETE /api/contact/admin/messages/:id - Видалення повідомлення
router.delete('/admin/messages/:id', contactController.deleteMessage);

module.exports = router;
