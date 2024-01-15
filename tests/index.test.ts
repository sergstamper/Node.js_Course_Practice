import request from 'supertest';
import app from '../src/index';

describe('Server Initialization', () => {
    it('should respond with a health check message', async () => {
        const response = await request(app).get('/health-check');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Server is running');
    });
});