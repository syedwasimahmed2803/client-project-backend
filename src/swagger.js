const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API documentation for your backend service',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local server',
      },
      {
        url: 'https://client-project-backend-5t0m.onrender.com/api',
        description: 'Production server',
      },
    ],
    components: {
      parameters: {
        XForwardedFor: {
          name: 'x-forwarded-for',
          in: 'header',
          description: 'Client IP address, usually set by proxy',
          required: true,
          schema: {
            type: 'string',
            example: '123.123.123.123',
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
