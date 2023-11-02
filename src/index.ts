import express, { Request, Response } from 'express';
import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

/**
 * @swagger
 * /health-check:
 *   get:
 *     summary: Check if the server is running.
 *     description: Returns a JSON response indicating the server is running.
 *     responses:
 *       200:
 *         description: Server is running.
 *         content:
 *           application/json:
 *             example:
 *               status: Server is running
 */

app.get('/health-check', (req: Request, res: Response) => {
    res.json({ status: 'Server is running'});
});

const swaggerOptions: Options = {
    swaggerDefinition: {
        info: {
            title: 'Express TS Server API',
            description: 'health-check endpoint',
            version: '1.0.0',
        },
    },
    apis: ['src/index.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});