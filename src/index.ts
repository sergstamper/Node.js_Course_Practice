import express, { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

import swaggerUi from 'swagger-ui-express';

import connectToDatabase from './bdconnection.js';
import movieRouter from './routes/movie.router.js';
import genreRouter from './routes/genre.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const swaggerYaml = fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8');
const swaggerDocument = parse(swaggerYaml);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', movieRouter);
app.use('/api', genreRouter);

connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error: unknown) => {
        console.error('Error connecting to MongoDB:', error);
    });


app.get('/health-check', (req: Request, res: Response) => {
    res.json({ status: 'Server is running'});
});

export default app;