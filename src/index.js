import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3000;

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

app.get('/health-check', (req, res) => {
    res.json({ status: 'Server is running'});
});

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Express Server API',
            description: 'health-check endpoint',
            version: '1.0.0',
        },
    },
    apis: ['src/index.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});