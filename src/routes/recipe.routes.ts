import express from "express";
import recipeController from "../controllers/recipe.controller";
import { Strategy, auth } from "./middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth.authenticate([Strategy.Bearer]),
  recipeController.createRecipe
);

router.get(
  "/",
  auth.authenticate([Strategy.Bearer]),
  recipeController.getRecipeList
);

router.get(
  "/:id",
  auth.authenticate([Strategy.Bearer]),
  recipeController.readRecipeById
);

router.put(
  "/",
  auth.authenticate([Strategy.Bearer]),
  recipeController.updateRecipe
);

export default router;
