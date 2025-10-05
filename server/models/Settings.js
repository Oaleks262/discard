// Модель налаштувань сайту
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Загальні налаштування
  siteName: {
    type: String,
    default: 'disCard'
  },
  siteDescription: {
    type: String,
    default: 'Всі карти лояльності в одному місці'
  },
  contactEmail: {
    type: String,
    default: 'discardmessage@gmail.com'
  },
  contactPhone: {
    type: String
  },

  // SEO налаштування
  metaTitle: {
    type: String,
    default: 'disCard - Карти лояльності в одному додатку'
  },
  metaDescription: {
    type: String,
    default: 'Зберігайте всі карти лояльності українських магазинів в одному зручному PWA додатку. Сканування QR та штрих-кодів. Працює офлайн.'
  },
  metaKeywords: {
    type: String,
    default: 'карти лояльності, дисконтні карти, PWA, QR код, штрих-код, Україна'
  },
  ogImage: {
    type: String,
    default: '/og-image.png'
  },

  // Головна сторінка
  heroTitle: {
    type: String,
    default: 'Всі карти лояльності в одному місці'
  },
  heroSubtitle: {
    type: String,
    default: 'Більше не потрібно носити з собою десятки пластикових карт. disCard - ваш цифровий гаманець карт лояльності.'
  },
  ctaButtonText: {
    type: String,
    default: 'Почати користуватися'
  },

  // Реклама
  adsEnabled: {
    type: Boolean,
    default: false
  },
  adsenseClientId: {
    type: String
  },
  adSlots: {
    homepage: { type: String },
    blog: { type: String },
    article: { type: String },
    faq: { type: String },
    sidebar: { type: String }
  },

  // Google Analytics
  analyticsId: {
    type: String
  },

  // Соціальні мережі
  social: {
    facebook: { type: String },
    instagram: { type: String },
    telegram: { type: String },
    twitter: { type: String }
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Зберігаємо тільки один документ налаштувань
settingsSchema.statics.getSiteSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
