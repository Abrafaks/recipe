import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import swaggerUI, { SwaggerOptions } from "swagger-ui-express";
import swaggerJSDoc, { SwaggerDefinition } from "swagger-jsdoc";
import userRouter from "./routes/user.routes";
import recipeRouter from "./routes/recipe.routes";

dotenv.config();

import "./config/db_config";
import { Http2ServerRequest } from "http2";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

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

const swaggerOptions: SwaggerOptions = {
  swaggerDefinition,
  apis: ["./**/*routes.ts", "./**/*model.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/auth", userRouter);
app.use("/recipe", recipeRouter);
// app.use("/docs", swaggerUI.serve, swaggerUI.setup(docs));

app.listen(app.get("port"), () => {
  console.log(`Server is up on port ${app.get("port")}`);
});

export default app;
