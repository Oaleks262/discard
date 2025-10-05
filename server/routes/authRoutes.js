// Routes для автентифікації адміністратора
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/admin/auth/login - Логін адміна
router.post('/login', authController.login);

// GET /api/admin/auth/verify - Верифікація токена
router.get('/verify', authMiddleware, authController.verify);

// POST /api/admin/auth/logout - Вихід
router.post('/logout', authController.logout);

module.exports = router;
