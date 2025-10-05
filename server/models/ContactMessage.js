// Модель повідомлення з контактної форми
const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['support', 'feedback', 'bug', 'feature', 'other'],
    default: 'other'
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  repliedAt: {
    type: Date
  }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
