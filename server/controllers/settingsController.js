// Контролер налаштувань
const Settings = require('../models/Settings');

// Отримання всіх налаштувань (адмін)
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSiteSettings();
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Помилка отримання налаштувань' });
  }
};

// Оновлення налаштувань (адмін)
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.getSiteSettings();

    // Оновити налаштування
    Object.keys(req.body).forEach(key => {
      if (key === 'adSlots' && typeof req.body[key] === 'object') {
        settings.adSlots = { ...settings.adSlots.toObject(), ...req.body[key] };
      } else if (key === 'social' && typeof req.body[key] === 'object') {
        settings.social = { ...settings.social.toObject(), ...req.body[key] };
      } else {
        settings[key] = req.body[key];
      }
    });

    settings.updatedAt = new Date();
    await settings.save();

    res.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Помилка оновлення налаштувань' });
  }
};

// Отримання публічних налаштувань (доступно всім)
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await Settings.getSiteSettings();

    // Повертаємо тільки публічні налаштування
    const publicSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      contactEmail: settings.contactEmail,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      ctaButtonText: settings.ctaButtonText,
      adsEnabled: settings.adsEnabled,
      adsenseClientId: settings.adsenseClientId,
      adSlots: settings.adSlots,
      analyticsId: settings.analyticsId,
      social: settings.social
    };

    res.json(publicSettings);

  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({ message: 'Помилка отримання налаштувань' });
  }
};
