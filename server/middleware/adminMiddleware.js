// Middleware для перевірки прав адміністратора
module.exports = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ message: 'Не авторизовано' });
  }

  if (req.admin.role !== 'admin' && req.admin.role !== 'superadmin') {
    return res.status(403).json({
      message: 'Доступ заборонено. Потрібні права адміністратора'
    });
  }

  next();
};
