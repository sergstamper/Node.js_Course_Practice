import fs from 'fs';
import path from 'path';

import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import connectToDatabase from './bdconnection.js';
import movieRouter from './routes/movie.router.js';
import genreRouter from './routes/genre.router.js';

import config from './config.js';

const filename = path.join(process.cwd(), 'src/swagger.json');

const app = express();

app.use(express.json());

const swaggerJson = fs.readFileSync(filename, 'utf8');
const swaggerDocument = JSON.parse(swaggerJson);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/movies', movieRouter);
app.use('/api/genres', genreRouter);

connectToDatabase()
  .then(() => {
    if (config.NODE_ENV !== 'test') {
      app.listen(config.PORT, () => {
        console.log(`Server is running on port ${config.PORT}`);
      });
    }
  })
  .catch((error: unknown) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.get('/health-check', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

export default app;
