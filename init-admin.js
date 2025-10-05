// Скрипт для створення першого адміністратора
// Запустіть: node init-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const Admin = require('./server/models/Admin');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    // Підключення до MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loyalty-cards', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Підключено до MongoDB');

    // Перевірити чи є вже адміни
    const existingAdmins = await Admin.countDocuments();
    if (existingAdmins > 0) {
      console.log(`\n⚠️  Вже існує ${existingAdmins} адмін(ів) у базі даних.`);
      const proceed = await question('Створити ще одного адміна? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        console.log('Скасовано.');
        process.exit(0);
      }
    }

    console.log('\n📝 Створення нового адміністратора\n');

    const name = await question('Ім\'я адміна: ');
    const email = await question('Email: ');
    const password = await question('Пароль (мін. 6 символів): ');

    // Перевірка чи email вже існує
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log('\n❌ Адміністратор з таким email вже існує!');
      process.exit(1);
    }

    // Створення адміна
    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'superadmin'
    });

    console.log('\n✅ Адміністратора успішно створено!');
    console.log('\nДані для входу:');
    console.log(`Email: ${admin.email}`);
    console.log(`Пароль: ${password}`);
    console.log('\nУвійдіть на: http://localhost:${process.env.PORT || 2804}/admin/login.html');

  } catch (error) {
    console.error('\n❌ Помилка:', error.message);
  } finally {
    rl.close();
    process.exit(0);
  }
}

createAdmin();
