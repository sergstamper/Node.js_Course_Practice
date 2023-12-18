import request from 'supertest';
import app from '../src/index';
import MovieModel from '../src/models/movie.model';
import GenreModel from '../src/models/genre.model'

jest.setTimeout(10000);

afterAll(() => {
  app.removeAllListeners();
});

describe('Movie API Endpoints', () => {
  it('should create a new movie', async () => {
    const response = await request(app)
      .post('/api/movies')
      .send({
        title: 'Test Movie',
        description: 'This is a test movie',
        releaseDate: '2022-01-01',
        genre: ['Comedy', 'Adventure'],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Test Movie');
  });

  it('should get a list of movies', async () => {
    const response = await request(app).get('/api/movies');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get movie information by title', async () => {
    const response = await request(app).get('/api/movies/Test Movie');

    expect(response.statusCode).toBe(200);
    expect(response.body.description).toBe('This is a test movie');
  });

  it('should update movie information by title', async () => {
    const response = await request(app)
      .put('/api/movies/Test Movie')
      .send({
        title: 'Test Movie',
        description: 'This is a test movie',
        releaseDate: '2022-01-01',
        genre: ['Mystery'],
      });

      expect(response.statusCode).toBe(200);
      expect(async () => {
        const updatedMovie = await MovieModel.findOne({ title: 'Test Movie' });
        
        if (updatedMovie) {
          expect(updatedMovie.genre[0]).toBe('Mystery');
        } else {
          fail('Movie not found');
        }
      }).not.toThrow();
  });

  it('should delete a movie by title', async () => {
    const response = await request(app).delete('/api/movies/Test Movie');

    expect(response.statusCode).toBe(204);
    expect(response.body.title).toBeUndefined();
  });

  it('should get movies by genre', async () => {
    const response = await request(app).get('/api/movies/genre/Comedy');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('Movie API Error Handling and Validation', () => {
  it('should return 404 if getting a non-existent movie', async () => {
    const response = await request(app).get('/api/movies/Nonexistent Movie');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Movie not found');
  });

  it('should return 400 if creating a movie with invalid data', async () => {
    const response = await request(app)
      .post('/api/movies')
      .send({
        description: 'This is a test movie',
        releaseDate: '2022-01-01',
        genre: ['Action', 'Adventure'],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeTruthy();
  });

  it('should return 404 if updating a non-existent movie', async () => {
    const response = await request(app)
      .put('/api/movies/Nonexistent Movie')
      .send({
        title: 'Nonexistent Movie',
        description: 'This is a test movie',
        releaseDate: '2022-01-01',
        genre: ['Comedy', 'Adventure'],
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Movie not found');
  });

  it('should return 400 if updating a movie with invalid data', async () => {
    const existingMovie = await MovieModel.findOne({ title: 'Movie 3' });

    if (!existingMovie) {
      fail('Existing movie not found');
    }

    const response = await request(app)
      .put(`/api/movies/${encodeURIComponent(existingMovie.title)}`)
      .send({
        title: 'Test Movie',
        releaseDate: '2022-01-01',
        genre: ['Action', 'Adventure'],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeTruthy();
  });

  it('should return 404 if deleting a non-existent movie', async () => {
    const response = await request(app).delete('/api/movies/Nonexistent Movie');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Movie not found');
  });
});

describe('Movie Genre Search API', () => {
  it('should return movies for a specific genre', async () => {
    const response = await request(app).get('/api/movies/genre/Comedy');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return an empty array for a non-existent genre', async () => {
    const response = await request(app).get('/api/movies/genre/NonexistentGenre');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Genre not found');
  });

});

describe('Movie API Error Handling', () => {
  it('should handle errors when getting the list of movies', async () => {
      jest.spyOn(MovieModel, 'find').mockImplementationOnce(() => {
          throw new Error('Mocked find error');
      });
  
      const response = await request(app).get('/api/movies')
  
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Error getting movie list');
  });

  it('should handle errors when creating a movie', async () => {
      jest.spyOn(MovieModel, 'create').mockImplementationOnce(() => {
          throw new Error('Mocked create error');
      });
  
      const response = await request(app)
        .post('/api/movies')
        .send({
          title: 'Test Movie',
          description: 'This is a test movie',
          releaseDate: '2022-01-01',
          genre: ['Mystery'],
        });
  
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Error creating movie');
  });

  it('should handle errors when updating a movie', async () => {
      jest.spyOn(MovieModel, 'findOneAndUpdate').mockImplementationOnce(() => {
          throw new Error('Mocked update error');
      });
  
      const response = await request(app)
          .put('/api/movies/Test movie')
          .send({
            title: 'Updated Movie',
            description: 'This is an updated test movie',
            releaseDate: '2022-01-01',
            genre: ['Comedy']
          });
  
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Error updating movie');
  });

  it('should handle errors when getting a movie by title', async () => {
      jest.spyOn(MovieModel, 'findOne').mockImplementationOnce(() => {
          throw new Error('Mocked update error');
      });
  
      const response = await request(app).get('/api/movies/Test movie');
  
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Error getting movie');
  });

  it('should handle errors when deleting a movie', async () => {
      jest.spyOn(MovieModel, 'findOneAndDelete').mockImplementationOnce(() => {
          throw new Error('Mocked delete error');
      });
  
      const response = await request(app).delete('/api/movies/Test movie');
  
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Error deleting movie');
  });

  it('should handle errors when searching movies by genre', async () => {
    jest.spyOn(GenreModel, 'findOne').mockImplementationOnce(() => {
      throw new Error('Mocked findOne error');
    });

    const response = await request(app).get('/api/movies/genre/TestGenre');

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Error searching movies by genre');
  });
});