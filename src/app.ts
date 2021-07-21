import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import swaggerUI from "swagger-ui-express";
import userRouter from "./routes/user.routes";
import recipeRouter from "./routes/recipe.routes";
import docs from "./docs/docs";

dotenv.config();

import "./config/db_config";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use("/auth", userRouter);
app.use("/recipe", recipeRouter);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(docs));

app.listen(app.get("port"), () => {
  console.log(`Server is up on port ${app.get("port")}`);
});

export default app;
