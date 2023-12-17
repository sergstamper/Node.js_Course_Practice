import request from 'supertest';
import app from '../src/index';
import GenreModel from '../src/models/genre.model';

describe('Genre API Endpoints', () => {
    it('should create a new genre', async () => {
        const response = await request(app)
        .post('/api/genres')
        .send({
            name: 'Test genre'
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe('Test genre');
    });

    it('should get a list of genres', async () => {
        const response = await request(app).get('/api/genres');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a genre by name', async () => {
        const response = await request(app).get('/api/genres/Test genre');

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Test genre');
    });

    it('should update genre by name', async () => {
        const response = await request(app)
        .put('/api/genres/Test genre')
        .send({
            name: 'Updated genre',
        });

        expect(response.statusCode).toBe(200);

        expect(async () => {
            if (response.body.name) {
                expect(response.body.name).toBe('Updated genre');
            } else {
                fail('Genre not found');
            }
        })
    });

    it('should delete a genre by name', async () => {
        const response = await request(app).delete('/api/genres/Updated genre');

        expect(response.statusCode).toBe(204);
        expect(response.body.name).toBeUndefined();
    });
});

describe('Genre API Error Handling and Validation', () => {
    it('should return 404 if genre not found', async () => {
        const response = await request(app).get('/api/genres/Nonexistent genre');
    
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Genre not found');
        });

    it('should return 400 if creating a genre with invalid data', async () => {
        const response = await request(app)
            .post('/api/genres')
            .send({
                nam: 'Test genre',
            });
    
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeTruthy();
        });

    it('should return 404 if updating a non-existent genre', async () => {
        const response = await request(app)
            .put('/api/genres/Nonexistent genre')
            .send({
                name: 'Nonexistent genre'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Genre not found');
        });

    it('should return 400 if updating a genre with invalid data', async () => {
        const existingGenre = await GenreModel.findOne({ name: 'Comedy' });
    
        if (!existingGenre) {
            fail('Existing movie not found');
        }
    
        const response = await request(app)
            .put(`/api/genres/${encodeURIComponent(existingGenre.name)}`)
            .send({
                nam: 'Test genre',
            });
    
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeTruthy();
    });

    it('should return 404 if deleting a non-existent genre', async () => {
        const response = await request(app).delete('/api/genres/Nonexistent genre');
    
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Genre not found');
    });
});

describe('Genre API Error Handling', () => {
    it('should handle errors when getting the list of genres', async () => {
        jest.spyOn(GenreModel, 'find').mockImplementationOnce(() => {
            throw new Error('Mocked find error');
        });
    
        const response = await request(app).get('/api/genres')
    
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Error getting genres list');
    });

    it('should handle errors when creating a genre', async () => {
        jest.spyOn(GenreModel, 'create').mockImplementationOnce(() => {
            throw new Error('Mocked create error');
        });
    
        const response = await request(app)
            .post('/api/genres')
            .send({ name: 'Test Genre' });
    
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Error creating genre');
    });

    it('should handle errors when updating a genre', async () => {
        jest.spyOn(GenreModel, 'findOneAndUpdate').mockImplementationOnce(() => {
            throw new Error('Mocked update error');
        });
    
        const response = await request(app)
            .put('/api/genres/Test%20Genre')
            .send({ name: 'Updated Genre' });
    
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Error updating genre');
    });

    it('should handle errors when getting a genre', async () => {
        jest.spyOn(GenreModel, 'findOne').mockImplementationOnce(() => {
            throw new Error('Mocked update error');
        });
    
        const response = await request(app).get('/api/genres/Test Genre');
    
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Error getting genre');
    });

    it('should handle errors when deleting a genre', async () => {
        jest.spyOn(GenreModel, 'findOneAndDelete').mockImplementationOnce(() => {
            throw new Error('Mocked delete error');
        });
    
        const response = await request(app).delete('/api/genres/Test Genre');
    
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Error deleting genre');
    });
});