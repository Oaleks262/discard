// Скрипт для створення початкового адміністратора
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loyalty-cards', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Перевірити чи існує адміністратор
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@discard.com.ua' });

    if (existingAdmin) {
      console.log('Admin already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Створити нового адміністратора
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL || 'admin@discard.com.ua',
      password: 'Admin@123', // Змініть на безпечний пароль!
      name: 'Administrator',
      role: 'superadmin'
    });

    await admin.save();

    console.log('Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123');
    console.log('⚠️  ВАЖЛИВО: Змініть пароль після першого входу!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
