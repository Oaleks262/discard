// Middleware для перевірки JWT токена
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Отримати токен з header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Токен відсутній або невірний формат'
      });
    }

    const token = authHeader.substring(7); // Видалити 'Bearer '

    // Верифікувати токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Додати дані адміна до request
    req.admin = decoded;

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Невірний токен' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Токен прострочений' });
    }
    return res.status(500).json({ message: 'Помилка автентифікації' });
  }
};
