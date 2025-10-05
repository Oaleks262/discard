// Швидке створення адміністратора
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./server/models/Admin');

async function createAdmin() {
  try {
    // Підключення до MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loyalty-cards', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Підключено до MongoDB');

    // Дані адміна
    const adminData = {
      name: 'Admin',
      email: 'oaleks262@gmail.com',
      password: '32Gesohe',
      role: 'superadmin'
    };

    // Перевірка чи email вже існує
    const existing = await Admin.findOne({ email: adminData.email.toLowerCase() });
    if (existing) {
      console.log('\n⚠️  Адміністратор з email', adminData.email, 'вже існує!');
      console.log('Дані для входу:');
      console.log(`Email: ${adminData.email}`);
      console.log(`Використовуйте існуючий пароль`);
      process.exit(0);
    }

    // Створення адміна
    const admin = await Admin.create({
      name: adminData.name,
      email: adminData.email.toLowerCase(),
      password: adminData.password,
      role: adminData.role
    });

    console.log('\n✅ Адміністратора успішно створено!');
    console.log('\nДані для входу:');
    console.log(`Email: ${admin.email}`);
    console.log(`Пароль: ${adminData.password}`);
    console.log(`\nУвійдіть на: http://localhost:${process.env.PORT || 2804}/admin/login.html`);

  } catch (error) {
    console.error('\n❌ Помилка:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
