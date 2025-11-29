import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import Resource from '../src/models/Resource.js';
import User from '../src/models/User.js';

let testUser;
let testResource;
let authToken;

beforeAll(async () => {
  await connectDB();
  
  // Clean up any existing test data
  await User.deleteMany({});
  await Resource.deleteMany({});

  const apartmentId = new mongoose.Types.ObjectId();

  // Hash passwords before user creation
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create an approved test user with admin role
  testUser = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
    apartment: apartmentId,
    role: 'apartment_admin',
    status: 'approved'
  });

  // Create a resident user
  const residentUser = await User.create({
    name: 'Test Resident',
    email: 'resident@example.com',
    password: hashedPassword,
    apartment: apartmentId,
    role: 'resident',
    status: 'approved'
  });

  // Create a resource owned by the test user
  testResource = await Resource.create({
    title: 'Test Resource',
    description: 'Test Description',
    category: 'tools',
    owner: testUser._id,
    apartment: apartmentId,
    status: 'available'
  });

  // Login to get token
  // Ensure user is approved before getting token
  await User.findByIdAndUpdate(testUser._id, { status: 'approved' });
  await User.findByIdAndUpdate(residentUser._id, { status: 'approved' });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'password123' });

if (!loginRes.body.token) {
  console.error('Login failed:', loginRes.body);
  throw new Error('Failed to get auth token');
}

console.log('Login successful. Token:', loginRes.body.token);
console.log('User details:', {
  id: loginRes.body.user.id,
  role: loginRes.body.user.role,
  apartment: loginRes.body.user.apartment
});

authToken = loginRes.body.token;
});



describe('Resource Endpoints', () => {
  describe('GET /resources/:apartmentId', () => {
    it('should return resources for an apartment', async () => {
      const res = await request(app)
        .get(`/api/resources/${testUser.apartment}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.some(r => r.title === 'Test Resource')).toBeTruthy();
    });
  });

  describe('PATCH /resources/:id/request', () => {
    it('should change resource status to requested', async () => {
      // Login as resident user first
      const residentLoginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'resident@example.com', password: 'password123' });
      
      const res = await request(app)
        .patch(`/api/resources/${testResource._id}/request`)
        .set('Authorization', `Bearer ${residentLoginRes.body.token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toEqual('requested');
      expect(res.body.data.borrower).toEqual(residentLoginRes.body.user.id);
    });
  });



  describe('PATCH /resources/:id/approve', () => {
    it('should approve a resource request', async () => {
      console.log('Starting approval test...');
      
      // Reset resource to available state before test
      await Resource.findByIdAndUpdate(testResource._id, {
        status: 'available',
        borrower: null
      });
      
      // First make a request as resident
      console.log('Logging in as resident user...');
      const residentLoginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'resident@example.com', password: 'password123' });
      
      console.log('Resident login successful:', {
        userId: residentLoginRes.body.user.id,
        role: residentLoginRes.body.user.role,
        apartment: residentLoginRes.body.user.apartment,
        token: residentLoginRes.body.token.substring(0, 10) + '...'
      });
      
      console.log('Test resource details:', {
        id: testResource._id,
        owner: testResource.owner,
        status: testResource.status,
        apartment: testResource.apartment
      });
      
      let requestRes;
      try {
        console.log('Making request for resource:', testResource._id);
        console.log('Using resident token:', residentLoginRes.body.token.substring(0, 10) + '...');
        
        console.log('Request details:', {
          method: 'PATCH',
          url: `/api/resources/${testResource._id}/request`,
          headers: {
            Authorization: `Bearer ${residentLoginRes.body.token.substring(0, 10)}...`,
            'Content-Type': 'application/json'
          },
          body: {}
        });
        
        requestRes = await request(app)
          .patch(`/api/resources/${testResource._id}/request`)
          .set('Authorization', `Bearer ${residentLoginRes.body.token}`)
          .set('Content-Type', 'application/json');
          
        if (requestRes.statusCode !== 200) {
          console.error('Detailed request error:', {
            url: `/api/resources/${testResource._id}/request`,
            status: requestRes.statusCode,
            error: requestRes.body.error,
            message: requestRes.body.message,
            residentApartment: residentLoginRes.body.user.apartment,
            resourceApartment: testResource.apartment
          });
        }
        
        console.log('Request response:', {
          status: requestRes.statusCode,
          body: requestRes.body,
          headers: requestRes.headers
        });
        
        if (requestRes.statusCode !== 200) {
          console.error('Request failed - full details:', {
            url: `/api/resources/${testResource._id}/request`,
            method: 'PATCH',
            status: requestRes.statusCode,
            body: requestRes.body,
            headers: requestRes.headers,
            residentUserId: residentLoginRes.body.user.id,
            resourceId: testResource._id,
            resourceOwner: testResource.owner,
            residentUserRole: residentLoginRes.body.user.role,
            residentUserApartment: residentLoginRes.body.user.apartment
          });
          throw new Error('Resource request failed');
        }
      } catch (err) {
        console.error('Request test failed:', err);
        throw err;
      }
      
      // Get current resource state with full details
      const resourceBefore = await Resource.findById(testResource._id)
        .populate('owner', 'name role')
        .populate('borrower', 'name role');
      console.log('Resource before approval:', {
        status: resourceBefore.status,
        owner: {
          id: resourceBefore.owner._id,
          name: resourceBefore.owner.name,
          role: resourceBefore.owner.role
        },
        borrower: resourceBefore.borrower ? {
          id: resourceBefore.borrower._id,
          name: resourceBefore.borrower.name,
          role: resourceBefore.borrower.role
        } : null,
        apartment: resourceBefore.apartment
      });
      
      // Verify request was successful
      if (requestRes.statusCode !== 200) {
        console.error('Request failed:', {
          status: requestRes.statusCode,
          body: requestRes.body,
          headers: requestRes.headers
        });
      }
      
      // Then approve as admin
      let res;
      try {
        res = await request(app)
          .patch(`/api/resources/${testResource._id}/approve`)
          .set('Authorization', `Bearer ${authToken}`);

        if (res.statusCode !== 200) {
          console.error('Approve error response:', {
            status: res.statusCode,
            body: res.body,
            headers: res.headers
          });
          
          // Check resource state after failed approval
          const resourceAfter = await Resource.findById(testResource._id);
          console.error('Resource after failed approval:', {
            status: resourceAfter.status,
            borrower: resourceAfter.borrower
          });
        }

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toEqual('borrowed');
        expect(res.body.data.borrower._id).toEqual(residentLoginRes.body.user.id);

      } catch (err) {
        console.error('Approval test failed:', err);
        throw err;
      }
    });
  });

  describe('PATCH /resources/:id/return', () => {
    it('should return a borrowed resource', async () => {
      // First make a request as resident
      const residentLoginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'resident@example.com', password: 'password123' });
      
      await request(app)
        .patch(`/api/resources/${testResource._id}/request`)
        .set('Authorization', `Bearer ${residentLoginRes.body.token}`);
      
      // Then approve as admin
      await request(app)
        .patch(`/api/resources/${testResource._id}/approve`)
        .set('Authorization', `Bearer ${authToken}`);
      
      // Finally return as resident
      console.log('Using resident token for return:', residentLoginRes.body.token.substring(0, 10) + '...');
      const res = await request(app)
        .patch(`/api/resources/${testResource._id}/return`)
        .set('Authorization', `Bearer ${residentLoginRes.body.token}`);
        
      if (res.statusCode !== 200) {
        console.error('Return error details:', {
          status: res.statusCode,
          error: res.body.error,
          message: res.body.message,
          borrower: residentLoginRes.body.user.id,
          resourceBorrower: testResource.borrower
        });
      }

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toEqual('available');
      expect(res.body.data.borrower).toBeNull();
    });
  });
});