import express from "express";
import userRoutes from "./user.routes";
import recipeRoutes from "./recipe.routes";
import imageRoutes from "./image.routes";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "../config/swagger";

const app = express();

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/auth", userRoutes);
app.use("/recipe", recipeRoutes);
app.use("/image", imageRoutes);
app.use("*", (req, res) => {
  res.status(404).send("Page not found.");
});

export default app;
