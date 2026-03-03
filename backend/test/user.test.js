import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import bcrypt from 'bcrypt';

let testUser;
let authToken;

beforeAll(async () => {
  await connectDB();

  // Clean up any existing test data
  await User.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create a test user
  testUser = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
    location: { type: 'Point', coordinates: [78.5, 17.4] },
    visibilityRadius: 5000,
    status: 'approved'
  });

  // Login to get token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'password123' });

  authToken = loginRes.body.token;
});

afterAll(async () => {
  await disconnectDB();
});

describe('User Endpoints', () => {
  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated User',
          visibilityRadius: 3000
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.user.name).toBe('Updated User');
      expect(res.body.user.visibilityRadius).toBe(3000);
    });
  });

  describe('GET /api/users/nearby', () => {
    it('should fetch nearby users within visibility radius', async () => {
      const res = await request(app)
        .get('/api/users/nearby?lng=78.5&lat=17.4')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.users).toBeInstanceOf(Array);
      expect(res.body.users.length).toBeGreaterThan(0);
      expect(res.body.users[0]._id).toBe(testUser._id.toString());
    });
  });
});