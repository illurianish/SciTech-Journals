import request from 'supertest';
import express from 'express';
import testData from './req_prop_overview.js';
import pool from '../config/database.js';

const { req_prop_add, req_prop_details, req_prop_unit_add } = testData;

// Set test environment to skip Firebase auth
process.env.TEST_ENV = 'test';
let propertyId;

// Import the real property routes  
import propertyRoutes from '../routes/property.js';
import propertyAddRoutes from '../routes/property_add.js'; // Add this import

const createTestApp = () => {
  const app = express();
  app.use(express.json());

  app.use('/api/property', propertyRoutes);
  app.use('/api/property_add', propertyAddRoutes); // Add this line

  return app;
};

// Function to create test user
const createTestUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      ['test-user-uid']
    );

    if (existingUser.rows.length === 0) {
      // Create test user (using correct schema without 'name' column)
      await pool.query(
        'INSERT INTO users (firebase_uid, email, display_name, phone_number, user_role, account_status) VALUES ($1, $2, $3, $4, $5, $6)',
        ['test-user-uid', 'test@test.com', 'Test User', '1234567890', 'test-case', 'active']
      );
      // Test user created
    } else {
      // Test user already exists
    }
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

describe('Property API Tests', () => {
  let testApp;

  beforeAll(async () => {
    testApp = createTestApp();
    await createTestUser();
  });

  describe('Property add API', () => {
    it('should add a property with valid data', async () => {
      const response = await request(testApp)
        .post('/api/property/add')
        .send(req_prop_add);

      // Check if record was successfully inserted into database
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Property added successfully!');
      expect(response.body.propertyId).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      propertyId = response.body.propertyId;
    });

    describe('Property details API', () => {
      it('should add a property with valid data', async () => {
        const response = await request(testApp)
          .post('/api/property/property_details')
          .send(req_prop_details);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Property Details added successfully!');
      });
    });

    
    describe('Property unit add API', () => {
      it('should add a property unit with valid data', async () => {
        const response = await request(testApp)
          .post('/api/property_add/unit_add')
          .send(req_prop_unit_add);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('All Unit Details added successfully!');
        unitId = response.body.unitId;
      });
    });

    describe('Delete property API', () => {
      it('should delete a property with valid data', async () => {
        const response = await request(testApp)
          .delete(`/api/property/${propertyId}`);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Property and all related data deleted successfully!');
      });
    });
  });
});