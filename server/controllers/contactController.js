// Контролер контактної форми
const ContactMessage = require('../models/ContactMessage');

// Відправка повідомлення з контактної форми
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Валідація
    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'Заповніть всі обов\'язкові поля'
      });
    }

    // Створення повідомлення
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject: subject || 'other',
      message
    });

    // TODO: Відправка email через nodemailer (опціонально)
    // await sendEmailNotification(contactMessage);

    res.status(201).json({
      success: true,
      message: 'Повідомлення відправлено. Ми зв\'яжемося з вами найближчим часом.'
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Помилка відправки повідомлення' });
  }
};

// Отримання всіх повідомлень (адмін)
exports.getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || '';
    const subject = req.query.subject || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (subject) {
      query.subject = subject;
    }

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await ContactMessage.countDocuments(query);
    const totalPages = Math.ceil(totalMessages / limit);

    res.json({
      messages,
      currentPage: page,
      totalPages,
      totalMessages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Помилка отримання повідомлень' });
  }
};

// Отримання одного повідомлення (адмін)
exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Повідомлення не знайдено' });
    }

    res.json({ message });

  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ message: 'Помилка отримання повідомлення' });
  }
};

// Позначити як прочитане (адмін)
exports.markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Повідомлення не знайдено' });
    }

    res.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Помилка оновлення статусу' });
  }
};

// Оновлення статусу повідомлення (адмін)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Невірний статус' });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status, repliedAt: status === 'replied' ? new Date() : undefined },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Повідомлення не знайдено' });
    }

    res.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ message: 'Помилка оновлення статусу' });
  }
};

// Видалення повідомлення (адмін)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Повідомлення не знайдено' });
    }

    res.json({
      success: true,
      message: 'Повідомлення видалено'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Помилка видалення повідомлення' });
  }
};
