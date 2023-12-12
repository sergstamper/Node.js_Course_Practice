import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import MovieModel from '../models/movie.model.js';
import GenreModel from '../models/genre.model.js';
import movieValidation from '../validators/movie.validator.js';

const router = Router();

router.post('', movieValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const decodedTitle = decodeURIComponent(req.body.title);

  try {
    const newMovie = await MovieModel.create({
      ...req.body,
      title: decodedTitle,
    });

    res.status(201).json(newMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: 'Error creating movie' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const movies = await MovieModel.find();

    res.status(200).json(movies);
  } catch (error) {
    console.error('Error getting movie list', error);
    res.status(500).json({ error: 'Error getting movie list' });
  }
});

router.get('/:title', async (req: Request, res: Response) => {
  const decodedTitle = decodeURIComponent(req.params.title);

  try {
    const movie = await MovieModel.findOne({ title: decodedTitle });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error('Error getting movie', error);
    res.status(500).json({ error: 'Error getting movie' });
  }
});

router.put('/:title', movieValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const decodedTitle = decodeURIComponent(req.body.title);

  try {
    const updatedMovie = await MovieModel.findOneAndUpdate(
      { title: decodedTitle },
      req.body,
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie', error);
    res.status(500).json({ error: 'Error updating movie' });
  }
});

router.delete('/:title', async (req: Request, res: Response) => {
  const decodedTitle = decodeURIComponent(req.params.title);

  try {
    const deletedMovie = await MovieModel.findOneAndDelete({
      title: decodedTitle,
    });

    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting movie', error);
    res.status(500).json({ error: 'Error deleting movie' });
  }
});

router.get('/genre/:genreName', async (req: Request, res: Response) => {
  const decodedGenreName = decodeURIComponent(req.params.genreName);

  try {
    const genre = await GenreModel.findOne({ name: decodedGenreName });

    if (!genre) {
      return res.status(404).json({ error: 'Genre not found' });
    }

    const movies = await MovieModel.find({ genre: decodedGenreName });

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Error searching movies by genre' });
  }
});

export default router;
