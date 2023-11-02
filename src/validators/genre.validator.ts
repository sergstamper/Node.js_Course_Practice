import { body } from 'express-validator';

const genreValidation = [
    body('name').notEmpty().withMessage('Genre name required'),
];

export default genreValidation;