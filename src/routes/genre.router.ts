import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import GenreModel from '../models/genre.model.js';
import genreValidator from '../validators/genre.validator.js';

const router = Router();

router.post('/genres', genreValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const decodedName = decodeURIComponent(req.body.name);

    try {
        const newGenre = await GenreModel.create({ name: decodedName });
        
        res.status(201).json(newGenre);
    } catch (error) {
        console.error('Error creating genre:', error);
        res.status(500).json({ error: 'Error creating genre' });
    }
});

router.get('/genres', async (req: Request, res: Response) => {
    try {
        const genres = await GenreModel.find();
        
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ error: 'Error getting genres list' });
    }
});

router.get('/genres/:name', async (req: Request, res: Response) => {
    const decodedName = decodeURIComponent(req.params.name);

    try {
        const genre = await GenreModel.findOne({ name: decodedName });
        
        if (!genre) {
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.status(200).json(genre);
    } catch (error) {
        console.error('Error getting genre', error);
        res.status(500).json({ error: 'Error getting genre' });
    }
});

router.put('/genres/:name', genreValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const decodedName = decodeURIComponent(req.params.name);

    try {
        const updatedGenre = await GenreModel.findOneAndUpdate(
            { name: decodedName},
            req.body
        );

        if (!updatedGenre) {
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.status(200).json(updatedGenre);
    } catch (error) {
        console.error('Error updating genre', error);
        res.status(500).json({ error: 'Error updating genre' });
    }
});

router.delete('/genres/:name', async (req: Request, res: Response) => {
    const decodedName = decodeURIComponent(req.params.name);

    try {
        const deletedGenre = await GenreModel.findOneAndDelete({ name: decodedName });
        
        if (!deletedGenre) {
            return res.status(404).json({ error: 'Genre not found' });
        }
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deletinggenre' });
    }
});

export default router;