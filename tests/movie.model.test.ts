import request from 'supertest';
import app from '../src/index';

jest.setTimeout(10000);

describe('Movie Middleware Tests', () => {
  afterEach(async () => {
    await request(app).delete('/api/movies/Test Movie 2');
  });

  it('should set releaseDate if not provided before saving', async () => {
    const response = await request(app)
      .post('/api/movies')
      .send({
        title: 'Test Movie 2',
        description: 'This is a test movie',
        genre: ['Comedy', 'Adventure'],
      });

    expect(response.body.releaseDate).toBeDefined();
  });
});