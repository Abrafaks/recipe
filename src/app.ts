import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./config/swagger";
import userRoutes from "./routes/user.routes";
import recipeRoutes from "./routes/recipe.routes";
import imageRoutes from "./routes/image.routes";

dotenv.config();

import "./config/db_config";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.json());

app.use(passport.initialize());

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/auth", userRoutes);
app.use("/recipe", recipeRoutes);
app.use("/image", imageRoutes);

app.listen(app.get("port"), () => {
  console.log(`Server is up on port ${app.get("port")}`);
});

export default app;
