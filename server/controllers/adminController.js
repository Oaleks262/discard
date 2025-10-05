// Контролер адмін панелі
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const fsSync = require('fs');

// Отримання статистики для дашборду
exports.getDashboardStats = async (req, res) => {
  try {
    const User = mongoose.model('User');
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Загальна кількість користувачів
    const totalUsers = await User.countDocuments();

    // Загальна кількість карток
    const users = await User.find();
    const totalCards = users.reduce((sum, user) => sum + (user.cards ? user.cards.length : 0), 0);

    // Нові користувачі за тиждень
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    // Активні користувачі за місяць (ті хто має картки)
    const activeUsersThisMonth = await User.countDocuments({
      'cards.0': { $exists: true }
    });

    // Графік росту користувачів (останні 7 днів)
    const userGrowthData = await getUserGrowthData(7);

    // Графік росту карток (останні 7 днів)
    const cardGrowthData = await getCardGrowthData(7);

    // Топ-5 популярних магазинів
    const popularStores = await getPopularStores();

    res.json({
      totalUsers,
      totalCards,
      newUsersThisWeek,
      activeUsersThisMonth,
      userGrowthData,
      cardGrowthData,
      popularStores
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Помилка отримання статистики' });
  }
};

// Допоміжна функція для графіка росту користувачів
async function getUserGrowthData(days) {
  const User = mongoose.model('User');
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await User.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    data.push({
      date: startOfDay.toISOString().split('T')[0],
      count
    });
  }

  return data;
}

// Допоміжна функція для графіка росту карток
async function getCardGrowthData(days) {
  const User = mongoose.model('User');
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const users = await User.find({
      'cards.createdAt': { $gte: startOfDay, $lte: endOfDay }
    });

    let count = 0;
    users.forEach(user => {
      if (user.cards) {
        count += user.cards.filter(card =>
          card.createdAt >= startOfDay && card.createdAt <= endOfDay
        ).length;
      }
    });

    data.push({
      date: startOfDay.toISOString().split('T')[0],
      count
    });
  }

  return data;
}

// Допоміжна функція для популярних магазинів
async function getPopularStores() {
  const User = mongoose.model('User');
  const users = await User.find();

  const storeCount = {};
  users.forEach(user => {
    if (user.cards) {
      user.cards.forEach(card => {
        const storeName = card.name || 'Без назви';
        storeCount[storeName] = (storeCount[storeName] || 0) + 1;
      });
    }
  });

  return Object.entries(storeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

// Отримання списку користувачів
exports.getUsers = async (req, res) => {
  try {
    const User = mongoose.model('User');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Додати кількість карток для кожного користувача
    const usersWithCardCount = users.map(user => ({
      ...user.toObject(),
      cardsCount: user.cards ? user.cards.length : 0
    }));

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users: usersWithCardCount,
      currentPage: page,
      totalPages,
      totalUsers
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Помилка отримання користувачів' });
  }
};

// Отримання користувача за ID
exports.getUserById = async (req, res) => {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    res.json({
      user,
      cards: user.cards || []
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Помилка отримання користувача' });
  }
};

// Видалення користувача
exports.deleteUser = async (req, res) => {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Користувача видалено'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Помилка видалення користувача' });
  }
};

// ========== BACKUP FUNCTIONALITY ==========

const BACKUP_DIR = path.join(__dirname, '../../backups');

// Переконатися що папка для бекапів існує
async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

// Створити резервну копію
exports.createBackup = async (req, res) => {
  try {
    await ensureBackupDir();

    const User = mongoose.model('User');
    const Admin = mongoose.model('Admin');
    const BlogPost = mongoose.model('BlogPost');
    const FAQ = mongoose.model('FAQ');
    const Settings = mongoose.model('Settings');
    const ContactMessage = mongoose.model('ContactMessage');

    // Отримати всі дані
    const users = await User.find().lean();
    const admins = await Admin.find().lean();
    const blogPosts = await BlogPost.find().lean();
    const faqs = await FAQ.find().lean();
    const settings = await Settings.find().lean();
    const messages = await ContactMessage.find().lean();

    const backup = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      createdBy: req.admin.email,
      data: {
        users,
        admins,
        blogPosts,
        faqs,
        settings,
        messages
      },
      stats: {
        usersCount: users.length,
        adminsCount: admins.length,
        blogPostsCount: blogPosts.length,
        faqsCount: faqs.length,
        messagesCount: messages.length
      }
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.json`;
    const filepath = path.join(BACKUP_DIR, filename);

    await fs.writeFile(filepath, JSON.stringify(backup, null, 2), 'utf8');

    res.json({
      success: true,
      message: 'Резервну копію успішно створено',
      filename,
      stats: backup.stats,
      size: (await fs.stat(filepath)).size
    });

  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({ message: 'Помилка створення резервної копії' });
  }
};

// Отримати список резервних копій
exports.listBackups = async (req, res) => {
  try {
    await ensureBackupDir();

    const files = await fs.readdir(BACKUP_DIR);
    const backupFiles = files.filter(f => f.startsWith('backup-') && f.endsWith('.json'));

    const backups = await Promise.all(backupFiles.map(async (filename) => {
      const filepath = path.join(BACKUP_DIR, filename);
      const stats = await fs.stat(filepath);

      try {
        const content = await fs.readFile(filepath, 'utf8');
        const backup = JSON.parse(content);

        return {
          filename,
          createdAt: backup.createdAt || stats.mtime.toISOString(),
          createdBy: backup.createdBy || 'Unknown',
          size: stats.size,
          stats: backup.stats || {}
        };
      } catch (err) {
        return {
          filename,
          createdAt: stats.mtime.toISOString(),
          createdBy: 'Unknown',
          size: stats.size,
          stats: {},
          error: 'Invalid backup file'
        };
      }
    }));

    // Сортувати за датою створення (новіші спочатку)
    backups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      backups
    });

  } catch (error) {
    console.error('List backups error:', error);
    res.status(500).json({ message: 'Помилка отримання списку резервних копій' });
  }
};

// Відновити з резервної копії
exports.restoreBackup = async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ message: 'Не вказано файл резервної копії' });
    }

    const filepath = path.join(BACKUP_DIR, filename);

    // Перевірити чи файл існує
    try {
      await fs.access(filepath);
    } catch {
      return res.status(404).json({ message: 'Файл резервної копії не знайдено' });
    }

    // Прочитати резервну копію
    const content = await fs.readFile(filepath, 'utf8');
    const backup = JSON.parse(content);

    if (!backup.data) {
      return res.status(400).json({ message: 'Невірний формат резервної копії' });
    }

    const User = mongoose.model('User');
    const Admin = mongoose.model('Admin');
    const BlogPost = mongoose.model('BlogPost');
    const FAQ = mongoose.model('FAQ');
    const Settings = mongoose.model('Settings');
    const ContactMessage = mongoose.model('ContactMessage');

    // Видалити всі існуючі дані (крім адмінів - для безпеки)
    await User.deleteMany({});
    await BlogPost.deleteMany({});
    await FAQ.deleteMany({});
    await Settings.deleteMany({});
    await ContactMessage.deleteMany({});

    // Відновити дані з резервної копії
    if (backup.data.users && backup.data.users.length > 0) {
      await User.insertMany(backup.data.users);
    }

    if (backup.data.blogPosts && backup.data.blogPosts.length > 0) {
      await BlogPost.insertMany(backup.data.blogPosts);
    }

    if (backup.data.faqs && backup.data.faqs.length > 0) {
      await FAQ.insertMany(backup.data.faqs);
    }

    if (backup.data.settings && backup.data.settings.length > 0) {
      await Settings.insertMany(backup.data.settings);
    }

    if (backup.data.messages && backup.data.messages.length > 0) {
      await ContactMessage.insertMany(backup.data.messages);
    }

    res.json({
      success: true,
      message: 'Дані успішно відновлено з резервної копії',
      restored: {
        users: backup.data.users?.length || 0,
        blogPosts: backup.data.blogPosts?.length || 0,
        faqs: backup.data.faqs?.length || 0,
        settings: backup.data.settings?.length || 0,
        messages: backup.data.messages?.length || 0
      }
    });

  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({ message: 'Помилка відновлення з резервної копії' });
  }
};

// Видалити резервну копію
exports.deleteBackup = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename || !filename.startsWith('backup-')) {
      return res.status(400).json({ message: 'Невірне ім\'я файлу' });
    }

    const filepath = path.join(BACKUP_DIR, filename);

    // Перевірити чи файл існує
    try {
      await fs.access(filepath);
    } catch {
      return res.status(404).json({ message: 'Файл резервної копії не знайдено' });
    }

    await fs.unlink(filepath);

    res.json({
      success: true,
      message: 'Резервну копію успішно видалено'
    });

  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({ message: 'Помилка видалення резервної копії' });
  }
};

// Завантажити резервну копію
exports.downloadBackup = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename || !filename.startsWith('backup-') || !filename.endsWith('.json')) {
      return res.status(400).json({ message: 'Невірне ім\'я файлу' });
    }

    const filepath = path.join(BACKUP_DIR, filename);

    // Перевірити чи файл існує
    try {
      await fs.access(filepath);
    } catch {
      return res.status(404).json({ message: 'Файл резервної копії не знайдено' });
    }

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Помилка завантаження файлу' });
        }
      }
    });

  } catch (error) {
    console.error('Download backup error:', error);
    res.status(500).json({ message: 'Помилка завантаження резервної копії' });
  }
};
