import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";
import recipeRouter from "./routes/recipe.routes";
import passport from "passport";

dotenv.config();

import "./config/db_config";
import "./config/passport";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use("/auth", userRouter);
app.use("/recipe", recipeRouter);

export default app;