import express from "express";
import recipeController from "../controllers/recipe.controller";
import { Strategy, auth } from "./middleware/auth";
import RecipeValidator from "./middleware/validators/recipe.validator";
import validate from "./middleware/validators/validator";

const router = express.Router();

router.post(
  "/",
  auth.authenticate([Strategy.Bearer]),
  RecipeValidator.validateCreateRecipeData(),
  validate,
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
  RecipeValidator.validateUpdateRecipeData(),
  validate,
  recipeController.updateRecipe
);

export default router;
