const mongoose = require('mongoose');

// Setup test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.MONGODB_URI = 'mongodb://localhost:27017/loyalty-cards-test';

// Increase timeout for database operations
jest.setTimeout(30000);

// Global setup
beforeAll(async () => {
  // Suppress console logs during tests
  if (process.env.NODE_ENV === 'test') {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  }
});

afterAll(async () => {
  // Cleanup
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});