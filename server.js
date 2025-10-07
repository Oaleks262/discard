/*  */const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const fs = require('fs-extra');
const archiver = require('archiver');
const multer = require('multer');
const extract = require('extract-zip');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2804;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `restore-${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Тільки ZIP файли дозволені'));
    }
  }
});

// Trust proxy (for nginx/reverse proxy) - trust only first proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: true
});

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
});

app.use(limiter);
app.use('/api/auth', authLimiter);

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:2804'],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Import routes
const blogRoutes = require('./server/routes/blogRoutes');
const faqRoutes = require('./server/routes/faqRoutes');

// API Routes
app.use('/api/blog', blogRoutes);
app.use('/api/faq', faqRoutes);

// App route - serve app.html for /app paths
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Blog routes - serve blog pages
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});

app.get('/blog/post/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog', 'post.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

// Admin routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

app.get('/admin/users', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'users.html'));
});

app.get('/admin/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'blog.html'));
});

app.get('/admin/blog-editor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'blog-editor.html'));
});

app.get('/admin/messages', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'messages.html'));
});

app.get('/admin/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'faq.html'));
});

app.get('/admin/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'settings.html'));
});

app.get('/admin/backup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'backup.html'));
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loyalty-cards', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // або інший сервіс
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper function to generate 5-digit verification code
function generateVerificationCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Generate random password
function generateRandomPassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  // Ensure at least one character from each category
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Add remaining random characters
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Helper function to send verification email
async function sendVerificationEmail(email, code, userAgent = '', ipAddress = '') {
  const resetToken = jwt.sign({ email, action: 'reset' }, process.env.JWT_SECRET, { expiresIn: process.env.RESET_TOKEN_EXPIRES || '1h' });
  const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `${process.env.COMPANY_NAME} - Код підтвердження входу`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${process.env.BASE_URL || 'https://discard.com.ua'}/logo.png" alt="${process.env.COMPANY_NAME}" style="height: 48px; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;">
          <h1 style="color: #0066FF; margin: 0;">${process.env.COMPANY_NAME}</h1>
          <p style="color: #6C757D; margin: 5px 0;">${process.env.COMPANY_TAGLINE}</p>
        </div>
        
        <div style="background: #F8F9FA; border-radius: 12px; padding: 30px; text-align: center;">
          <h2 style="color: #1A1A1A; margin-bottom: 20px;">Код підтвердження входу</h2>
          <p style="color: #4A4A4A; margin-bottom: 30px;">Використайте цей код для входу в додаток:</p>
          
          <div style="background: white; border: 2px solid #0066FF; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; color: #0066FF; letter-spacing: 5px;">${code}</span>
          </div>
          
          <p style="color: #6C757D; font-size: 14px; margin-top: 20px;">
            Код дійсний протягом 10 хвилин
          </p>
          
          ${userAgent ? `<div style="background: #FFF3CD; border: 1px solid #FFEAA7; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px; color: #856404;">
            <p style="margin: 0; font-weight: bold;">Інформація про вхід:</p>
            <p style="margin: 5px 0;">Пристрій: ${userAgent}</p>
            ${ipAddress ? `<p style="margin: 5px 0;">IP: ${ipAddress}</p>` : ''}
          </div>` : ''}
        </div>
        
        <div style="background: #FFF5F5; border: 1px solid #FEB2B2; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #C53030; margin: 0 0 10px 0; font-size: 16px;">🔒 Це були не ви?</h3>
          <p style="color: #744210; margin-bottom: 15px; font-size: 14px;">
            Якщо ви не намагалися увійти в свій акаунт, негайно змініть пароль для безпеки.
          </p>
          <div style="text-align: center;">
            <a href="${resetUrl}" style="display: inline-block; background: #E53E3E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
              Змінити пароль
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #6C757D; font-size: 12px;">
          <p>© 2024 ${process.env.COMPANY_NAME}. Всі права захищені.</p>
          <p style="margin-top: 10px;">
            <a href="mailto:${process.env.SUPPORT_EMAIL || process.env.EMAIL_FROM}" style="color: #0066FF;">Підтримка</a> | 
            <a href="${process.env.BASE_URL}" style="color: #0066FF;">${process.env.COMPANY_NAME}</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// Helper function to send new password email
async function sendNewPasswordEmail(email, newPassword, userAgent = '', ipAddress = '') {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `${process.env.COMPANY_NAME} - Новий пароль`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; border: 1px solid #e9ecef;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${process.env.BASE_URL || 'https://discard.com.ua'}/logo.png" alt="${process.env.COMPANY_NAME}" style="height: 48px; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;">
            <h1 style="color: #0066FF; margin: 0; font-size: 28px;">${process.env.COMPANY_NAME}</h1>
            <p style="color: #6c757d; margin: 5px 0 0 0; font-size: 14px;">${process.env.COMPANY_TAGLINE}</p>
          </div>
          
          <h2 style="color: #1a1a1a; margin-bottom: 20px;">Новий пароль згенеровано</h2>
          
          <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">
            Ми згенерували новий пароль для вашого акаунту ${process.env.COMPANY_NAME}.
          </p>
          
          <div style="background-color: #f8f9fa; border: 2px solid #0066FF; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">Ваш новий пароль:</p>
            <p style="font-size: 24px; font-weight: bold; color: #0066FF; margin: 0; font-family: 'Courier New', monospace; letter-spacing: 2px;">
              ${newPassword}
            </p>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Важливо:</strong> Після входу рекомендуємо змінити пароль на більш зручний для вас.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.BASE_URL}/app" 
               style="background-color: #0066FF; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Увійти в додаток
            </a>
          </div>
          
          <div style="border-top: 1px solid #e9ecef; margin-top: 30px; padding-top: 20px;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              Цей пароль було згенеровано ${new Date().toLocaleString('uk-UA')}
              ${userAgent ? `<br>Пристрій: ${userAgent}` : ''}
              ${ipAddress ? `<br>IP адреса: ${ipAddress}` : ''}
            </p>
            
            <p style="color: #6c757d; font-size: 12px; margin: 15px 0 0 0;">
              Якщо ви не запитували новий пароль, зверніться до служби підтримки: 
              <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #0066FF;">${process.env.ADMIN_EMAIL}</a>
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  language: {
    type: String,
    default: 'uk',
    enum: ['uk', 'en']
  },
  // Server-side encryption key for this user's cards
  encryptionKey: {
    type: String,
    required: false // Will be generated on first card creation
  },
  // Two-factor authentication fields
  verificationCode: {
    type: String,
    required: false
  },
  verificationCodeExpires: {
    type: Date,
    required: false
  },
  cards: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      // Make code optional for encrypted cards
      required: function() {
        return !this.isEncrypted;
      },
      trim: true
    },
    codeType: {
      type: String,
      required: true,
      enum: ['barcode', 'qrcode']
    },
    color: {
      type: String,
      default: '#3b82f6',
      validate: {
        validator: function(v) {
          return /^#[0-9A-F]{6}$/i.test(v);
        },
        message: 'Color must be a valid hex color'
      }
    },
    // New fields for encryption support
    encryptedCode: {
      type: String,
      required: function() {
        return this.isEncrypted;
      }
    },
    isEncrypted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Server-side encryption utilities
const crypto = require('crypto');

// Generate encryption key for user
function generateUserEncryptionKey() {
  return crypto.randomBytes(32).toString('base64');
}

// Encrypt card code
function encryptCardCode(code, encryptionKey) {
  try {
    const key = Buffer.from(encryptionKey, 'base64');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(code, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Combine IV and encrypted data
    const result = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]);
    return result.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt card code');
  }
}

// Decrypt card code
function decryptCardCode(encryptedCode, encryptionKey) {
  try {
    const key = Buffer.from(encryptionKey, 'base64');
    const data = Buffer.from(encryptedCode, 'base64');
    
    const iv = data.slice(0, 16);
    const encrypted = data.slice(16);
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt card code');
  }
}

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Admin Schema
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

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

// Import models
const BlogPost = require('./server/models/BlogPost');
const FAQ = require('./server/models/FAQ');

// Site Settings Schema
const settingsSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

// Page Content Schema
const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  metaTitle: {
    type: String
  },
  metaDescription: {
    type: String
  },
  metaKeywords: {
    type: String
  },
  template: {
    type: String,
    default: 'default'
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'private'],
    default: 'published'
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Page = mongoose.model('Page', pageSchema);

// Release/Update Schema
const releaseSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  changelog: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['major', 'minor', 'patch'],
    default: 'patch'
  },
  status: {
    type: String,
    enum: ['released', 'beta', 'alpha', 'planned'],
    default: 'planned'
  },
  releaseDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Release = mongoose.model('Release', releaseSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['bug', 'feature', 'support', 'general'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'replied', 'resolved', 'archived'],
    default: 'new'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  reply: {
    type: String
  },
  repliedAt: {
    type: Date
  },
  repliedBy: {
    type: String
  }
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);



// JWT middleware with automatic token refresh
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    
    // Generate new token with extended expiry (30 days from now)
    const newToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Add new token to response headers for client to update
    res.set('X-New-Token', newToken);
    
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Admin middleware for admin routes - simplified for development
const authenticateAdmin = async (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  const authHeader = req.headers['authorization'];
  
  // Simple admin key for development
  if (adminKey === 'admin-key-discard-2025') {
    req.user = { _id: 'admin', isAdmin: true };
    return next();
  }
  
  // Or check JWT token
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      
      if (decoded.userId === 'admin' && decoded.isAdmin) {
        req.user = { _id: 'admin', isAdmin: true };
        return next();
      }
      
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      console.error('JWT verification failed:', error.message);
    }
  }
  
  res.status(403).json({ error: 'Admin access denied' });
};

// Admin Routes

// Get all users for admin panel
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const status = req.query.status || '';
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get users with pagination
    const users = await User.find(query)
      .select('-password -encryptionKey -verificationCode')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    // Format user data for admin panel
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      language: user.language || 'uk',
      cardsCount: user.cards ? user.cards.length : 0,
      registrationDate: user.createdAt,
      lastLogin: user.updatedAt,
      status: user.cards && user.cards.length > 0 ? 'active' : 'inactive',
      twoFactorEnabled: true, // 2FA is enabled by default for all users in disCard
      encryptionEnabled: user.cards && user.cards.some(card => card.isEncrypted)
    }));
    
    res.json({
      success: true,
      users: formattedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Get user statistics for admin dashboard
app.get('/api/admin/users/stats', authenticateAdmin, async (req, res) => {
  try {
    const total = await User.countDocuments();
    
    // Users registered today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = await User.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Users registered this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth }
    });
    
    // Active users (users with cards)
    const active = await User.countDocuments({
      'cards.0': { $exists: true }
    });
    
    // Users with 2FA enabled (all users have 2FA by default in disCard)
    const twoFactorUsers = total;
    
    // Users with encrypted cards
    const encryptedUsers = await User.countDocuments({
      'cards.isEncrypted': true
    });
    
    res.json({
      success: true,
      stats: {
        total,
        active,
        inactive: total - active,
        newToday,
        newThisMonth,
        twoFactorUsers,
        encryptedUsers
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics'
    });
  }
});

// Block/unblock user
app.put('/api/admin/users/:userId/:action', authenticateAdmin, async (req, res) => {
  try {
    const { userId, action } = req.params;
    
    if (!['block', 'unblock'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action'
      });
    }
    
    // For now, just return success
    // In production, implement actual blocking logic
    res.json({
      success: true,
      message: `User ${action}ed successfully`
    });
  } catch (error) {
    console.error(`Error ${req.params.action} user:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to ${req.params.action} user`
    });
  }
});

// Get specific user details
app.get('/api/admin/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password -verificationCode');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Format user details for admin view
    const userDetails = {
      id: user._id,
      name: user.name,
      email: user.email,
      language: user.language || 'uk',
      registrationDate: user.createdAt,
      lastActivity: user.updatedAt,
      twoFactorEnabled: true, // 2FA is enabled by default for all users in disCard
      encryptionKey: user.encryptionKey ? 'Enabled' : 'Disabled',
      cards: user.cards.map(card => ({
        id: card._id,
        name: card.name,
        type: card.codeType,
        color: card.color || '#3b82f6',
        isEncrypted: card.isEncrypted || false,
        createdAt: card.createdAt
      })),
      stats: {
        totalCards: user.cards.length,
        encryptedCards: user.cards.filter(card => card.isEncrypted).length,
        barcodes: user.cards.filter(card => card.codeType === 'barcode').length,
        qrcodes: user.cards.filter(card => card.codeType === 'qrcode').length
      }
    };
    
    res.json({
      success: true,
      user: userDetails
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user details'
    });
  }
});

// Delete user
app.delete('/api/admin/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// Get analytics data for admin dashboard
app.get('/api/admin/analytics', authenticateAdmin, async (req, res) => {
  try {
    const period = req.query.period || '7days';
    
    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '24hours':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    
    // Get registration data by day
    const registrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get cards creation data
    const cardsCreated = await User.aggregate([
      { $unwind: "$cards" },
      {
        $match: {
          "cards.createdAt": { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$cards.createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get total stats
    const totalUsers = await User.countDocuments();
    const totalCards = await User.aggregate([
      { $project: { cardCount: { $size: "$cards" } } },
      { $group: { _id: null, total: { $sum: "$cardCount" } } }
    ]);
    
    res.json({
      success: true,
      data: {
        registrations,
        cardsCreated,
        summary: {
          totalUsers,
          totalCards: totalCards[0]?.total || 0,
          period
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics data'
    });
  }
});

// Get blog statistics for analytics
app.get('/api/admin/blog/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalPosts = await BlogPost.countDocuments();
    const publishedPosts = await BlogPost.countDocuments({ status: 'published' });
    const draftPosts = await BlogPost.countDocuments({ status: 'draft' });
    
    // Calculate total views (for now, use a simple formula based on posts)
    const totalViews = publishedPosts * 50; // Placeholder - in production, track actual views
    
    res.json({
      success: true,
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews
      }
    });
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog statistics'
    });
  }
});

// Get system settings
app.get('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    // In production, these would be stored in database or config files
    const settings = {
      general: {
        siteName: process.env.SITE_NAME || 'disCard - Цифрові карти лояльності',
        siteTagline: process.env.SITE_TAGLINE || 'Ваш цифровий гаманець для карт лояльності',
        supportEmail: process.env.ADMIN_EMAIL || 'support@discard.ua',
        defaultLanguage: 'uk',
        siteDescription: 'disCard - інноваційний сервіс для зберігання та управління картами лояльності. Забудьте про фізичні картки - тримайте всі бонусні карти в одному зручному додатку.',
        maintenanceMode: false,
        registrationEnabled: true
      },
      seo: {
        seoTitle: 'disCard - Цифрові карти лояльності України',
        seoKeywords: 'карти лояльності, бонусні картки, цифровий гаманець, дисконтні карти',
        seoDescription: 'Зберігайте всі карти лояльності в одному місці з disCard. Безпечно, зручно та завжди під рукою. Підтримка QR та штрих-кодів.',
        googleAnalytics: process.env.GA_ID || '',
        googleConsole: process.env.GSC_CODE || '',
        seoIndexing: true
      },
      email: {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT) || 587,
        fromEmail: process.env.EMAIL_FROM || 'noreply@discard.ua',
        fromName: process.env.COMPANY_NAME || 'disCard',
        smtpUser: process.env.EMAIL_USER || '',
        smtpSecure: true
      },
      backup: {
        lastBackupTime: new Date().toISOString(),
        backupFrequency: 'daily',
        backupCount: 5,
        includeImages: true
      }
    };
    
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings'
    });
  }
});

// Update system settings
app.put('/api/admin/settings/:section', authenticateAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const settings = req.body;
    
    // In production, save to database or config files
    // For now, just validate and return success
    
    console.log(`Updating ${section} settings:`, settings);
    
    res.json({
      success: true,
      message: `${section} settings updated successfully`
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings'
    });
  }
});

// Test email configuration
app.post('/api/admin/settings/test-email', authenticateAdmin, async (req, res) => {
  try {
    const { testEmail } = req.body;
    
    // Use existing email configuration
    const testTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await testTransporter.sendMail({
      from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_FROM}>`,
      to: testEmail || process.env.ADMIN_EMAIL,
      subject: 'Тест налаштувань email - disCard',
      html: `
        <h2>Тестовий лист від disCard</h2>
        <p>Цей лист підтверджує, що налаштування email працюють правильно.</p>
        <p>Час відправки: ${new Date().toLocaleString('uk-UA')}</p>
        <hr>
        <p><small>Цей лист було надіслано автоматично з адмін-панелі disCard.</small></p>
      `
    });
    
    res.json({
      success: true,
      message: 'Тестовий email надіслано успішно'
    });
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({
      success: false,
      error: `Помилка відправки email: ${error.message}`
    });
  }
});

// Create backup
app.post('/api/admin/backup/create', authenticateAdmin, async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, 'backups');
    const backupFileName = `discard-backup-${timestamp}.zip`;
    const backupPath = path.join(backupDir, backupFileName);
    
    // Create backups directory if it doesn't exist
    await fs.ensureDir(backupDir);
    
    // Create zip archive
    const output = fs.createWriteStream(backupPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    let backupSize = 0;
    
    // Track archive events
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archive warning:', err);
      } else {
        throw err;
      }
    });
    
    archive.on('error', (err) => {
      throw err;
    });
    
    archive.on('end', () => {
      console.log(`Backup created: ${backupFileName} (${archive.pointer()} bytes)`);
    });
    
    // Pipe archive data to the file
    archive.pipe(output);
    
    // Add database export
    const dbData = {
      users: await User.find().select('-password').lean(),
      blogPosts: await BlogPost.find().lean(),
      pages: await Page.find().lean(),
      settings: await Settings.find().lean(),
      releases: await Release.find().lean(),
      feedback: await Feedback.find().lean(),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    archive.append(JSON.stringify(dbData, null, 2), { name: 'database.json' });
    
    // Add app configuration
    const config = {
      backup_version: '1.0.0',
      backup_date: new Date().toISOString(),
      app_version: '1.0.0',
      total_users: dbData.users.length,
      total_posts: dbData.blogPosts.length,
      total_pages: dbData.pages.length
    };
    
    archive.append(JSON.stringify(config, null, 2), { name: 'backup-info.json' });
    
    // Finalize the archive
    await archive.finalize();
    
    // Wait for the output stream to close
    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
    });
    
    // Get file stats
    const stats = await fs.stat(backupPath);
    backupSize = stats.size;
    
    // Store backup info in database
    const backupInfo = {
      filename: backupFileName,
      timestamp: new Date().toISOString(),
      size: backupSize,
      path: backupPath,
      users_count: dbData.users.length,
      posts_count: dbData.blogPosts.length,
      pages_count: dbData.pages.length
    };
    
    res.json({
      success: true,
      message: 'Резервна копія створена успішно',
      backup: {
        filename: backupFileName,
        timestamp: backupInfo.timestamp,
        size: `${(backupSize / 1024 / 1024).toFixed(2)} MB`,
        users: dbData.users.length,
        posts: dbData.blogPosts.length,
        pages: dbData.pages.length,
        downloadUrl: `/api/admin/backup/download/${backupFileName}`
      }
    });
  } catch (error) {
    console.error('Backup creation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Помилка створення резервної копії: ' + error.message
    });
  }
});

// Download backup file
app.get('/api/admin/backup/download/:filename', authenticateAdmin, async (req, res) => {
  try {
    const { filename } = req.params;
    const backupPath = path.join(__dirname, 'backups', filename);
    
    // Check if file exists
    if (!(await fs.pathExists(backupPath))) {
      return res.status(404).json({
        success: false,
        error: 'Файл резервної копії не знайдено'
      });
    }
    
    // Security check - ensure filename is safe
    if (!filename.match(/^(discard-backup-|auto-backup-)[\d-TZ]+\.zip$/)) {
      return res.status(400).json({
        success: false,
        error: 'Недійсна назва файлу'
      });
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(backupPath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Помилка завантаження файлу'
        });
      }
    });
    
  } catch (error) {
    console.error('Download backup failed:', error);
    res.status(500).json({
      success: false,
      error: 'Помилка завантаження резервної копії'
    });
  }
});

// Get list of backup files
app.get('/api/admin/backup/list', authenticateAdmin, async (req, res) => {
  try {
    const backupDir = path.join(__dirname, 'backups');
    
    // Ensure backup directory exists
    await fs.ensureDir(backupDir);
    
    const files = await fs.readdir(backupDir);
    const backupFiles = [];
    
    for (const file of files) {
      if (file.endsWith('.zip') && file.startsWith('discard-backup-')) {
        const filePath = path.join(backupDir, file);
        const stats = await fs.stat(filePath);
        
        backupFiles.push({
          filename: file,
          size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
          created: stats.mtime.toISOString(),
          downloadUrl: `/api/admin/backup/download/${file}`
        });
      }
    }
    
    // Sort by creation date (newest first)
    backupFiles.sort((a, b) => new Date(b.created) - new Date(a.created));
    
    res.json({
      success: true,
      backups: backupFiles
    });
  } catch (error) {
    console.error('List backups failed:', error);
    res.status(500).json({
      success: false,
      error: 'Помилка отримання списку резервних копій'
    });
  }
});

// Restore from backup
app.post('/api/admin/backup/restore', authenticateAdmin, upload.single('backupFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Файл резервної копії не завантажено'
      });
    }
    
    const uploadedFile = req.file.path;
    const extractDir = path.join(__dirname, 'temp', `restore-${Date.now()}`);
    
    // Create extraction directory
    await fs.ensureDir(extractDir);
    
    console.log('Extracting backup file:', uploadedFile);
    
    // Extract ZIP file
    await extract(uploadedFile, { dir: extractDir });
    
    // Read database.json
    const dbFilePath = path.join(extractDir, 'database.json');
    if (!(await fs.pathExists(dbFilePath))) {
      throw new Error('Файл database.json не знайдено в резервній копії');
    }
    
    const dbData = await fs.readJson(dbFilePath);
    
    // Validate backup data
    if (!dbData.users || !Array.isArray(dbData.users)) {
      throw new Error('Недійсні дані користувачів в резервній копії');
    }
    
    console.log('Starting database restoration...');
    
    // Backup current data before restoration (safety measure)
    const safetyBackupDir = path.join(__dirname, 'backups', 'safety');
    await fs.ensureDir(safetyBackupDir);
    
    const currentData = {
      users: await User.find().select('-password').lean(),
      blogPosts: await BlogPost.find().lean(),
      pages: await Page.find().lean(),
      settings: await Settings.find().lean(),
      releases: await Release.find().lean(),
      feedback: await Feedback.find().lean(),
      timestamp: new Date().toISOString()
    };
    
    const safetyBackupPath = path.join(safetyBackupDir, `safety-backup-${Date.now()}.json`);
    await fs.writeJson(safetyBackupPath, currentData);
    
    // Clear existing data
    await User.deleteMany({});
    await BlogPost.deleteMany({});
    await Page.deleteMany({});
    await Settings.deleteMany({});
    await Release.deleteMany({});
    await Feedback.deleteMany({});
    
    // Restore data
    let restoredCounts = {
      users: 0,
      blogPosts: 0,
      pages: 0,
      settings: 0,
      releases: 0,
      feedback: 0
    };
    
    // Restore users (hash passwords if they're not already hashed)
    if (dbData.users && dbData.users.length > 0) {
      for (const userData of dbData.users) {
        // Ensure password is hashed
        if (userData.password && !userData.password.startsWith('$2a$')) {
          userData.password = await bcrypt.hash(userData.password, 12);
        }
        const user = new User(userData);
        await user.save();
        restoredCounts.users++;
      }
    }
    
    // Restore blog posts
    if (dbData.blogPosts && dbData.blogPosts.length > 0) {
      await BlogPost.insertMany(dbData.blogPosts);
      restoredCounts.blogPosts = dbData.blogPosts.length;
    }
    
    // Restore pages
    if (dbData.pages && dbData.pages.length > 0) {
      await Page.insertMany(dbData.pages);
      restoredCounts.pages = dbData.pages.length;
    }
    
    // Restore settings
    if (dbData.settings && dbData.settings.length > 0) {
      await Settings.insertMany(dbData.settings);
      restoredCounts.settings = dbData.settings.length;
    }
    
    // Restore releases
    if (dbData.releases && dbData.releases.length > 0) {
      await Release.insertMany(dbData.releases);
      restoredCounts.releases = dbData.releases.length;
    }
    
    // Restore feedback
    if (dbData.feedback && dbData.feedback.length > 0) {
      await Feedback.insertMany(dbData.feedback);
      restoredCounts.feedback = dbData.feedback.length;
    }
    
    // Cleanup
    await fs.remove(extractDir);
    await fs.remove(uploadedFile);
    
    console.log('Database restoration completed:', restoredCounts);
    
    res.json({
      success: true,
      message: 'Дані успішно відновлено з резервної копії',
      restored: restoredCounts,
      backup_date: dbData.timestamp,
      safety_backup: safetyBackupPath
    });
    
  } catch (error) {
    console.error('Backup restoration failed:', error);
    
    // Cleanup on error
    if (req.file) {
      try {
        await fs.remove(req.file.path);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      error: 'Помилка відновлення з резервної копії: ' + error.message
    });
  }
});

// Initialize default blog posts in MongoDB if none exist
async function initializeBlogPosts() {
  try {
    const count = await BlogPost.countDocuments();
    if (count === 0) {
      const defaultPosts = [
        {
          title: 'Як організувати цифровий гаманець',
          excerpt: 'Дізнайтеся, як ефективно організувати свої цифрові картки та документи у одному зручному додатку.',
          content: '<h2>Як організувати цифровий гаманець</h2>\n\n<p>У сучасному світі цифрових технологій важливо мати всі свої документи та картки в одному місці. disCard допомагає вам організувати цифровий гаманець максимально ефективно.</p>\n\n<h3>Основні принципи організації</h3>\n<ul>\n<li>Структуруйте картки за категоріями</li>\n<li>Використовуйте описові назви</li>\n<li>Регулярно оновлюйте інформацію</li>\n</ul>',
          category: 'guides',
          status: 'published',
          author: 'disCard Team',
          tags: 'організація, цифровий гаманець, поради',
          filename: 'organize-digital-wallet.html',
          views: 1247,
          wordCount: 850,
          publishedDate: new Date('2024-09-15')
        },
        {
          title: 'PWA vs нативні додатки: чому ми обрали PWA',
          excerpt: 'Розбираємо переваги Progressive Web Apps та чому ми вибрали цю технологію для disCard.',
          content: '<h2>PWA vs нативні додатки</h2>\n\n<p>При розробці disCard ми стояли перед вибором: створювати нативний додаток чи Progressive Web App. Ось чому ми обрали PWA.</p>\n\n<h3>Переваги PWA</h3>\n<ul>\n<li>Кроссплатформенність</li>\n<li>Швидке завантаження</li>\n<li>Офлайн робота</li>\n<li>Легке оновлення</li>\n</ul>',
          category: 'tech',
          status: 'published',
          author: 'disCard Team',
          tags: 'pwa, технології, розробка',
          filename: 'pwa-vs-native-apps.html',
          views: 892,
          wordCount: 1200,
          publishedDate: new Date('2024-09-18')
        }
      ];

      await BlogPost.insertMany(defaultPosts);
      console.log('Default blog posts initialized');
    }
  } catch (error) {
    console.error('Error initializing blog posts:', error);
  }
}

// Initialize blog posts on server start
initializeBlogPosts();

// Initialize default pages in MongoDB if none exist
async function initializePages() {
  try {
    const count = await Page.countDocuments();
    if (count === 0) {
      const defaultPages = [
        {
          slug: 'about',
          title: 'Про нас',
          content: '<h1>Про disCard</h1>\n\n<p>disCard - це інноваційний сервіс для створення та зберігання цифрових карток лояльності. Ми допомагаємо користувачам організувати всі свої бонусні картки в одному зручному місці.</p>\n\n<h2>Наша місія</h2>\n<p>Зробити життя простішим, забезпечивши безпечне та зручне зберігання всіх карток лояльності в цифровому форматі.</p>\n\n<h2>Переваги disCard</h2>\n<ul>\n<li>🔒 Безпечне зберігання</li>\n<li>📱 Зручний інтерфейс</li>\n<li>☁️ Синхронізація між пристроями</li>\n<li>🌐 Доступ в будь-якому місці</li>\n</ul>',
          metaTitle: 'Про нас - disCard',
          metaDescription: 'Дізнайтеся більше про disCard - інноваційний сервіс для зберігання цифрових карток лояльності.',
          metaKeywords: 'про нас, discard, компанія, цифрові картки',
          status: 'published'
        },
        {
          slug: 'contact',
          title: 'Контакти',
          content: '<h1>Зв\'яжіться з нами</h1>\n\n<p>Ми завжди готові допомогти вам з будь-якими питаннями щодо використання disCard.</p>\n\n<h2>Контактна інформація</h2>\n<ul>\n<li>📧 Email: support@discard.ua</li>\n<li>📞 Телефон: +380 (44) 123-45-67</li>\n<li>🏢 Адреса: м. Київ, вул. Технологічна, 1</li>\n</ul>\n\n<h2>Форма зворотного зв\'язку</h2>\n<p>Ви також можете скористатися формою нижче для зв\'язку з нами:</p>',
          metaTitle: 'Контакти - disCard',
          metaDescription: 'Зв\'яжіться з командою disCard. Ми готові відповісти на всі ваші питання.',
          metaKeywords: 'контакти, підтримка, зв\'язок, discard',
          status: 'published'
        },
        {
          slug: 'faq',
          title: 'Часті питання (FAQ)',
          content: '<h1>Часті питання</h1>\n\n<h2>Що таке disCard?</h2>\n<p>disCard - це додаток для зберігання цифрових карток лояльності, який дозволяє вам тримати всі бонусні картки в одному місці.</p>\n\n<h2>Чи безпечно зберігати картки в додатку?</h2>\n<p>Так, ми використовуємо найсучасніші технології шифрування для захисту ваших даних.</p>\n\n<h2>Чи працює додаток без інтернету?</h2>\n<p>Так, основні функції додатку доступні навіть без підключення до інтернету.</p>\n\n<h2>Як синхронізувати дані між пристроями?</h2>\n<p>Створіть обліковий запис та увійдіть в нього на всіх пристроях для автоматичної синхронізації.</p>',
          metaTitle: 'FAQ - disCard',
          metaDescription: 'Відповіді на найчастіші питання про використання disCard.',
          metaKeywords: 'faq, питання, відповіді, допомога, discard',
          status: 'published'
        }
      ];

      await Page.insertMany(defaultPages);
      console.log('Default pages initialized');
    }
  } catch (error) {
    console.error('Error initializing pages:', error);
  }
}

// Initialize pages on server start
initializePages();

// Get blog posts for admin panel
app.get('/api/admin/blog/posts', authenticateAdmin, async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .lean();
    
    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      filename: post.filename,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      status: post.status,
      date: post.publishedDate ? post.publishedDate.toISOString().split('T')[0] : post.createdAt.toISOString().split('T')[0],
      author: post.author,
      views: post.views,
      wordCount: post.wordCount,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));
    
    res.json({
      success: true,
      data: formattedPosts,
      total: formattedPosts.length
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts'
    });
  }
});

// Create new blog post
app.post('/api/admin/blog/posts', authenticateAdmin, [
  body('title').trim().isLength({ min: 3, max: 200 }).escape(),
  body('content').trim().isLength({ min: 10 }),
  body('category').isIn(['news', 'guides', 'tech', 'tutorials', 'updates']),
  body('status').isIn(['published', 'draft', 'scheduled'])
], handleValidationErrors, async (req, res) => {
  try {
    const { title, excerpt, content, category, status, author, tags, scheduleDate } = req.body;
    
    const newPost = new BlogPost({
      title,
      excerpt: excerpt || title + ' - дізнайтеся більше у нашому блозі.',
      content,
      category,
      status,
      author: author || 'disCard Team',
      tags: tags || '',
      filename: title.toLowerCase().replace(/[^a-zа-я0-9]/g, '-').replace(/-+/g, '-') + '.html',
      views: 0,
      wordCount: content.split(' ').length,
      scheduledDate: status === 'scheduled' && scheduleDate ? new Date(scheduleDate) : null,
      publishedDate: status === 'published' ? new Date() : null
    });
    
    await newPost.save();
    
    res.json({
      success: true,
      message: 'Post created successfully',
      post: {
        id: newPost._id.toString(),
        title: newPost.title,
        excerpt: newPost.excerpt,
        category: newPost.category,
        status: newPost.status,
        author: newPost.author,
        views: newPost.views
      }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create blog post'
    });
  }
});

// Update blog post
app.put('/api/admin/blog/posts/:id', authenticateAdmin, [
  body('title').trim().isLength({ min: 3, max: 200 }).escape(),
  body('content').trim().isLength({ min: 10 }),
  body('category').isIn(['news', 'guides', 'tech', 'tutorials', 'updates']),
  body('status').isIn(['published', 'draft', 'scheduled'])
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, status, author, tags, scheduleDate } = req.body;
    
    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    const wasPublished = post.status === 'published';
    
    post.title = title;
    post.excerpt = excerpt || post.excerpt;
    post.content = content;
    post.category = category;
    post.status = status;
    post.author = author || post.author;
    post.tags = tags || post.tags;
    post.wordCount = content.split(' ').length;
    
    if (status === 'scheduled' && scheduleDate) {
      post.scheduledDate = new Date(scheduleDate);
    } else if (status === 'published' && !wasPublished) {
      post.publishedDate = new Date();
    }
    
    await post.save();
    
    res.json({
      success: true,
      message: 'Post updated successfully',
      post: {
        id: post._id.toString(),
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        status: post.status,
        author: post.author
      }
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update blog post'
    });
  }
});

// Delete blog post
app.delete('/api/admin/blog/posts/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete blog post'
    });
  }
});

// Get single blog post for public view
app.get('/api/blog/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findOne({ 
      _id: id, 
      status: 'published' 
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.json({
      success: true,
      post: {
        id: post._id.toString(),
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        author: post.author,
        tags: post.tags,
        views: post.views,
        date: post.publishedDate ? post.publishedDate.toISOString().split('T')[0] : post.createdAt.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog post'
    });
  }
});

// Get published blog posts for public blog page
app.get('/api/blog/posts', async (req, res) => {
  try {
    const publishedPosts = await BlogPost.find({ status: 'published' })
      .sort({ publishedDate: -1, createdAt: -1 })
      .lean();
    
    const formattedPosts = publishedPosts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date: post.publishedDate ? post.publishedDate.toISOString().split('T')[0] : post.createdAt.toISOString().split('T')[0],
      author: post.author,
      views: post.views,
      tags: post.tags
    }));
    
    res.json({
      success: true,
      posts: formattedPosts,
      total: formattedPosts.length
    });
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts'
    });
  }
});

// PAGES MANAGEMENT API

// Get all pages for admin panel
app.get('/api/admin/pages', authenticateAdmin, async (req, res) => {
  try {
    const pages = await Page.find()
      .sort({ updatedAt: -1 })
      .lean();
    
    const formattedPages = pages.map(page => ({
      id: page._id.toString(),
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      metaKeywords: page.metaKeywords,
      template: page.template,
      status: page.status,
      views: page.views,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt
    }));
    
    res.json({
      success: true,
      data: formattedPages,
      total: formattedPages.length
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pages'
    });
  }
});

// Create new page
app.post('/api/admin/pages', authenticateAdmin, [
  body('title').trim().isLength({ min: 3, max: 200 }).escape(),
  body('slug').trim().isLength({ min: 1, max: 100 }).matches(/^[a-z0-9-]+$/),
  body('content').trim().isLength({ min: 10 }),
  body('status').isIn(['published', 'draft', 'private'])
], handleValidationErrors, async (req, res) => {
  try {
    const { title, slug, content, metaTitle, metaDescription, metaKeywords, template, status } = req.body;
    
    // Check if slug already exists
    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        error: 'Page with this slug already exists'
      });
    }
    
    const newPage = new Page({
      title,
      slug,
      content,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || '',
      metaKeywords: metaKeywords || '',
      template: template || 'default',
      status,
      views: 0
    });
    
    await newPage.save();
    
    res.json({
      success: true,
      message: 'Page created successfully',
      page: {
        id: newPage._id.toString(),
        title: newPage.title,
        slug: newPage.slug,
        status: newPage.status
      }
    });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create page'
    });
  }
});

// Update page
app.put('/api/admin/pages/:id', authenticateAdmin, [
  body('title').trim().isLength({ min: 3, max: 200 }).escape(),
  body('slug').trim().isLength({ min: 1, max: 100 }).matches(/^[a-z0-9-]+$/),
  body('content').trim().isLength({ min: 10 }),
  body('status').isIn(['published', 'draft', 'private'])
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, metaTitle, metaDescription, metaKeywords, template, status } = req.body;
    
    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }
    
    // Check if slug already exists (excluding current page)
    if (slug !== page.slug) {
      const existingPage = await Page.findOne({ slug });
      if (existingPage) {
        return res.status(400).json({
          success: false,
          error: 'Page with this slug already exists'
        });
      }
    }
    
    page.title = title;
    page.slug = slug;
    page.content = content;
    page.metaTitle = metaTitle || title;
    page.metaDescription = metaDescription || '';
    page.metaKeywords = metaKeywords || '';
    page.template = template || 'default';
    page.status = status;
    
    await page.save();
    
    res.json({
      success: true,
      message: 'Page updated successfully',
      page: {
        id: page._id.toString(),
        title: page.title,
        slug: page.slug,
        status: page.status
      }
    });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update page'
    });
  }
});

// Delete page
app.delete('/api/admin/pages/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPage = await Page.findByIdAndDelete(id);
    if (!deletedPage) {
      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete page'
    });
  }
});

// SETTINGS MANAGEMENT API

// Get all settings for admin panel
app.get('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    const settings = await Settings.find().lean();
    
    // Convert array of settings to object format for easier frontend handling
    const settingsObject = {};
    settings.forEach(setting => {
      settingsObject[setting.key] = {
        value: setting.value,
        category: setting.category,
        description: setting.description,
        updatedAt: setting.updatedAt
      };
    });
    
    res.json({
      success: true,
      data: settingsObject,
      total: settings.length
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings'
    });
  }
});

// Update multiple settings
app.put('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    const settingsData = req.body;
    const results = [];
    
    for (const [key, data] of Object.entries(settingsData)) {
      const { value, category, description } = data;
      
      const result = await Settings.findOneAndUpdate(
        { key },
        { 
          value, 
          category: category || 'general',
          description: description || ''
        },
        { 
          upsert: true, 
          new: true,
          runValidators: true
        }
      );
      
      results.push({
        key,
        value: result.value,
        updated: true
      });
    }
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: results
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings'
    });
  }
});

// Update single setting
app.put('/api/admin/settings/:key', authenticateAdmin, [
  body('value').exists(),
  body('category').optional().isIn(['general', 'seo', 'email', 'security', 'backup'])
], handleValidationErrors, async (req, res) => {
  try {
    const { key } = req.params;
    const { value, category, description } = req.body;
    
    const setting = await Settings.findOneAndUpdate(
      { key },
      { 
        value, 
        category: category || 'general',
        description: description || ''
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true
      }
    );
    
    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: {
        key: setting.key,
        value: setting.value,
        category: setting.category,
        description: setting.description,
        updatedAt: setting.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update setting'
    });
  }
});

// Get single setting by key
app.get('/api/admin/settings/:key', authenticateAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await Settings.findOne({ key }).lean();
    if (!setting) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        key: setting.key,
        value: setting.value,
        category: setting.category,
        description: setting.description,
        updatedAt: setting.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch setting'
    });
  }
});

// Delete setting
app.delete('/api/admin/settings/:key', authenticateAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    
    const deletedSetting = await Settings.findOneAndDelete({ key });
    if (!deletedSetting) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete setting'
    });
  }
});

// Initialize default settings
app.post('/api/admin/settings/init', authenticateAdmin, async (req, res) => {
  try {
    const defaultSettings = [
      // General settings
      { key: 'siteName', value: 'disCard', category: 'general', description: 'Назва сайту' },
      { key: 'siteDescription', value: 'Цифрові картки лояльності в одному додатку', category: 'general', description: 'Опис сайту' },
      { key: 'adminEmail', value: 'admin@discard.com.ua', category: 'general', description: 'Email адміністратора' },
      { key: 'timezone', value: 'Europe/Kiev', category: 'general', description: 'Часовий пояс' },
      
      // SEO settings
      { key: 'seoTitle', value: 'disCard - Всі карти лояльності в одному місці', category: 'seo', description: 'SEO заголовок' },
      { key: 'seoKeywords', value: 'карти лояльності, мобільний додаток, PWA, України', category: 'seo', description: 'SEO ключові слова' },
      { key: 'seoDescription', value: 'Скануй, зберігай та використовуй картки магазинів у зручному мобільному додатку', category: 'seo', description: 'SEO опис' },
      
      // Email settings
      { key: 'smtpHost', value: 'smtp.gmail.com', category: 'email', description: 'SMTP хост' },
      { key: 'smtpPort', value: 587, category: 'email', description: 'SMTP порт' },
      { key: 'smtpUser', value: '', category: 'email', description: 'SMTP користувач' },
      { key: 'emailNotifications', value: true, category: 'email', description: 'Email сповіщення' },
      
      // Security settings
      { key: 'twoFactorAuth', value: true, category: 'security', description: 'Двофакторна автентифікація' },
      { key: 'sessionTimeout', value: 30, category: 'security', description: 'Час сесії (хвилини)' },
      { key: 'maxLoginAttempts', value: 5, category: 'security', description: 'Максимум спроб входу' },
      { key: 'ipWhitelist', value: false, category: 'security', description: 'Білий список IP' },
      
      // Backup settings
      { key: 'autoBackup', value: true, category: 'backup', description: 'Автоматичні бекапи' },
      { key: 'backupFrequency', value: 'daily', category: 'backup', description: 'Частота бекапів' },
      { key: 'backupRetention', value: 30, category: 'backup', description: 'Зберігання бекапів (дні)' }
    ];
    
    const results = [];
    for (const setting of defaultSettings) {
      const existing = await Settings.findOne({ key: setting.key });
      if (!existing) {
        const newSetting = new Settings(setting);
        await newSetting.save();
        results.push({ key: setting.key, created: true });
      } else {
        results.push({ key: setting.key, exists: true });
      }
    }
    
    res.json({
      success: true,
      message: 'Default settings initialized',
      data: results
    });
  } catch (error) {
    console.error('Error initializing settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize settings'
    });
  }
});

// RELEASES MANAGEMENT API

// Get all releases for admin panel
app.get('/api/admin/releases', authenticateAdmin, async (req, res) => {
  try {
    const releases = await Release.find()
      .sort({ createdAt: -1 })
      .lean();
    
    const formattedReleases = releases.map(release => ({
      id: release._id.toString(),
      version: release.version,
      title: release.title,
      type: release.type,
      status: release.status,
      description: release.description,
      changelog: release.changelog,
      releaseDate: release.releaseDate,
      downloadUrl: release.downloadUrl,
      downloads: release.downloads,
      tags: release.tags,
      features: release.features,
      bugfixes: release.bugfixes,
      breaking: release.breaking,
      createdAt: release.createdAt,
      updatedAt: release.updatedAt
    }));
    
    res.json({
      success: true,
      data: formattedReleases,
      total: formattedReleases.length
    });
  } catch (error) {
    console.error('Error fetching releases:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch releases'
    });
  }
});

// Create new release
app.post('/api/admin/releases', authenticateAdmin, [
  body('version').trim().isLength({ min: 1, max: 20 }).matches(/^\d+\.\d+\.\d+.*$/),
  body('title').trim().isLength({ min: 3, max: 200 }).escape(),
  body('type').isIn(['major', 'minor', 'patch', 'hotfix']),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('changelog').trim().isLength({ min: 10 }),
  body('status').optional().isIn(['development', 'testing', 'staging', 'released', 'archived'])
], handleValidationErrors, async (req, res) => {
  try {
    const { 
      version, title, type, description, changelog, 
      releaseDate, downloadUrl, tags, features, bugfixes, breaking, status 
    } = req.body;
    
    // Check if version already exists
    const existingRelease = await Release.findOne({ version });
    if (existingRelease) {
      return res.status(400).json({
        success: false,
        error: 'Release with this version already exists'
      });
    }
    
    const newRelease = new Release({
      version,
      title,
      type,
      status: status || 'development',
      description,
      changelog,
      releaseDate: releaseDate ? new Date(releaseDate) : null,
      downloadUrl: downloadUrl || '',
      tags: tags || [],
      features: features || [],
      bugfixes: bugfixes || [],
      breaking: breaking || [],
      downloads: 0
    });
    
    await newRelease.save();
    
    res.json({
      success: true,
      message: 'Release created successfully',
      release: {
        id: newRelease._id.toString(),
        version: newRelease.version,
        title: newRelease.title,
        status: newRelease.status
      }
    });
  } catch (error) {
    console.error('Error creating release:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create release'
    });
  }
});

// Update release
app.put('/api/admin/releases/:id', authenticateAdmin, [
  body('version').trim().isLength({ min: 1, max: 20 }).matches(/^\d+\.\d+\.\d+.*$/),
  body('title').trim().isLength({ min: 3, max: 200 }).escape(),
  body('type').isIn(['major', 'minor', 'patch', 'hotfix']),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('changelog').trim().isLength({ min: 10 }),
  body('status').isIn(['development', 'testing', 'staging', 'released', 'archived'])
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      version, title, type, description, changelog, 
      releaseDate, downloadUrl, tags, features, bugfixes, breaking, status 
    } = req.body;
    
    const release = await Release.findById(id);
    if (!release) {
      return res.status(404).json({
        success: false,
        error: 'Release not found'
      });
    }
    
    // Check if version already exists (excluding current release)
    if (version !== release.version) {
      const existingRelease = await Release.findOne({ version });
      if (existingRelease) {
        return res.status(400).json({
          success: false,
          error: 'Release with this version already exists'
        });
      }
    }
    
    release.version = version;
    release.title = title;
    release.type = type;
    release.status = status;
    release.description = description;
    release.changelog = changelog;
    release.releaseDate = releaseDate ? new Date(releaseDate) : release.releaseDate;
    release.downloadUrl = downloadUrl || '';
    release.tags = tags || [];
    release.features = features || [];
    release.bugfixes = bugfixes || [];
    release.breaking = breaking || [];
    
    await release.save();
    
    res.json({
      success: true,
      message: 'Release updated successfully',
      release: {
        id: release._id.toString(),
        version: release.version,
        title: release.title,
        status: release.status
      }
    });
  } catch (error) {
    console.error('Error updating release:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update release'
    });
  }
});

// Delete release
app.delete('/api/admin/releases/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRelease = await Release.findByIdAndDelete(id);
    if (!deletedRelease) {
      return res.status(404).json({
        success: false,
        error: 'Release not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Release deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting release:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete release'
    });
  }
});

// Get public releases (only released status)
app.get('/api/releases', async (req, res) => {
  try {
    const releases = await Release.find({ status: 'released' })
      .select('version title type description releaseDate downloadUrl downloads tags features')
      .sort({ releaseDate: -1 })
      .lean();
    
    const formattedReleases = releases.map(release => ({
      id: release._id.toString(),
      version: release.version,
      title: release.title,
      type: release.type,
      description: release.description,
      releaseDate: release.releaseDate,
      downloadUrl: release.downloadUrl,
      downloads: release.downloads,
      tags: release.tags,
      features: release.features
    }));
    
    res.json({
      success: true,
      releases: formattedReleases,
      total: formattedReleases.length
    });
  } catch (error) {
    console.error('Error fetching public releases:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch releases'
    });
  }
});

// Get single release for public view
app.get('/api/releases/:version', async (req, res) => {
  try {
    const { version } = req.params;
    const release = await Release.findOne({ 
      version, 
      status: 'released' 
    }).lean();
    
    if (!release) {
      return res.status(404).json({
        success: false,
        error: 'Release not found'
      });
    }
    
    res.json({
      success: true,
      release: {
        id: release._id.toString(),
        version: release.version,
        title: release.title,
        type: release.type,
        description: release.description,
        changelog: release.changelog,
        releaseDate: release.releaseDate,
        downloadUrl: release.downloadUrl,
        downloads: release.downloads,
        tags: release.tags,
        features: release.features,
        bugfixes: release.bugfixes,
        breaking: release.breaking
      }
    });
  } catch (error) {
    console.error('Error fetching release:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch release'
    });
  }
});

// Track download count
app.post('/api/releases/:version/download', async (req, res) => {
  try {
    const { version } = req.params;
    const release = await Release.findOne({ version, status: 'released' });
    
    if (!release) {
      return res.status(404).json({
        success: false,
        error: 'Release not found'
      });
    }
    
    release.downloads += 1;
    await release.save();
    
    res.json({
      success: true,
      downloadUrl: release.downloadUrl,
      downloads: release.downloads
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track download'
    });
  }
});

// FEEDBACK MANAGEMENT API

// Get all feedback for admin panel
app.get('/api/admin/feedback', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || '';
    const type = req.query.type || '';
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (type && type !== 'all') {
      query.type = type;
    }
    
    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Feedback.countDocuments(query);
    
    const formattedFeedback = feedback.map(item => ({
      id: item._id.toString(),
      user: item.user,
      email: item.email,
      type: item.type,
      status: item.status,
      message: item.message,
      rating: item.rating,
      reply: item.reply,
      repliedAt: item.repliedAt,
      repliedBy: item.repliedBy,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    
    res.json({
      success: true,
      data: formattedFeedback,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feedback'
    });
  }
});

// Get feedback statistics for admin dashboard
app.get('/api/admin/feedback/stats', authenticateAdmin, async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const newFeedback = await Feedback.countDocuments({ status: 'new' });
    const repliedFeedback = await Feedback.countDocuments({ status: 'replied' });
    
    // Calculate average rating
    const ratingStats = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalRatings: { $sum: 1 } } }
    ]);
    
    const avgRating = ratingStats.length > 0 ? ratingStats[0].avgRating : 0;
    
    // Feedback by type
    const byType = await Feedback.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // Recent feedback (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentFeedback = await Feedback.countDocuments({
      createdAt: { $gte: weekAgo }
    });
    
    res.json({
      success: true,
      stats: {
        total,
        new: newFeedback,
        replied: repliedFeedback,
        archived: total - newFeedback - repliedFeedback,
        avgRating: Math.round(avgRating * 10) / 10,
        recentFeedback,
        byType: byType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feedback statistics'
    });
  }
});

// Reply to feedback
app.put('/api/admin/feedback/:id/reply', authenticateAdmin, [
  body('reply').trim().isLength({ min: 5, max: 2000 })
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found'
      });
    }
    
    feedback.reply = reply;
    feedback.status = 'replied';
    feedback.repliedAt = new Date();
    feedback.repliedBy = req.user._id === 'admin' ? 'Admin' : req.user.name;
    
    await feedback.save();
    
    res.json({
      success: true,
      message: 'Reply sent successfully',
      feedback: {
        id: feedback._id.toString(),
        reply: feedback.reply,
        status: feedback.status,
        repliedAt: feedback.repliedAt
      }
    });
  } catch (error) {
    console.error('Error replying to feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send reply'
    });
  }
});

// Update feedback status
app.put('/api/admin/feedback/:id/status', authenticateAdmin, [
  body('status').isIn(['new', 'replied', 'archived'])
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found'
      });
    }
    
    feedback.status = status;
    await feedback.save();
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      feedback: {
        id: feedback._id.toString(),
        status: feedback.status
      }
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update status'
    });
  }
});

// Delete feedback
app.delete('/api/admin/feedback/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete feedback'
    });
  }
});

// Submit feedback (public endpoint)
app.post('/api/feedback', [
  body('user').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('type').isIn(['bug', 'feature', 'support', 'general']),
  body('message').trim().isLength({ min: 10, max: 2000 }),
  body('rating').isInt({ min: 1, max: 5 })
], handleValidationErrors, async (req, res) => {
  try {
    const { user, email, type, message, rating } = req.body;
    
    const newFeedback = new Feedback({
      user,
      email,
      type,
      message,
      rating,
      status: 'new'
    });
    
    await newFeedback.save();
    
    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: {
        id: newFeedback._id.toString(),
        user: newFeedback.user,
        type: newFeedback.type,
        rating: newFeedback.rating,
        createdAt: newFeedback.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
});

// Get single page for public view
app.get('/api/pages/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ 
      slug, 
      status: 'published' 
    });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }
    
    // Increment view count
    page.views += 1;
    await page.save();
    
    res.json({
      success: true,
      page: {
        id: page._id.toString(),
        title: page.title,
        content: page.content,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        metaKeywords: page.metaKeywords,
        template: page.template,
        views: page.views
      }
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch page'
    });
  }
});

// Routes

// Admin Login
app.post('/api/admin/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role, adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register
app.post('/api/auth/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6, max: 128 }),
  body('language').optional().isIn(['uk', 'en'])
], handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password, language = 'uk' } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      language,
      cards: []
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        language: user.language,
        createdAt: user.createdAt
      },
      token,
      cards: []
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if email is configured for 2FA
    const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    
    if (emailConfigured) {
      // Generate and save verification code
      const verificationCode = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.verificationCode = verificationCode;
      user.verificationCodeExpires = expiresAt;
      await user.save();

      // Send verification email with device info
      const userAgent = req.get('User-Agent') || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';
      const emailSent = await sendVerificationEmail(email, verificationCode, userAgent, ipAddress);
      
      if (!emailSent) {
        console.error('Failed to send 2FA email, falling back to direct login');
        // Fall through to direct login instead of failing
      } else {
        return res.json({
          requiresVerification: true,
          message: 'Verification code sent to your email',
          email: email
        });
      }
    }

    // Direct login without 2FA (if email not configured or sending failed)
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return cards with decrypted codes for client display
    let cardsToReturn = user.cards;
    if (user.encryptionKey && user.cards.length > 0) {
      cardsToReturn = user.cards.map(card => ({
        ...card.toObject(),
        code: card.isEncrypted ? decryptCardCode(card.encryptedCode, user.encryptionKey) : card.code,
        encryptedCode: undefined // Don't send encrypted data to client
      }));
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        language: user.language,
        createdAt: user.createdAt
      },
      token,
      cards: cardsToReturn
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify 2FA code
app.post('/api/auth/verify-code', [
  body('email').isEmail().normalizeEmail(),
  body('code').trim().isLength({ min: 5, max: 5 }).isNumeric()
], handleValidationErrors, async (req, res) => {
  try {
    const { email, code } = req.body;
    const trimmedCode = code.trim();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Check if code exists and is not expired
    if (!user.verificationCode || !user.verificationCodeExpires) {
      return res.status(400).json({ error: 'No verification code found' });
    }

    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({ error: 'Verification code expired' });
    }

    // Debug logging
    console.log('2FA Code Comparison:', {
      stored: user.verificationCode,
      received: trimmedCode,
      match: user.verificationCode === trimmedCode
    });

    // Check if code matches
    if (user.verificationCode !== trimmedCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Clear verification code
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return cards with decrypted codes for client display
    let cardsToReturn = user.cards;
    if (user.encryptionKey && user.cards.length > 0) {
      cardsToReturn = user.cards.map(card => ({
        ...card.toObject(),
        code: card.isEncrypted ? decryptCardCode(card.encryptedCode, user.encryptionKey) : card.code,
        encryptedCode: undefined // Don't send encrypted data to client
      }));
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        language: user.language,
        createdAt: user.createdAt
      },
      token,
      cards: cardsToReturn
    });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resend verification code
app.post('/api/auth/resend-code', [
  body('email').isEmail().normalizeEmail()
], handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = expiresAt;
    await user.save();

    // Send verification email with device info
    const userAgent = req.get('User-Agent') || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const emailSent = await sendVerificationEmail(email, verificationCode, userAgent, ipAddress);
    
    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password endpoint - generate and send new password
app.post('/api/auth/forgot-password', [
  body('email').isEmail().withMessage('Please provide a valid email')
], handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Користувача з такою електронною поштою не знайдено' });
    }

    // Generate new password
    const newPassword = generateRandomPassword();
    
    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update user password
    await User.findByIdAndUpdate(user._id, { 
      password: hashedPassword 
    });

    // Send email with new password
    const userAgent = req.get('User-Agent') || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    
    const emailSent = await sendNewPasswordEmail(user.email, newPassword, userAgent, ipAddress);
    
    if (!emailSent) {
      return res.status(500).json({ error: 'Помилка надсилання електронної пошти' });
    }

    console.log(`New password generated and sent to: ${user.email}`);
    res.json({ 
      message: `Новий пароль згенеровано та надіслано на ${user.email}`,
      email: user.email 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password endpoint
app.post('/api/auth/reset-password', [
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], handleValidationErrors, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if (decoded.action !== 'reset') {
      return res.status(400).json({ error: 'Invalid token type' });
    }

    // Find user
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log(`Password reset successful for user: ${user.email}`);
    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve reset password page
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

// Get current user with decrypted cards
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Decrypt cards for client display if user has encryption key
    let cardsToReturn = user.cards;
    if (user.encryptionKey && user.cards.length > 0) {
      cardsToReturn = user.cards.map(card => {
        if (card.isEncrypted && card.encryptedCode) {
          try {
            const decryptedCode = decryptCardCode(card.encryptedCode, user.encryptionKey);
            return {
              ...card.toObject(),
              code: decryptedCode,
              encryptedCode: undefined // Don't send encrypted data to client
            };
          } catch (error) {
            console.error(`Failed to decrypt card ${card.name} - migration issue:`, error.message);
            // For migration compatibility - if decryption fails, check if it needs re-encryption
            return {
              ...card.toObject(),
              code: '[Потрібна переміграція]',
              encryptedCode: undefined,
              needsRemigration: true
            };
          }
        }
        return card.toObject();
      });
    } else if (user.cards.length > 0) {
      // No encryption key but has cards - they need to be re-migrated
      cardsToReturn = user.cards.map(card => {
        if (card.isEncrypted && card.encryptedCode) {
          return {
            ...card.toObject(),
            code: '[Потрібна переміграція]',
            encryptedCode: undefined,
            needsRemigration: true
          };
        }
        return card.toObject();
      });
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        language: user.language,
        createdAt: user.createdAt
      },
      cards: cardsToReturn
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
app.put('/api/auth/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).escape(),
  body('language').optional().isIn(['uk', 'en'])
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { name, language } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (language) updateData.language = language;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
app.put('/api/auth/password', [
  body('currentPassword').exists(),
  body('newPassword').isLength({ min: 6, max: 128 })
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isValidPassword = await user.comparePassword(currentPassword);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid current password' });
    }

    // Hash new password explicitly
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password directly
    await User.findByIdAndUpdate(req.user._id, { 
      password: hashedPassword 
    });

    console.log(`Password changed successfully for user: ${user.email}`);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add card with server-side encryption
app.post('/api/cards', [
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('code').trim().isLength({ min: 1, max: 500 }),
  body('codeType').isIn(['barcode', 'qrcode']),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color')
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { name, code, codeType, color } = req.body;

    const user = await User.findById(req.user._id);
    
    // Generate encryption key for user if they don't have one
    if (!user.encryptionKey) {
      user.encryptionKey = generateUserEncryptionKey();
      console.log(`Generated new encryption key for user: ${user.email}`);
    }
    
    // Encrypt the card code on the server
    const encryptedCode = encryptCardCode(code, user.encryptionKey);
    
    const newCard = {
      name,
      codeType,
      color: color || '#3b82f6',
      encryptedCode,
      isEncrypted: true,
      createdAt: new Date()
    };

    user.cards.push(newCard);
    await user.save();

    // Return cards with decrypted codes for client display
    const cardsWithDecryptedCodes = user.cards.map(card => ({
      ...card.toObject(),
      code: card.isEncrypted ? decryptCardCode(card.encryptedCode, user.encryptionKey) : card.code,
      encryptedCode: undefined // Don't send encrypted data to client
    }));

    res.status(201).json({ cards: cardsWithDecryptedCodes });
  } catch (error) {
    console.error('Add card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update card with server-side encryption
app.put('/api/cards/:id', [
  body('name').optional().trim().isLength({ min: 1, max: 100 }).escape(),
  body('code').optional().trim().isLength({ min: 1, max: 500 }),
  body('codeType').optional().isIn(['barcode', 'qrcode']),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color')
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, codeType, color } = req.body;

    const user = await User.findById(req.user._id);
    const card = user.cards.id(id);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    if (name) card.name = name;
    if (codeType) card.codeType = codeType;
    if (color) card.color = color;
    
    // Handle code update with server-side encryption
    if (code !== undefined) {
      // Generate encryption key for user if they don't have one
      if (!user.encryptionKey) {
        user.encryptionKey = generateUserEncryptionKey();
      }
      
      // Encrypt the new code on the server
      card.encryptedCode = encryptCardCode(code, user.encryptionKey);
      card.isEncrypted = true;
      card.code = undefined; // Clear plain code
    }

    await user.save();
    
    // Return cards with decrypted codes for client display
    const cardsWithDecryptedCodes = user.cards.map(card => ({
      ...card.toObject(),
      code: card.isEncrypted ? decryptCardCode(card.encryptedCode, user.encryptionKey) : card.code,
      encryptedCode: undefined // Don't send encrypted data to client
    }));

    res.json({ cards: cardsWithDecryptedCodes });
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete card
app.delete('/api/cards/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    user.cards.pull({ _id: id });
    await user.save();

    // Return cards with decrypted codes for client display
    let cardsToReturn = user.cards;
    if (user.encryptionKey && user.cards.length > 0) {
      cardsToReturn = user.cards.map(card => ({
        ...card.toObject(),
        code: card.isEncrypted ? decryptCardCode(card.encryptedCode, user.encryptionKey) : card.code,
        encryptedCode: undefined // Don't send encrypted data to client
      }));
    }

    res.json({ cards: cardsToReturn });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Automatic backup scheduling system
class BackupScheduler {
  constructor() {
    this.scheduledBackup = null;
    this.backupSettings = {
      enabled: false,
      frequency: 'daily', // daily, weekly, monthly
      time: '02:00', // 24-hour format
      retention: 30, // days to keep backups
      maxBackups: 10 // maximum number of backups to keep
    };
    this.loadBackupSettings();
  }

  async loadBackupSettings() {
    try {
      const settings = await Settings.findOne({ section: 'backup' });
      if (settings && settings.settings) {
        this.backupSettings = { ...this.backupSettings, ...settings.settings };
      }
      this.scheduleNextBackup();
    } catch (error) {
      console.error('Error loading backup settings:', error);
    }
  }

  async saveBackupSettings() {
    try {
      await Settings.findOneAndUpdate(
        { section: 'backup' },
        { settings: this.backupSettings },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error saving backup settings:', error);
    }
  }

  scheduleNextBackup() {
    if (this.scheduledBackup) {
      clearTimeout(this.scheduledBackup);
      this.scheduledBackup = null;
    }

    if (!this.backupSettings.enabled) {
      console.log('🕐 Automatic backups disabled');
      return;
    }

    const nextBackupTime = this.calculateNextBackupTime();
    const delay = nextBackupTime - Date.now();

    if (delay > 0) {
      this.scheduledBackup = setTimeout(() => {
        this.performScheduledBackup();
      }, delay);

      console.log(`🕐 Next automatic backup scheduled for: ${new Date(nextBackupTime).toLocaleString()}`);
    }
  }

  calculateNextBackupTime() {
    const now = new Date();
    const [hours, minutes] = this.backupSettings.time.split(':').map(Number);
    
    let nextBackup = new Date();
    nextBackup.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow/next period
    if (nextBackup <= now) {
      switch (this.backupSettings.frequency) {
        case 'daily':
          nextBackup.setDate(nextBackup.getDate() + 1);
          break;
        case 'weekly':
          nextBackup.setDate(nextBackup.getDate() + 7);
          break;
        case 'monthly':
          nextBackup.setMonth(nextBackup.getMonth() + 1);
          break;
      }
    }

    return nextBackup.getTime();
  }

  async performScheduledBackup() {
    try {
      console.log('🤖 Starting automatic backup...');
      
      // Create backup filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `auto-backup-${timestamp}.zip`;
      const backupPath = path.join(__dirname, 'backups', filename);

      // Ensure backup directory exists
      await fs.ensureDir(path.join(__dirname, 'backups'));

      // Export all collections
      const collections = {
        users: await User.find({}).lean(),
        blogPosts: await BlogPost.find({}).lean(),
        pages: await Page.find({}).lean(),
        settings: await Settings.find({}).lean(),
        releases: await Release.find({}).lean(),
        feedback: await Feedback.find({}).lean()
      };

      // Create backup info
      const backupInfo = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        type: 'automatic',
        frequency: this.backupSettings.frequency,
        collections: Object.keys(collections),
        totalRecords: Object.values(collections).reduce((sum, collection) => sum + collection.length, 0)
      };

      // Create ZIP archive
      const output = fs.createWriteStream(backupPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', async () => {
        console.log(`✅ Automatic backup created: ${filename} (${archive.pointer()} bytes)`);
        
        // Clean up old backups
        await this.cleanupOldBackups();
        
        // Schedule next backup
        this.scheduleNextBackup();
      });

      archive.on('error', (err) => {
        console.error('❌ Automatic backup failed:', err);
        this.scheduleNextBackup(); // Still schedule next attempt
      });

      archive.pipe(output);
      archive.append(JSON.stringify(collections, null, 2), { name: 'database.json' });
      archive.append(JSON.stringify(backupInfo, null, 2), { name: 'backup-info.json' });
      archive.finalize();

    } catch (error) {
      console.error('❌ Automatic backup error:', error);
      this.scheduleNextBackup(); // Still schedule next attempt
    }
  }

  async cleanupOldBackups() {
    try {
      const backupDir = path.join(__dirname, 'backups');
      const files = await fs.readdir(backupDir);
      
      // Filter only backup files
      const backupFiles = files.filter(file => 
        (file.startsWith('discard-backup-') || file.startsWith('auto-backup-')) && 
        file.endsWith('.zip')
      );

      if (backupFiles.length <= this.backupSettings.maxBackups) {
        return; // No cleanup needed
      }

      // Sort by creation time (oldest first)
      const filesWithStats = await Promise.all(
        backupFiles.map(async (file) => {
          const filePath = path.join(backupDir, file);
          const stats = await fs.stat(filePath);
          return { file, path: filePath, created: stats.birthtime };
        })
      );

      filesWithStats.sort((a, b) => a.created - b.created);

      // Remove excess files
      const filesToRemove = filesWithStats.slice(0, filesWithStats.length - this.backupSettings.maxBackups);
      
      for (const fileInfo of filesToRemove) {
        await fs.remove(fileInfo.path);
        console.log(`🗑️ Removed old backup: ${fileInfo.file}`);
      }

      // Also remove files older than retention period
      const retentionDate = new Date();
      retentionDate.setDate(retentionDate.getDate() - this.backupSettings.retention);

      const oldFiles = filesWithStats.filter(fileInfo => fileInfo.created < retentionDate);
      for (const fileInfo of oldFiles) {
        if (await fs.pathExists(fileInfo.path)) {
          await fs.remove(fileInfo.path);
          console.log(`🗑️ Removed expired backup: ${fileInfo.file}`);
        }
      }

    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }

  updateSettings(newSettings) {
    this.backupSettings = { ...this.backupSettings, ...newSettings };
    this.saveBackupSettings();
    this.scheduleNextBackup();
  }

  getSettings() {
    return this.backupSettings;
  }
}

// Initialize backup scheduler
const backupScheduler = new BackupScheduler();

// API endpoint to get backup settings
app.get('/api/admin/backup/settings', authenticateAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      settings: backupScheduler.getSettings()
    });
  } catch (error) {
    console.error('Error getting backup settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get backup settings'
    });
  }
});

// API endpoint to update backup settings
app.post('/api/admin/backup/settings', authenticateAdmin, async (req, res) => {
  try {
    const { enabled, frequency, time, retention, maxBackups } = req.body;
    
    const newSettings = {};
    if (typeof enabled === 'boolean') newSettings.enabled = enabled;
    if (frequency && ['daily', 'weekly', 'monthly'].includes(frequency)) newSettings.frequency = frequency;
    if (time && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) newSettings.time = time;
    if (typeof retention === 'number' && retention > 0) newSettings.retention = retention;
    if (typeof maxBackups === 'number' && maxBackups > 0) newSettings.maxBackups = maxBackups;

    backupScheduler.updateSettings(newSettings);

    res.json({
      success: true,
      message: 'Backup settings updated',
      settings: backupScheduler.getSettings()
    });
  } catch (error) {
    console.error('Error updating backup settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update backup settings'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler - serve 404.html for non-API requests
app.use((req, res) => {
  // For API requests, send JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }

  // For other requests, serve 404.html
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connected to: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/loyalty-cards'}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});