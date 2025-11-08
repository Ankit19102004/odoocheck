import request from 'supertest';
import app from '../index';
import db from '../models';
import User from '../models/User';

describe('Projects API', () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // Create test user and get auth token
    const user = await User.create({
      first_name: 'Test',
      last_name: 'Manager',
      email: 'manager@test.com',
      password_hash: 'hashedpassword',
      role: 'project_manager',
      hourly_rate: 50,
    });
    userId = user.id;

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'manager@test.com',
        password: 'hashedpassword',
      });
    
    authToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('POST /api/projects', () => {
    it('should create a project', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'Test description',
          manager_id: userId,
          priority: 'high',
          status: 'planning',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Project');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          name: 'Test Project',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/projects', () => {
    it('should get list of projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});

