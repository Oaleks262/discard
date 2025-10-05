require('dotenv').config();
const mongoose = require('mongoose');
const FAQ = require('./server/models/FAQ');

const faqData = [
  { key: 'what_is_discard', category: 'general', order: 1, published: true },
  { key: 'is_free', category: 'general', order: 2, published: true },
  { key: 'how_to_install', category: 'installation', order: 3, published: true },
  { key: 'works_offline', category: 'technical', order: 4, published: true },
  { key: 'supported_codes', category: 'technical', order: 5, published: true },
  { key: 'how_to_add_card', category: 'usage', order: 6, published: true },
  { key: 'is_safe', category: 'security', order: 7, published: true },
  { key: 'sync_devices', category: 'usage', order: 8, published: true },
  { key: 'code_wont_scan', category: 'troubleshooting', order: 9, published: true },
  { key: 'how_many_cards', category: 'usage', order: 10, published: true },
  { key: 'how_to_use_in_store', category: 'usage', order: 11, published: true },
  { key: 'registration_required', category: 'account', order: 12, published: true },
  { key: 'forgot_password', category: 'account', order: 13, published: true },
  { key: 'can_delete_card', category: 'usage', order: 14, published: true },
  { key: 'dark_theme_support', category: 'technical', order: 15, published: true },
  { key: 'pwa_vs_regular', category: 'technical', order: 16, published: true },
  { key: 'data_collection', category: 'security', order: 17, published: true },
  { key: 'change_language', category: 'technical', order: 18, published: true },
  { key: 'contact_support', category: 'support', order: 19, published: true },
  { key: 'export_data', category: 'account', order: 20, published: true },
  { key: 'technical_issues', category: 'troubleshooting', order: 21, published: true }
];

async function seedFAQ() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await FAQ.deleteMany({});
    console.log('🗑️  Cleared existing FAQs');

    await FAQ.insertMany(faqData);
    console.log(`✅ Added ${faqData.length} FAQ items`);

    console.log('\n📊 FAQ Categories:');
    const categories = [...new Set(faqData.map(f => f.category))];
    categories.forEach(cat => {
      const count = faqData.filter(f => f.category === cat).length;
      console.log(`   - ${cat}: ${count} items`);
    });

    console.log('\n💡 Translations should be added to i18n.js under faq.items object');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding FAQ:', error);
    process.exit(1);
  }
}

seedFAQ();
