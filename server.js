const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2804;

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
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// App route - serve app.html for /app paths
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loyalty-cards', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
      process.env.JWT_SECRET || 'fallback-secret-key',
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

// Routes

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
      process.env.JWT_SECRET || 'fallback-secret-key',
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

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        language: user.language,
        createdAt: user.createdAt
      },
      token,
      cards: user.cards
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

    user.password = newPassword;
    await user.save();

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
  body('codeType').isIn(['barcode', 'qrcode'])
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { name, code, codeType } = req.body;

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
  body('codeType').optional().isIn(['barcode', 'qrcode'])
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, codeType } = req.body;

    const user = await User.findById(req.user._id);
    const card = user.cards.id(id);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    if (name) card.name = name;
    if (codeType) card.codeType = codeType;
    
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

// ========== НОВІ ROUTES ДЛЯ АДМІН-ПАНЕЛІ ТА ПУБЛІЧНИХ СТОРІНОК ==========

// Імпорт нових routes
const adminAuthRoutes = require('./server/routes/authRoutes');
const adminRoutes = require('./server/routes/adminRoutes');
const blogRoutes = require('./server/routes/blogRoutes');
const faqRoutes = require('./server/routes/faqRoutes');
const settingsRoutes = require('./server/routes/settingsRoutes');
const contactRoutes = require('./server/routes/contactRoutes');
const seoRoutes = require('./server/routes/seoRoutes');

// Підключення нових routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/', seoRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Serve backup files for download
app.get('/backups/:filename', authenticateToken, async (req, res) => {
  try {
    const Admin = require('./server/models/Admin');
    const admin = await Admin.findById(req.user._id);

    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { filename } = req.params;

    if (!filename.startsWith('backup-') || !filename.endsWith('.json')) {
      return res.status(400).json({ error: 'Invalid backup file' });
    }

    const backupPath = path.join(__dirname, 'backups', filename);

    res.download(backupPath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(404).json({ error: 'Backup file not found' });
        }
      }
    });
  } catch (error) {
    console.error('Backup download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// HTML Pages Routes
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});

app.get('/blog-post', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog-post.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

// Admin routes - redirect /kogo to admin panel
app.get('/kogo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/kogo/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

// 404 handler - serve custom 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Automatic backup functionality
const cron = require('node-cron');
const fsBackup = require('fs').promises;
const adminController = require('./server/controllers/adminController');

// Schedule automatic backup every day at 3:00 AM
cron.schedule('0 3 * * *', async () => {
  console.log('Running automatic backup...');

  try {
    const BACKUP_DIR = path.join(__dirname, 'backups');

    // Ensure backup directory exists
    try {
      await fsBackup.access(BACKUP_DIR);
    } catch {
      await fsBackup.mkdir(BACKUP_DIR, { recursive: true });
    }

    const User = mongoose.model('User');
    const Admin = require('./server/models/Admin');
    const BlogPost = mongoose.model('BlogPost');
    const FAQ = mongoose.model('FAQ');
    const Settings = mongoose.model('Settings');
    const ContactMessage = mongoose.model('ContactMessage');

    // Get all data
    const users = await User.find().lean();
    const admins = await Admin.find().lean();
    const blogPosts = await BlogPost.find().lean();
    const faqs = await FAQ.find().lean();
    const settings = await Settings.find().lean();
    const messages = await ContactMessage.find().lean();

    const backup = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      createdBy: 'automatic',
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
    const filename = `backup-auto-${timestamp}.json`;
    const filepath = path.join(BACKUP_DIR, filename);

    await fsBackup.writeFile(filepath, JSON.stringify(backup, null, 2), 'utf8');

    console.log(`✅ Automatic backup created: ${filename}`);

    // Clean up old backups (keep last 30)
    const files = await fsBackup.readdir(BACKUP_DIR);
    const backupFiles = files
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .map(async (f) => {
        const stats = await fsBackup.stat(path.join(BACKUP_DIR, f));
        return { name: f, mtime: stats.mtime };
      });

    const backupsWithStats = await Promise.all(backupFiles);
    backupsWithStats.sort((a, b) => b.mtime - a.mtime);

    // Delete old backups
    if (backupsWithStats.length > 30) {
      for (let i = 30; i < backupsWithStats.length; i++) {
        await fsBackup.unlink(path.join(BACKUP_DIR, backupsWithStats[i].name));
        console.log(`🗑️ Deleted old backup: ${backupsWithStats[i].name}`);
      }
    }

  } catch (error) {
    console.error('❌ Automatic backup failed:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connected to: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/loyalty-cards'}`);
  console.log('🔄 Automatic backup scheduled for 3:00 AM daily');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});