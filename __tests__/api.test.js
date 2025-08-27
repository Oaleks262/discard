const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Mock the server without starting it
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.MONGODB_URI = 'mongodb://localhost:27017/loyalty-cards-test';

const app = express();

describe('API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    // Clean up test database
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collections before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('Auth Endpoints', () => {
    describe('POST /api/auth/register', () => {
      test('should register a new user successfully', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'strongPassword123'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('реєстрація успішна');
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(userData.email);
      });

      test('should fail with invalid email', async () => {
        const userData = {
          email: 'invalid-email',
          password: 'strongPassword123'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('email');
      });

      test('should fail with weak password', async () => {
        const userData = {
          email: 'test@example.com',
          password: '123'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('пароль');
      });

      test('should fail with duplicate email', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'strongPassword123'
        };

        // Register first user
        await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201);

        // Try to register same email again
        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('існує');
      });
    });

    describe('POST /api/auth/login', () => {
      beforeEach(async () => {
        // Create test user
        const userData = {
          email: 'test@example.com',
          password: 'strongPassword123'
        };

        await request(app)
          .post('/api/auth/register')
          .send(userData);
      });

      test('should login successfully with correct credentials', async () => {
        const loginData = {
          email: 'test@example.com',
          password: 'strongPassword123'
        };

        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('успішний');
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(loginData.email);
        expect(response.headers['set-cookie']).toBeDefined();
      });

      test('should fail with incorrect password', async () => {
        const loginData = {
          email: 'test@example.com',
          password: 'wrongPassword'
        };

        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('пароль');
      });

      test('should fail with non-existent email', async () => {
        const loginData = {
          email: 'nonexistent@example.com',
          password: 'strongPassword123'
        };

        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('користувач');
      });
    });
  });

  describe('Cards Endpoints', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Create and login user to get auth token
      const userData = {
        email: 'test@example.com',
        password: 'strongPassword123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(userData);

      // Extract token from cookie
      const cookieHeader = loginResponse.headers['set-cookie'][0];
      authToken = cookieHeader.split('token=')[1].split(';')[0];
      userId = loginResponse.body.user.id;
    });

    describe('GET /api/cards', () => {
      test('should return empty array for new user', async () => {
        const response = await request(app)
          .get('/api/cards')
          .set('Cookie', [`token=${authToken}`])
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.cards).toEqual([]);
      });

      test('should fail without authentication', async () => {
        const response = await request(app)
          .get('/api/cards')
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('токен');
      });
    });

    describe('POST /api/cards', () => {
      test('should create a new card successfully', async () => {
        const cardData = {
          name: 'Test Card',
          code: '1234567890123',
          codeType: 'barcode'
        };

        const response = await request(app)
          .post('/api/cards')
          .set('Cookie', [`token=${authToken}`])
          .send(cardData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.card).toBeDefined();
        expect(response.body.card.name).toBe(cardData.name);
        expect(response.body.card.code).toBe(cardData.code);
        expect(response.body.card.codeType).toBe(cardData.codeType);
      });

      test('should fail with invalid card data', async () => {
        const cardData = {
          name: '', // Empty name should fail
          code: '1234567890123',
          codeType: 'barcode'
        };

        const response = await request(app)
          .post('/api/cards')
          .set('Cookie', [`token=${authToken}`])
          .send(cardData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBeDefined();
      });

      test('should fail without authentication', async () => {
        const cardData = {
          name: 'Test Card',
          code: '1234567890123',
          codeType: 'barcode'
        };

        const response = await request(app)
          .post('/api/cards')
          .send(cardData)
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('токен');
      });
    });

    describe('DELETE /api/cards/:id', () => {
      let cardId;

      beforeEach(async () => {
        // Create a test card
        const cardData = {
          name: 'Test Card',
          code: '1234567890123',
          codeType: 'barcode'
        };

        const response = await request(app)
          .post('/api/cards')
          .set('Cookie', [`token=${authToken}`])
          .send(cardData);

        cardId = response.body.card._id;
      });

      test('should delete card successfully', async () => {
        const response = await request(app)
          .delete(`/api/cards/${cardId}`)
          .set('Cookie', [`token=${authToken}`])
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('видалена');
      });

      test('should fail with invalid card id', async () => {
        const invalidId = '507f1f77bcf86cd799439011';

        const response = await request(app)
          .delete(`/api/cards/${invalidId}`)
          .set('Cookie', [`token=${authToken}`])
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('знайдена');
      });

      test('should fail without authentication', async () => {
        const response = await request(app)
          .delete(`/api/cards/${cardId}`)
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('токен');
      });
    });
  });

  describe('Rate Limiting', () => {
    test('should apply rate limiting to auth endpoints', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'wrongPassword'
      };

      // First, create a user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: userData.email,
          password: 'correctPassword123'
        });

      // Make multiple failed login attempts
      const promises = [];
      for (let i = 0; i < 12; i++) {
        promises.push(
          request(app)
            .post('/api/auth/login')
            .send(userData)
        );
      }

      const responses = await Promise.all(promises);

      // Check that some requests were rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Input Sanitization', () => {
    test('should sanitize malicious input', async () => {
      const maliciousData = {
        email: 'test@example.com',
        password: 'strongPassword123',
        name: '<script>alert("XSS")</script>',
        description: '{{ constructor.constructor("return process")().exit() }}'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(maliciousData)
        .expect(201);

      // Check that malicious content was sanitized
      expect(response.body.user.name).not.toContain('<script>');
      expect(response.body.user.description).not.toContain('constructor');
    });
  });
});