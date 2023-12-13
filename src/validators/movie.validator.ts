import { body, CustomValidator } from 'express-validator';

import GenreModel from '../models/genre.model.js';

const validateGenreExists: CustomValidator = async value => {
  if (!Array.isArray(value)) {
    throw new Error('Genre must be an array of strings');
  }

  const genres = await GenreModel.find({ name: { $in: value } });
  const existingGenres = genres.map(genre => genre.name);

  const missingGenres = value.filter(genre => !existingGenres.includes(genre));

  if (missingGenres.length > 0) {
    throw new Error(
      `The following genres do not exist: ${missingGenres.join(', ')}`,
    );
  }
};

const movieValidation = [
  body('title').notEmpty().withMessage('Movie title required'),
  body('description').notEmpty().withMessage('Movie description required'),
  body('genre').custom(validateGenreExists),
];

export default movieValidation;
