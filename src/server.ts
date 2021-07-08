import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";
import recipeRouter from "./routes/recipe.routes";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING!,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
  }
);

//setting up routes

app.use("/auth", userRouter);
app.use("/recipe", recipeRouter);

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
