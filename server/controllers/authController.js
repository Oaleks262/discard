// Контролер автентифікації адміністратора
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Логін адміна
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валідація
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email та пароль обов\'язкові'
      });
    }

    // Пошук адміна
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        message: 'Невірний email або пароль'
      });
    }

    // Перевірка паролю
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Невірний email або пароль'
      });
    }

    // Створення JWT токену
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Оновлення lastLogin
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Верифікація токена
exports.verify = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ message: 'Помилка верифікації' });
  }
};

// Вихід
exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Вихід успішний' });
};
