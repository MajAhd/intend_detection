import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../index';
import * as redisConfig from '../configs/redisConfig';
import { IntentHandler } from '../services/intent';

// Mock Redis and IntentHandler dependencies
jest.mock('../configs/redisConfig');
jest.mock('../services/intent');

// Sample JWT secret for tests
const JWT_SECRET = 'very_secret_key';

// Utility function to generate JWT
const generateToken = (uid: string) =>
  jwt.sign({ uid }, JWT_SECRET, { expiresIn: '1h' });

// Mock Redis methods explicitly as Jest mock functions
const mockRedisGetContext = redisConfig.getContext as jest.MockedFunction<
  typeof redisConfig.getContext
>;
const mockRedisUpdateContext = redisConfig.updateContext as jest.MockedFunction<
  typeof redisConfig.updateContext
>;

describe('API Route Tests', () => {
  describe('GET /retrieveContext', () => {
    // When everything works
    it('should retrieve user context successfully', async () => {
      const token = generateToken('123');
      mockRedisGetContext.mockResolvedValue('Normal');

      const res = await request(app)
        .get('/api/retrieveContext')
        .set('Authorization', token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.context).toBe('Normal');
    });

    // When token is missing or invalid
    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/retrieveContext');
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe('Unauthorized: No token provided');
    });

    // When Redis throws an error
    it('should handle Redis error', async () => {
      const token = generateToken('123');
      mockRedisGetContext.mockRejectedValue(new Error('Redis error'));

      const res = await request(app)
        .get('/api/retrieveContext')
        .set('Authorization', token);

      expect(res.statusCode).toEqual(500); // Assuming middleware returns 500 on error
    });
  });

  describe('POST /sendMessage', () => {
    // When message is successfully sent
    it('should handle message and return a response', async () => {
      const token = generateToken('123');
      const intentRes = 'Intent handled successfully';

      // Mock IntentHandler response
      IntentHandler.prototype.handleMessage = jest
        .fn()
        .mockReturnValue(intentRes);
      mockRedisUpdateContext.mockResolvedValue();

      const res = await request(app)
        .post('/api/sendMessage')
        .set('Authorization', token)
        .send({ message: 'Hello!' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe(intentRes);
    });

    // Validation error on invalid message input
    it('should return validation error when message is empty', async () => {
      const token = generateToken('123');

      const res = await request(app)
        .post('/api/sendMessage')
        .set('Authorization', token)
        .send({ message: '' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toBe(
        'Message must be at least 1 characters long'
      );
    });

    // Authentication error when token is invalid
    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .post('/api/sendMessage')
        .set('Authorization', 'invalid-token')
        .send({ message: 'Hello' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe('Unauthorized: Invalid token');
    });
  });

  describe('POST /initiateCheckIn', () => {
    // Successful check-in initiation
    it('should initiate check-in and update context', async () => {
      const token = generateToken('123');
      const checkInResponse = 'Check-in initiated';

      // Mock IntentHandler response
      IntentHandler.prototype.CheckInFlow = jest
        .fn()
        .mockReturnValue(checkInResponse);
      mockRedisUpdateContext.mockResolvedValue();

      const res = await request(app)
        .post('/api/initiateCheckIn')
        .set('Authorization', token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe(checkInResponse);
    });

    // When an error occurs
    it('should return 500 on internal error', async () => {
      const token = generateToken('123');
      mockRedisUpdateContext.mockRejectedValue(new Error('Update failed'));

      const res = await request(app)
        .post('/api/initiateCheckIn')
        .set('Authorization', token);

      expect(res.statusCode).toEqual(500); // Assuming middleware returns 500 on error
    });
  });

  describe('POST /updateContext', () => {
    // When context update is successful
    it('should update context and return success message', async () => {
      const token = generateToken('123');
      mockRedisUpdateContext.mockResolvedValue();

      const res = await request(app)
        .post('/api/updateContext')
        .set('Authorization', token)
        .send({ context: 'Normal' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('user context updated');
    });

    // Validation error when invalid context is provided
    it('should return validation error for invalid context', async () => {
      const token = generateToken('123');

      const res = await request(app)
        .post('/api/updateContext')
        .set('Authorization', token)
        .send({ context: 'InvalidContext' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toBe(
        'The context value must be one of Normal,CheckIn,SuicideRisk'
      );
    });
  });
});
