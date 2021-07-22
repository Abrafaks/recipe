import { SwaggerOptions } from "swagger-ui-express";
import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Recipe API",
    description: "A simple recipe API",
    version: "1.0.0",
    contact: {
      name: "Marcin Matoga",
      email: "marcin.matoga.poznan@gmail.com",
    },
  },
  components: {
    securitySchemes: {
      Bearer: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      Basic: {
        type: "http",
        scheme: "basic",
      },
    },
  },

  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      scheme: "bearer",
      name: "Authorization",
      in: "header",
    },
    Basic: {
      type: "apiKey",
      scheme: "basic",
      name: "Authorization",
      in: "header",
    },
  },
  host: "https://mooduprecipeapi.herokuapp.com/",
  basePath: "/",
};

export const swaggerOptions: SwaggerOptions = {
  swaggerDefinition,
  apis: ["./**/*routes.ts", "./**/*model.ts"],
};
