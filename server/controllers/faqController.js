// Контролер FAQ
const FAQ = require('../models/FAQ');

// ========== ПУБЛІЧНІ МЕТОДИ ==========

// Отримання всіх активних FAQ
exports.getAllFAQ = async (req, res) => {
  try {
    const faqItems = await FAQ.find({ published: true })
      .sort({ order: 1, createdAt: 1 });

    res.json(faqItems);

  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({ message: 'Помилка отримання FAQ' });
  }
};

// ========== АДМІНІСТРАТИВНІ МЕТОДИ ==========

// Отримання всіх FAQ для адміна
exports.getAdminFAQ = async (req, res) => {
  try {
    const faqItems = await FAQ.find()
      .sort({ order: 1, createdAt: 1 });

    res.json(faqItems);

  } catch (error) {
    console.error('Get admin FAQ error:', error);
    res.status(500).json({ message: 'Помилка отримання FAQ' });
  }
};

// Створення нового FAQ
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        message: 'Питання та відповідь обов\'язкові'
      });
    }

    const faq = await FAQ.create({
      question,
      answer,
      category: category || 'general',
      order: order || 0
    });

    res.status(201).json({
      success: true,
      faq
    });

  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ message: 'Помилка створення FAQ' });
  }
};

// Оновлення FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ не знайдено' });
    }

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      faq: updatedFAQ
    });

  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ message: 'Помилка оновлення FAQ' });
  }
};

// Видалення FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ не знайдено' });
    }

    await FAQ.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'FAQ видалено'
    });

  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ message: 'Помилка видалення FAQ' });
  }
};

// Зміна порядку FAQ
exports.reorderFAQ = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: 'Невірний формат даних'
      });
    }

    // Оновити порядок для кожного елемента
    const updates = items.map(item =>
      FAQ.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Порядок оновлено'
    });

  } catch (error) {
    console.error('Reorder FAQ error:', error);
    res.status(500).json({ message: 'Помилка зміни порядку' });
  }
};
