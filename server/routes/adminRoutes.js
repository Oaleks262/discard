// Routes для адмін панелі
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Застосувати middleware до всіх routes
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/dashboard/stats - Статистика для дашборду
router.get('/dashboard/stats', adminController.getDashboardStats);

// GET /api/admin/users - Список користувачів
router.get('/users', adminController.getUsers);

// GET /api/admin/users/:id - Деталі користувача
router.get('/users/:id', adminController.getUserById);

// DELETE /api/admin/users/:id - Видалення користувача
router.delete('/users/:id', adminController.deleteUser);

// GET /api/admin/backup/create - Створити резервну копію
router.get('/backup/create', adminController.createBackup);

// GET /api/admin/backup/list - Список резервних копій
router.get('/backup/list', adminController.listBackups);

// POST /api/admin/backup/restore - Відновити з резервної копії
router.post('/backup/restore', adminController.restoreBackup);

// DELETE /api/admin/backup/:filename - Видалити резервну копію
router.delete('/backup/:filename', adminController.deleteBackup);

// GET /api/admin/backup/download/:filename - Завантажити резервну копію
router.get('/backup/download/:filename', adminController.downloadBackup);

module.exports = router;
