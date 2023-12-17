import request from 'supertest';
import app from '../src/index'

describe('Movie Validator Test', () => {
    it('should return an error for non-array genre', async () => {
        const response = await request(app)
            .post('/api/movies')
            .send({ 
                title: 'Test Movie', 
                description: 'Test Description', 
                genre: 'InvalidGenre' 
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Genre must be an array of strings');
    });
});